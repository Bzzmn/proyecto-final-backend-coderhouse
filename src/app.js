import express from 'express';
import { create }  from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import usersRouter from './routes/users.router.js';
import __dirname from './utils.js';
import mongoose from 'mongoose';
import { auth, attachUser } from './middlewares/authMiddleware.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';
import cookieParser from 'cookie-parser';
import { helpers } from './helpers/handlebarsHelpers.js';

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
    partialsDir: __dirname + '/views/partials',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use(attachUser);

initializePassport();
app.use(passport.initialize());

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/api/users', usersRouter);
app.use('/', viewsRouter);
app.use('/current', auth('admin'), (req, res) => {
    res.send('Esta es una vista privada');
});

app.use((req, res, next) => {
    res.status(404).render('404', {
        title: '404 - Página no encontrada'
    })
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

