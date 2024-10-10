import cartModel from '../models/cart.model.js';

export const addProductToCart = async (userId, productId, quantity) => {
    try {
        let cart = await cartModel.findOne({ user: userId });

        if (!cart) {
            cart = new cartModel({
                user: userId,
                products: [{ product: productId, quantity: quantity }]
            });
        } else {
            const existingProductIndex = cart.products.findIndex(
                item => item.product._id.toString() === productId.toString()
            );

            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product: productId, quantity: quantity });
            }
        }

        await cart.save();
        return cart;
    } catch (error) {
        console.error('Error adding product to cart:', error);          
        throw error;
    }
};

