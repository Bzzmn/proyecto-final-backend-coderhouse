import DAOFactory from '../data/DAOs/DAOFactory.js';
import { PERSISTENCE } from '../config/persistence.js';

const productRepository = DAOFactory.getRepository('PRODUCT', PERSISTENCE);

export const getProductsService = async () => {
    const products = await productRepository.getAll();
    if (!products) {
        throw new Error('Products not found');
    }
    return products;
};

export const getProductByIdService = async (id) => {
    const product = await productRepository.getById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
}

export const createProductService = async (product) => {
    const newProduct = await productRepository.create(product);
    if (!newProduct) {
        throw new Error('Error creating product');
    }
    return newProduct;
}

export const updateProductService = async (id, productData) => {
    const updatedProduct = await productRepository.update(id, productData);
    if (!updatedProduct) {
        throw new Error('Product not found');
    }
    return updatedProduct;
}

export const deleteProductService = async (id) => {
    const deletedProduct = await productRepository.delete(id);
    if (!deletedProduct) {
        throw new Error('Product not found');
    }
    return deletedProduct;
}
