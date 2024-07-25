
import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import __dirname from '../utils.js';

const router = Router();

const productsFilePath = path.join(__dirname, '/data/products.json');

router.get('/', async (req, res) => {
    try {  
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
    
        res.render('home', { products });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reading products file', error: error.message });
    }
});

router.get('/realtimeproducts', (req, res) => {
    res.render('realtimeproducts', {});
});

export default router;