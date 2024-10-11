import DAOFactory from '../daos/DAOFactory.js';
import { PERSISTENCE } from '../config/persistence.js';

const productDAO = DAOFactory.getDAO('PRODUCT', PERSISTENCE);

export const getProductsService = async () => {
    const products = await productDAO.getAll();
    if (!products) {
        throw new Error('Products not found');
    }
    return products;
};

export const getProductByIdService = async (id) => {
    const product = await productDAO.getById(id);
    if (!product) {
        throw new Error('Product not found');
    }
    return product;
}

export const createProductService = async (product) => {
    const newProduct = await productDAO.create(product);
    if (!newProduct) {
        throw new Error('Error creating product');
    }
    return newProduct;
}

export const updateProductService = async (id, product) => {
    const updatedProduct = await productDAO.update(id, product);
    if (!updatedProduct) {
        throw new Error('Product not found');
    }
    return updatedProduct;
}

export const deleteProductService = async (id) => {
    const deletedProduct = await productDAO.delete(id);
    if (!deletedProduct) {
        throw new Error('Product not found');
    }
    return deletedProduct;
}

