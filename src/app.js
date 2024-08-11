import express from 'express';
import { create }  from 'express-handlebars';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';

import mongoose from 'mongoose';

const app = express();
const PORT = 8080;

async function connectToMongoDB() {
    try {
        await mongoose.connect('mongodb+srv://alvaroacevedoing:D1g1t4l.mongodb@cluster0.om8br5c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
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

    helpers: {
        eq: (a, b) => a === b,
        add: (a, b) => a + b,
        gt: (a, b) => a > b,
        lt: (a, b) => a < b,
        subtract: (a, b) => a - b,
        multiply: (a, b) => a * b,
        range: (start, end) => {
            let array = [];
            for (let i = start; i <= end; i++) {
                array.push(i);
            }
            return array;
        },
    },
    partialsDir: __dirname + '/views/partials',
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars')
app.set('views', __dirname + '/views');

app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

