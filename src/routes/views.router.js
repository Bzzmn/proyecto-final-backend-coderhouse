import { Router } from 'express';
import productModel from '../models/product.model.js';
import cartModel from '../models/cart.model.js';
import { auth } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/', async (req, res) =>  {
    try {
        const { limit = 10, page = 1, sort, category = 'all', status = 'all'} = req.query;

        const filter = {}
       
        if (category && category !== 'all') {
            filter.category = category;
        }

        if (status && status !== 'all') {
            filter.status = status === 'available';
        }

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
 
        if (sort) {
            const sortOrder = sort === 'desc' ? -1 : 1;
            aggregation.push({ $sort: { price: sortOrder } });
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
        };

        const aggregate = productModel.aggregate(aggregation);
        const result = await productModel.aggregatePaginate(aggregate, options);

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
            user: req.user // Pasar la información del usuario a la vista
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reading products file', error: error.message });
    }
});

router.get('/product/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productModel.findById(id);
        res.render('product', { product, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reading products file', error: error.message });
    }
});

router.get('/cart', auth('user'), async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await cartModel.findOne({ user: userId }).populate('products.product');

        if (!cart) {
            return res.status(404).json({ message: 'Your cart is empty' });
        }

        const total = cart.products.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

        res.render('cart', { cart, total, user: res.locals.user });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).render('error', { message: 'Error fetching cart', user: res.locals.user });
    }
});

router.get('/register', (req, res) => {
    if (req.user) {
        return res.redirect('/'); // Redirigir si el usuario ya está autenticado
    }
    res.render('register');
});

router.get('/login', (req, res) => {
    if (req.user) {
        return res.redirect('/'); // Redirigir si el usuario ya está autenticado
    }
    res.render('login');
});

router.get('/forgot-password', (req, res) => {
    res.render('restore-password');
});

export default router;