
import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();

const productsFilePath = path.join(__dirname, '../data/products.json');


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

// router.get('/realtimeproducts') async (req, res) => {

// }

export default router;