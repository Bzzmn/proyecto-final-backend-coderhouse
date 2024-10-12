import ProductRepository from './interfaces/ProductRepository.js';

export default class MongoProductRepository extends ProductRepository {
    constructor(dao) {
        super();
        this.dao = dao;
    }

    async getAll() {
        return await this.dao.getAll();
    }

    async getById(id) {
        return await this.dao.getById(id);
    }

    async create(productData) {
        return await this.dao.create(productData);
    }

    async update(id, productData) {
        return await this.dao.update(id, productData);
    }

    async delete(id) {
        return await this.dao.delete(id);
    }
}