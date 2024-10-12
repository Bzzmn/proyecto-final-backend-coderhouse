import ViewRepository from './interfaces/ViewRepository.js';
import ViewDTO from '../DTOs/ViewDTO.js';

export default class MongoViewRepository extends ViewRepository {
    constructor(dao) {
        super();
        this.dao = dao;
    }

    async getProducts(filter, options) {
        return await this.dao.getProducts(filter, options);
    }

    async getProductById(id) {
        return await this.dao.getProductById(id);
    }

    async getCartByUserId(userId) {
        return await this.dao.getCartByUserId(userId);
    }

    async findByUserWithAvailableStock(userId) {
        console.log('In repository, userId:', userId);
        const cart = await this.dao.getCartByUserId(userId);
        console.log('Cart from DAO:', JSON.stringify(cart, null, 2));
        if (!cart) {
            console.log('Cart not found');
            return null;
        }
        const viewDTO = new ViewDTO(cart);
        console.log('ViewDTO created:', JSON.stringify(viewDTO, null, 2));
        return viewDTO;
    }

    async getTicketByUserId(userId) {
        return await this.dao.getTicketByUserId(userId);
    }
}