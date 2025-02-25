import { Router } from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { 
    addToCartController, 
    getCartQuantityController, 
    removeFromCart, 
    makePurchaseController,
    getCartController,
} from '../controllers/carts.controller.js';

const router = Router();

router.post('/', auth('user'), addToCartController);
router.get('/quantity', getCartQuantityController);
router.delete('/product/:pid', auth('user'), removeFromCart);
router.post('/purchase', auth('user'), makePurchaseController);
router.get('/', auth('user'), getCartController);

export default router;

