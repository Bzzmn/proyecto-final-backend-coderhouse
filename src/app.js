import express from 'express';
import { create }  from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import usersRouter from './routes/users.router.js';
import currentRouter from './routes/current.router.js';
import { __dirname } from './utils/index.js';
import mongoose from 'mongoose';
import { auth, attachUser } from './middlewares/authMiddleware.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import { helpers } from './helpers/handlebarsHelpers.js';
import cors from 'cors';
import path from 'path';

const app = express();
const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGODB_URI;

async function connectToMongoDB() {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('Database connection error:', error);
    }
};
connectToMongoDB();

const hbs = create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: helpers,
    partialsDir: path.join(__dirname, 'src', 'views', 'partials'),
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')
app.set('views', path.join(__dirname, 'src', 'views'));

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'src', 'public')));

app.use(attachUser);

initializePassport();
app.use(passport.initialize());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);

app.use('/current', auth('admin'), currentRouter);
app.use((req, res, next) => {
    res.status(404).render('404', {
        title: '404 - Página no encontrada'
    })
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

