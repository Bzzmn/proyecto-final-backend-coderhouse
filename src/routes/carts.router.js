import { Router } from 'express';
import cartModel from '../models/cart.model.js';
import { auth } from '../middlewares/authMiddleware.js';
import { addToCart, getCartQuantity, removeFromCart } from '../controllers/carts.controller.js';

const router = Router();

//Post
router.post('/', auth('user'), addToCart);
router.get('/quantity', getCartQuantity);
router.delete('/product/:pid', auth('user'), removeFromCart);


router.get('/', async (req, res) => {
    try {
        const cart = await cartModel.find()
        res.status(201).json(cart);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Error reading cart', error: error.message});
    }
});

//Get by cart id
router.get('/:cid', async (req, res) => {
    const id = req.params.cid;
    try {
        const cart = await cartModel.findById(id)
        console.log(cart)
        if (!cart) {
            return res.status(404).json({message: 'Cart not found'});
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error reading cart', error: error.message });
    }
})


//Delete product by cart id and product id
router.delete('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartModel.findById(cartId);
    if (!cart) {
        return res.status(404).json({message: 'Cart not found'});
    }

    const existingProductIndex = cart.products.findIndex(item => item.product._id.toString() == productId);

    try {
        if (existingProductIndex !== -1) {
            cart.products.splice(existingProductIndex, 1);
        }

        await cart.save();
        res.status(204).json(cart);

    } catch (error) {
        res.status(500).json({ message: 'Error deleting product from cart', error: error.message });
    }

});

// Put by cart id
router.put('/:cid', async (req, res) => {
    const id = req.params.cid;

    try {
        const cart = await cartModel.findByIdAndUpdate(id, req.body)
        if (!cart) {
            return res.status(404).json({message: 'Cart not found'});
        }

        res.status(201).json({message: 'cart updated'});
    } catch (error) {
        res.status(500).json({ message: 'Error updating cart', error: error.message });
    }
});



//Put by cart id and product id
router.put('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    try {
        const cart = await cartModel.findById(cartId);
        if (!cart) {
            return res.status(404).json({message: 'Cart not found'});
        }

        const existingProductIndex = cart.products.findIndex(item => item.product._id.toString() == productId);

        if (existingProductIndex !== -1) {
            cart.products[existingProductIndex].quantity = quantity;

        } else {
            return res.status(404).json({message: 'Product not found in cart'});
        }

        await cart.save();
        res.status(201).json(cart);

    } catch (error) {
        res.status(500).json({ message: 'Error updating product in cart', error: error.message });
    }
});


//Delete products by cart id , delete all products from cart
router.delete('/:cid', async (req, res) => {
    const id = req.params.cid;
    try {
        const cart = await cartModel.findById(id);
        if (!cart) {
            return res.status(404).json({message: 'Cart not found'});
        }
        cart.products = [];
        await cart.save();
        res.status(204).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Error deleting products from cart', error: error.message });
    }
})

export default router;