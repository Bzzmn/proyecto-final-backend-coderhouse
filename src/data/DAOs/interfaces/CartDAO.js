export default class CartDAO {
    async findByUser(userId) { throw new Error('Method not implemented.'); }
    async findByUserPopulated(userId) { throw new Error('Method not implemented.'); }
    async create(cartData) { throw new Error('Method not implemented.'); }
    async addProduct(userId, productId, quantity) { throw new Error('Method not implemented.'); }
    async removeProduct(userId, productId) { throw new Error('Method not implemented.'); }
    async getCartQuantity(userId) { throw new Error('Method not implemented.'); }
    async updateCart(userId, cartData) { throw new Error('Method not implemented.'); }
}