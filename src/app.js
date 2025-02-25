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

import cors from 'cors';
import path from 'path';
import { configureHandlebars } from './config/handlebars.config.js';

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

console.log('__dirname:', __dirname);
console.log('Views directory:', path.join(__dirname, 'views'));

const hbs = configureHandlebars(app);

app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public', 'js')));

app.use(attachUser);

initializePassport();
app.use(passport.initialize());

app.use('/api/products', productsRouter);
// app.use('/api/carts', cartsRouter);
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

export default app;
