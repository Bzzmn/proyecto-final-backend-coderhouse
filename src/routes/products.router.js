import { Router } from 'express';
import { auth } from '../middlewares/authMiddleware.js';
import { 
    getProductsController, 
    getProductByIdController,
    createProductController,
    updateProductController,
    deleteProductController,
} from '../controllers/products.controller.js';

const router = Router();

router.get('/', getProductsController);
router.get('/:pid', auth('admin'), getProductByIdController);  
router.post('/', auth('admin'), createProductController);
router.put('/:pid', auth('admin'), updateProductController);
router.delete('/:pid', auth('admin'), deleteProductController);

export default router;