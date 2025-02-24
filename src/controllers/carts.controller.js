import { 
    addProductToCartService, 
    getCartQuantityService, 
    removeProductFromCart,
    makePurchaseService, 
    getCartService
} from '../services/cart.service.js';

export const addToCartController = async (req, res) => {
    try {
        const updatedCart = await addProductToCartService(req, res);
        res.status(200).json(updatedCart);
    } catch (error) {
        res.status(500).json({ message: 'Error adding product to cart', error: error.message });
    }
};

export const getCartQuantityController = async (req, res) => {
    try {
        const cart = await getCartService(req.user?._id);
        
        // If no cart exists, return 0
        if (!cart) {
            return res.json({ quantity: 0 });
        }

        // Calculate total quantity from cart items
        const totalQuantity = cart.products.reduce((total, item) => {
            return total + (item.quantity || 0);
        }, 0);

        return res.json({ quantity: totalQuantity });
    } catch (error) {
        console.error('Error in getCartQuantityController:', error);
        // Only send one response
        return res.status(500).json({ 
            status: 'error',
            message: 'Error fetching cart quantity',
            quantity: 0 
        });
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

export const makePurchaseController = async (req, res) => {
    console.log('inciando compra');
    const userId = req.user?._id;

    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }

    try {
        const purchase = await makePurchaseService(userId);
        res.status(200).json(purchase);
    } catch (error) {
        console.error('Error making purchase:', error);
        res.status(500).json({ message: 'Error making purchase', error: error.message });
    }
};

export const getCartController = async (req, res) => {
    try {
        const cart = await getCartService(req.user?._id);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error getting cart:', error);
        res.status(500).json({ message: 'Error getting cart', error: error.message });
    }
};
