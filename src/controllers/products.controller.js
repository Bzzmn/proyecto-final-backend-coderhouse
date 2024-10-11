import { 
    getProductsService, 
    getProductByIdService,
    createProductService,
    updateProductService,
    deleteProductService,
} from '../services/products.service.js';

export const getProductsController = async (req, res) => {
    try {
        const products = await getProductsService();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error.message });
    }
};

export const getProductByIdController = async (req, res) => {
    const id = req.params.pid;
    try {
        const product = await getProductByIdService(id);
        if (!product) {
            return res.status(404).json({message: 'Product not found'});
        }
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching products by id', error: error.message });
    }
}   

export const createProductController = async (req, res) => {
    try {

        console.log(req.body);
        const newProduct = await createProductService(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error.message });
    }
}

export const updateProductController = async (req, res) => {
    const id = req.params.pid;
    try {
        const updatedProduct = await updateProductService(id, req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error.message });
    }
}

export const deleteProductController = async (req, res) => {
    const id = req.params.pid;
    try {
        await deleteProductService(id);
        res.status(200).json({message: 'Product deleted'});
    } catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error.message });
    }
}


