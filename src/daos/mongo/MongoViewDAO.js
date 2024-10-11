import productModel from '../../models/product.model.js';
import cartModel from '../../models/cart.model.js';
import ViewDAO from '../interfaces/ViewDAO.js';

export default class MongoViewDAO extends ViewDAO {
    constructor() {
        super();
    }

    async getProducts(filter, options) {
        const aggregation = [
            { $match: filter },
            {
                $project: {
                    _id: 1,
                    title: 1,
                    description: 1,
                    code: 1,
                    price: 1,
                    stock: 1,
                    category: 1,
                    thumbnails: 1,
                }
            }
        ];

        if (options.sort) {
            const sortOrder = options.sort === 'desc' ? -1 : 1;
            aggregation.push({ $sort: { price: sortOrder } });
        }

        const aggregate = productModel.aggregate(aggregation);
        return await productModel.aggregatePaginate(aggregate, options);
    }

    async getProductById(id) {
        return await productModel.findById(id);
    }

    async getCartByUserId(userId) {
        return await cartModel.findOne({ user: userId }).populate('products.product');
    }
}