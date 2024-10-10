import mongoose from 'mongoose';
import { addProductToCart } from '../services/cart.service.js';
import cartModel from '../models/cart.model.js';

export const addToCart = async (req, res) => {
    const userId = req.user?._id;
    const { productId, quantity: rawQuantity = 1 } = req.body;
    const quantity = Math.max(1, rawQuantity);

    if(!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    if(!productId) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        const updatedCart = await addProductToCart(userId, productId, quantity);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error: error.message });
    }
};

export const getCartQuantity = async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        // User is not authenticated, return 0
        return res.status(200).json({ quantity: 0 });
    }

    try {
        const cart = await cartModel.findOne({ user: userId });
        const quantity = cart ? cart.products.reduce((acc, curr) => acc + curr.quantity, 0) : 0;
        res.status(200).json({ quantity });
    } catch (error) {
        console.error('Error fetching cart quantity:', error);
        res.status(500).json({ message: 'Error fetching cart quantity', error: error.message });
    }
};

export const removeFromCart = async (req, res) => {
    const userId = req.user?._id;
    const { pid } = req.params;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    if (!pid) {
        return res.status(400).json({ message: 'Product ID is required' });
    }

    try {
        const cart = await cartModel.findOne({ user: userId }).populate('products.product');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const productToRemove = cart.products.find(p => p.product._id.toString() === pid);
        if (!productToRemove) {
            return res.status(404).json({ message: 'Product not found in cart' });
        }

        const initialQuantity = productToRemove.quantity;
        await cartModel.updateOne(
            { user: userId },
            { $pull: { products: { product: new mongoose.Types.ObjectId(pid) } } } 
        );

        res.status(200).json({ message: 'Product removed from cart', removedQuantity: initialQuantity });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Error removing product from cart', error: error.message });
    }
};