import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// Load environment variables
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.development' });

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// MongoDB Schema
const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnails: [String],
    status: {
        type: Boolean,
        default: true
    }
});

const Product = mongoose.model('Product', productSchema);

async function seedProducts() {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined in environment variables');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Read the products JSON file
        const productsData = await fs.readFile(
            join(__dirname, '..', 'data', 'products.json'),
            'utf-8'
        );
        const products = JSON.parse(productsData);

        // Delete existing products
        await Product.deleteMany({});
        console.log('Existing products deleted');

        // Add status field to each product
        const productsWithStatus = products.map(product => ({
            ...product,
            status: true
        }));

        // Insert new products
        const result = await Product.insertMany(productsWithStatus);
        console.log(`${result.length} products inserted successfully`);

    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    } finally {
        // Close the MongoDB connection
        if (mongoose.connection.readyState === 1) {
            await mongoose.connection.close();
            console.log('MongoDB connection closed');
        }
    }
}

// Run the seeding function
seedProducts(); 