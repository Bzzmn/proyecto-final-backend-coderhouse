import DAOFactory from '../data/DAOs/DAOFactory.js';
import { PERSISTENCE } from '../config/persistence.js';

const cartRepository = DAOFactory.getRepository('CART', PERSISTENCE);
const productRepository = DAOFactory.getRepository('PRODUCT', PERSISTENCE);
const userRepository = DAOFactory.getRepository('USER', PERSISTENCE);
const ticketRepository = DAOFactory.getRepository('TICKET', PERSISTENCE);

export const addProductToCartService = async (req, res) => {

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
        return await cartRepository.addProduct(userId, productId, quantity);
    } catch (error) {
        console.error('Error adding product to cart:', error);          
        throw error;
    }
};

export const getCartQuantityService = async (req, res) => {

    const userId = req.user?._id;

    if (!userId) {
        return res.status(200).json({ quantity: 0 });
    }

    try {
        return await cartRepository.getCartQuantity(userId);
    } catch (error) {
        console.error('Error fetching cart quantity:', error);
        throw error;
    }
};

export const removeProductFromCart = async (userId, productId) => {
    const cart = await cartRepository.findByUserPopulated(userId);
    if (!cart) {
        throw new Error('Cart not found');
    }

    const productToRemove = cart.products.find(p => p.product._id.toString() === productId);
    if (!productToRemove) {
        throw new Error('Product not found in cart');
    }

    const initialQuantity = productToRemove.quantity;
    const removed = await cartRepository.removeProduct(userId, productId);
    if (!removed) {
        throw new Error('Failed to remove product from cart');
    }
    return initialQuantity;
};

export const makePurchaseService = async (userId, cid) => {
    const cart = await cartRepository.findByUserPopulated(userId);
    if (!cart) {
        throw new Error('Cart not found');
    }

    const user = await userRepository.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }

    let totalAmount = 0;
    const productsToKeep = [];
    const purchasedProducts = [];

    for (const item of cart.products) {
        const product = await productRepository.getById(item.product._id);
        if (!product) {
            console.log(`Product ${item.product._id} not found, skipping`);
            productsToKeep.push(item);
            continue;
        }

        if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            try {
                await productRepository.update(product._id, {stock: product.stock});
            } catch (error) {
                console.error(`Failed to update stock for product ${product._id}`, error);
                productsToKeep.push(item);
                continue;
            }
            
            totalAmount += product.price * item.quantity;
            purchasedProducts.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price,
            });
        } else {
            console.log(`Not enough stock for product ${product._id}, keeping in cart`);
            productsToKeep.push(item);
        }
    }

    console.log('Generating unique code on service  ');
    const code = await ticketRepository.generateUniqueCode();
    const ticket = await ticketRepository.createTicket(
        code,
        totalAmount,
        userId,
        user.email,   
        purchasedProducts,
    );

    await cartRepository.updateCart(userId, productsToKeep);

    console.log(`Purchase completed for user ${userId}. Ticket ID: ${ticket._id}`);

    return {
        ticket: ticket, 
        remainingProducts: productsToKeep,
    };


};

export const getCartService = async (userId) => {
    try {
        const cart = await cartRepository.findByUserPopulated(userId);
        if (!cart) {
            return {products: [], total: 0};
        }

        const total = cart.products.reduce((acc, item) => {
            return acc + item.product.price * item.quantity;
        }, 0);

        return {
            products: cart.products,
            total: total,
        };
    } catch (error) {
        console.error('Error getting cart:', error);
        throw error;
    }
};


