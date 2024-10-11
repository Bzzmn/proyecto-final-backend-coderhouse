import { Router } from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { addToCart, getCartQuantityController, removeFromCart } from '../controllers/carts.controller.js';

const router = Router();

router.post('/', auth('user'), addToCart);
router.get('/quantity', getCartQuantityController);
router.delete('/product/:pid', auth('user'), removeFromCart);

export default router;