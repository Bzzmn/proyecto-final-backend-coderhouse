import { Router } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { body, validationResult } from 'express-validator';
import __dirname from '../utils.js';

const router = Router();
const cartsFilePath = path.join(__dirname, '/data/carts.json');

//Post
router.post('/', [ body('products').notEmpty().isArray() ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const data = await fs.readFile(cartsFilePath, 'utf-8');
        const carts = JSON.parse(data);
        const newCart = req.body;
        newCart.id = carts.length + 1;
        carts.push(newCart);
        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
        res.status(201).json(newCart);
    } catch (error) {
        res.status(500).json({ message: 'Error saving new cart', error: error.message });
    }
});


//Get
router.get('/:cid', async (req, res) => {
    try {
        const data = await fs.readFile(cartsFilePath, 'utf-8');
        const carts = JSON.parse(data);
        const cart = carts.find(cart => cart.id === parseInt(req.params.cid));
        if (!cart) {
            return res.status(404).json({message: 'Cart not found'});
        }
        res.status(201).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error reading cart', error: error.message});
    }
});


//Post
router.post('/:cid/product/:pid', [ body('quantity').notEmpty().isNumeric() ], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const data = await fs.readFile(cartsFilePath, 'utf-8');
        const carts = JSON.parse(data);
        const cart = carts.find(cart => cart.id === parseInt(req.params.cid));
        
        if (!cart) {
            return res.status(404).json({message: 'Cart not found'});
        } 

        const product = req.body;
        product.id = parseInt(req.params.pid);

        const existingProduct = cart.products.find(product => product.id === parseInt(req.params.pid));
        if (existingProduct) {
            existingProduct.quantity += parseInt(product.quantity);
        } else {
            cart.products.push(product);
        }

        await fs.writeFile(cartsFilePath, JSON.stringify(carts, null, 2));
        res.status(201).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error saving new product to cart', error: error.message });
    }
});

export default router;