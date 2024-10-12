import cartModel from '../../../models/cart.model.js';
import CartDAO from '../interfaces/CartDAO.js';
import mongoose from 'mongoose';

export default class MongoCartDAO extends CartDAO {
    constructor() {
        super();
    }

    async findByUser(userId) {
        return await cartModel.findOne({ user: userId });
    }

    async findByUserPopulated(userId) {
        return await cartModel.findOne({ user: userId }).populate('products.product');
    }

    async create(cartData) {
        return await cartModel.create(cartData);
    }

    async addProduct(userId, productId, quantity) {
        let cart = await this.findByUser(userId);

        if (!cart) {
            cart = await this.create({
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

            await cart.save();
        }

        return cart;
    }

    async removeProduct(userId, productId) {
        const result = await cartModel.updateOne(
            { user: userId },
            { $pull: { products: { product: new mongoose.Types.ObjectId(productId) } } }
        );
        return result.modifiedCount > 0;
    }

    async getCartQuantity(userId) {
        const cart = await this.findByUser(userId);
        return cart ? cart.products.reduce((acc, curr) => acc + curr.quantity, 0) : 0;
    }

    async updateCart(userId, products) {
        return await cartModel.findOneAndUpdate(
            { user: userId },
            { $set: { products: products } }, 
            { new: true }
        ).populate('products.product');
    }
}

