import DAOFactory from '../daos/DAOFactory.js';
import { PERSISTENCE } from '../config/persistence.js';

const cartDAO = DAOFactory.getDAO('CART', PERSISTENCE);

export const addProductToCart = async (userId, productId, quantity) => {
    try {
        return await cartDAO.addProduct(userId, productId, quantity);
    } catch (error) {
        console.error('Error adding product to cart:', error);          
        throw error;
    }
};

export const getCartQuantity = async (userId) => {
    return await cartDAO.getCartQuantity(userId);
};

export const removeProductFromCart = async (userId, productId) => {
    const cart = await cartDAO.findByUserPopulated(userId);
    if (!cart) {
        throw new Error('Cart not found');
    }

    const productToRemove = cart.products.find(p => p.product._id.toString() === productId);
    if (!productToRemove) {
        throw new Error('Product not found in cart');
    }

    const initialQuantity = productToRemove.quantity;
    const removed = await cartDAO.removeProduct(userId, productId);
    if (!removed) {
        throw new Error('Failed to remove product from cart');
    }
    return initialQuantity;
};

