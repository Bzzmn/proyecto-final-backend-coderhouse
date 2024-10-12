import DAOFactory from '../data/DAOs/DAOFactory.js';
import { PERSISTENCE } from '../config/persistence.js';

const viewRepository = DAOFactory.getRepository('VIEW', PERSISTENCE);

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

    const result = await viewRepository.getProducts(filter, options);

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
    const product = await viewRepository.getProductById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
}

export const getCartService = async (userId) => {
    const { cart, total} = await viewRepository.getCartByUserId(userId);
    if (!cart) {
        return { cart: null, total: 0 };
    }
    return { cart, total };
}

export async function getCheckoutService(userId) {
    console.log('getCheckoutService called with userId:', userId);
    const cart = await viewRepository.findByUserWithAvailableStock(userId);
    console.log('Cart from repository:', JSON.stringify(cart, null, 2));
    if (!cart || cart.products.length === 0) {
        throw new Error('Cart not found or empty');
    }
    return cart;
}

export const getTicketService = async (userId) => {
    const ticket = await viewRepository.getTicketByUserId(userId);
    return ticket;
}