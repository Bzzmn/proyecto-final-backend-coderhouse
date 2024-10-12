import { Router } from 'express';
import { 
    getHomeController, 
    getProductPageController, 
    getCartController,
    getRegisterController,
    getLoginController, 
    getForgotPasswordController,
    getCheckoutController,
    getSuccessController
} from '../controllers/views.controller.js';

const router = Router();

router.get('/', getHomeController);
router.get('/product/:id', getProductPageController);
router.get('/cart', getCartController);
router.get('/register', getRegisterController);
router.get('/login', getLoginController);
router.get('/forgot-password', getForgotPasswordController);
router.get('/checkout', getCheckoutController);
router.get('/success', getSuccessController);

export default router;