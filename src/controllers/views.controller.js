import { 
    getHomeService, 
    getProductPageService,
    getCartService, 
    getCheckoutService, 
    getTicketService
 } from '../services/views.service.js';

export const getHomeController = async (req, res) => {
    try {
       getHomeService(req, res);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reading products file', error: error.message });
    }
}

export const getProductPageController = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await getProductPageService(id);
        res.render('product', { product, user: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error reading products file', error: error.message });
    }
}

export const getCartController = async (req, res) => {
    try { 
        const { cart, total } = await getCartService(req.user._id);
        res.render('cart', { cart, total, user: res.locals.user });
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).render('error', { message: 'Error fetching cart', user: res.locals.user });
    }
}

export const getRegisterController = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.error('Error fetching register:', error);
        res.status(500).render('error', { message: 'Error fetching register', user: res.locals.user });
    }
}

export const getLoginController = async (req, res) => {

    if (req.user) {
        return res.redirect('/'); // Redirigir si el usuario ya está autenticado
    }

    try {
        res.render('login');
    } catch (error) {
        console.error('Error fetching login:', error);
        res.status(500).render('error', { message: 'Error fetching login', user: res.locals.user });
    }
}

export const getForgotPasswordController = async (req, res) => {
    try {
        res.render('restore-password');
    } catch (error) {
        console.error('Error fetching forgot password:', error);
        res.status(500).render('error', { message: 'Error fetching forgot password', user: res.locals.user });
    }
}

export const getCheckoutController = async (req, res) => {

    console.log(req.user._id);
    try {
        const cart = await getCheckoutService(req.user._id);
        res.render('checkout', { cart , user: res.locals.user });
    } catch (error) {
        console.error('Error fetching checkout:', error);
    }
}

export const getSuccessController = async (req, res) => {
    try {
        const ticket = await getTicketService(req.user._id);
        res.render('success', { ticket, user: res.locals.user });
    } catch (error) {
        console.error('Error fetching success:', error);
        res.status(500).render('error', { message: 'Error fetching success', user: res.locals.user });
    }
};

export const getCartProductCardController = async (req, res) => {
    try {
        const { productId, quantity, price, title, thumbnails } = req.query;
        
        res.render('partials/cart-product-card', {
            layout: false, // Important: don't use the main layout
            product: {
                _id: productId,
                price: parseFloat(price),
                title,
                thumbnails
            },
            quantity: parseInt(quantity)
        });
    } catch (error) {
        console.error('Error rendering product card:', error);
        res.status(500).send('Error rendering product card');
    }
};

export const getProductViewController = async (req, res) => {
    try {
        const { pid } = req.params;
        
        // Validar que pid sea un ObjectId válido
        if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(400).render('error', { 
                error: 'ID de producto inválido' 
            });
        }

        const product = await productsService.getProductById(pid);
        
        if (!product) {
            return res.status(404).render('error', { 
                error: 'Producto no encontrado' 
            });
        }

        // Asegurarse de que el producto sea un objeto plano
        const productToRender = {
            _id: product._id.toString(),
            title: product.title,
            description: product.description,
            price: product.price,
            thumbnails: product.thumbnails,
            stock: product.stock,
            category: product.category,
            code: product.code,
            status: product.status
        };

        return res.render('product', { 
            product: productToRender
        });

    } catch (error) {
        console.error('Error al obtener producto:', error);
        return res.status(500).render('error', { 
            error: 'Error al cargar el producto' 
        });
    }
};