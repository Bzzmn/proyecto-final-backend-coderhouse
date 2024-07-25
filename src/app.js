import express from 'express';
import handlebars from 'express-handlebars';
import { Server } from 'socket.io';
import productsRouter from './routes/products.router.js';
import cartsRouter from './routes/carts.router.js';
import viewsRouter from './routes/views.router.js';
import __dirname from './utils.js';


import fs from 'fs/promises';
import path from 'path';
const productsFilePath = path.join(__dirname, '/data/products.json');

const getProducts = async () => {
    try{
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
        return products;
    } catch (error) {
        console.error(error);
    }}


const app = express();
const PORT = 8080;

app.engine('handlebars', handlebars.engine());
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars')
app.use(express.static(__dirname + '/public'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


const io = new Server(server)

let messages = [];

io.on('connection', (socket) => {
    console.log('New connection', socket.id);
    getProducts().then((products) => {
        socket.emit('products', products);
    });
});


app.use((req, res, next) => {
    req.io = io
    next();
});
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
app.use('/', viewsRouter);


