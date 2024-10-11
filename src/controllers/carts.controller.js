import { 
    addProductToCart, 
    getCartQuantity, 
    removeProductFromCart 
} from '../services/cart.service.js';

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

export const getCartQuantityController = async (req, res) => {
    const userId = req.user?._id;

    if (!userId) {
        return res.status(200).json({ quantity: 0 });
    }

    try {
        const quantity = await getCartQuantity(userId);
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
        const removedQuantity = await removeProductFromCart(userId, pid);
        res.status(200).json({ message: 'Product removed from cart', removedQuantity });
    } catch (error) {
        console.error('Error removing product from cart:', error);
        res.status(500).json({ message: 'Error removing product from cart', error: error.message });
    }
};