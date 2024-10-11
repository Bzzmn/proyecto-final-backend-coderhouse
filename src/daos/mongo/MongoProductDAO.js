import productModel from '../../models/product.model.js';
import ProductDAO from '../interfaces/ProductDAO.js';

export default class MongoProductDAO extends ProductDAO {
    constructor() {
        super();
    }

    async getAll() {
        return await productModel.find();
    }

    async getById(id) {
        return await productModel.findById(id);
    }

    async create(productData) {
        return await productModel.create(productData);
    }

    async update(id, productData) {
        return await productModel.findByIdAndUpdate(id, productData, { new: true });
    }

    async delete(id) {
        return await productModel.findByIdAndDelete(id);
    }
}