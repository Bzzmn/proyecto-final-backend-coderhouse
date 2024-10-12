import CartRepository from './interfaces/CartRepository.js';

export default class MongoCartRepository extends CartRepository {
    constructor(dao) {
        super();
        this.dao = dao;
    }

    async findByUser(userId) {
        return await this.dao.findByUser(userId);
    }

    async findByUserPopulated(userId) {
        return await this.dao.findByUserPopulated(userId);
    }

    async create(cartData) {
        return await this.dao.create(cartData);
    }

    async addProduct(userId, productId, quantity) {
        return await this.dao.addProduct(userId, productId, quantity);
    }

    async removeProduct(userId, productId) {
        return await this.dao.removeProduct(userId, productId);
    }

    async getCartQuantity(userId) {
        return await this.dao.getCartQuantity(userId);
    }

    async updateCart(userId, products) {
        return await this.dao.updateCart(userId, products);
    }

}