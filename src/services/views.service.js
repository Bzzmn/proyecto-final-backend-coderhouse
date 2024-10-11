import DAOFactory from '../daos/DAOFactory.js';
import { PERSISTENCE } from '../config/persistence.js';

const viewDAO = DAOFactory.getDAO('VIEW', PERSISTENCE);

export const getHomeService = async (req, res) => {
    const { limit = 10, page = 1, sort, category = 'all', status = 'all'} = req.query;

    const filter = {};
   
    if (category && category !== 'all') {
        filter.category = category;
    }

    if (status && status !== 'all') {
        filter.status = status === 'available';
    }

    const options = {
        page: parseInt(page),
        limit: parseInt(limit),
        sort: sort
    };

    const result = await viewDAO.getProducts(filter, options);

    res.render('home', { 
        products: result.docs,
        pagination: {
            totalProducts: result.totalDocs,
            totalPages: result.totalPages,
            currentPage: result.page,
            pageSize: result.limit
        },
        category: category || 'all',
        sort: sort || '',
        status: status || 'all',
        limit: limit,
        page: page,
        user: req.user
    });
}

export const getProductPageService = async (id) => {
    const product = await viewDAO.getProductById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
}

export const getCartService = async (userId) => {
    const cart = await viewDAO.getCartByUserId(userId);

    if (!cart) {
        return { cart: null, total: 0 };
    }

    const total = cart.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    return { cart, total };
}