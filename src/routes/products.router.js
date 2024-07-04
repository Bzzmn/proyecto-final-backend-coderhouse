import { Router } from 'express';
const router = Router();

const products = []

//Get
router.get('/products', (req, res) => {
    res.json(products);
});

//Post
router.post('/products', (req, res) => {
    const newProduct = req.body;
    console.log(newProduct);
    products.push(newProduct);
    res.json({message: 'product added'});
});

export default router;