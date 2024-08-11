import mongoose from 'mongoose';
import productModel from '../models/product.model.js';
import fs from 'fs';
import path from 'path';

async function loadProducts() {
    const filePath = path.resolve('src/data/products.json');
    const data = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(data);
}

async function seedProducts() {
    try {
        await mongoose.connect('mongodb+srv://alvaroacevedoing:D1g1t4l.mongodb@cluster0.om8br5c.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected');

        const products = await loadProducts();

        await productModel.deleteMany({});
        console.log('Products deleted');
        
        await productModel.insertMany(products);
        console.log('Products inserted');

        mongoose.connection.close();

    } catch (error) {
        console.error('Database connection error:', error);
    }
}

seedProducts();