import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { body, validationResult } from 'express-validator';
import { fileURLToPath} from 'url';
import { dirname } from 'path';

const router = Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const productsFilePath = path.join(__dirname, '../data/products.json');

const productValidationRules = [
    body('title').notEmpty().withMessage('Title is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('code').notEmpty().withMessage('Code is required'),
    body('price').notEmpty().isNumeric().withMessage('Price is required'),
    body('stock').notEmpty().isNumeric().withMessage('Stock is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('thumbnails').optional().isArray(),
];


//Get
router.get('/products', async (req, res) => {
    const limit = parseInt(req.query.limit) || 12;
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
        res.json(products.slice(0, limit));
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error reading products file', error: error.message});
    }
});

router.get('/products/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
        const product = products.find(product => product.id === id);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error reading products file', error: error.message });
    }
});

//Post
router.post('/products', productValidationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
        const newProduct = req.body;
        newProduct.id = products.length + 1;
        products.push(newProduct);
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error saving new product', error: error.message });
    }
});

//Put
router.put('/products/:pid', productValidationRules, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    const id = parseInt(req.params.pid);

    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
        const product = products.find(product => product.id === id);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        const updatedProduct = req.body;
        updatedProduct.id = id;
        products[id - 1] = updatedProduct;

        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');

        res.status(201).json({message: 'product updated'});
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
});

//Delete
router.delete('/products/:pid', async (req, res) => {
    const id = parseInt(req.params.pid);
    try {
        const data = await fs.readFile(productsFilePath, 'utf-8');
        const products = JSON.parse(data);
        const product = products.find(product => product.id === id);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        products.splice(id - 1, 1);
        await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2), 'utf-8');
        res.json({message: 'product deleted'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
});

export default router;