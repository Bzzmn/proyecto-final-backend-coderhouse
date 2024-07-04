import { Router } from 'express';
const router = Router();

const carts = []

//Get
router.get('/carts', (req, res) => {
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