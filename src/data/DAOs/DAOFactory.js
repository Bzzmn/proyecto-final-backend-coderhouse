import MongoUserDAO from './mongo/MongoUserDAO.js';
import MongoCartDAO from './mongo/MongoCartDAO.js';
import MongoProductDAO from './mongo/MongoProductDAO.js';
import MongoViewDAO from './mongo/MongoViewDAO.js';
import MongoTicketDAO from './mongo/MongoTicketDAO.js';
import MongoUserRepository from '../repositories/MongoUserRepository.js';
import MongoCartRepository from '../repositories/MongoCartRepository.js';
import MongoProductRepository from '../repositories/MongoProductRepository.js';
import MongoViewRepository from '../repositories/MongoViewRepository.js';
import MongoTicketRepository from '../repositories/MongoTicketRepository.js';

export default class DAOFactory {
    static getRepository(type, persistence) {
        switch (persistence) {
            case 'MONGO':
                switch (type) {
                    case 'USER': 
                        const userDAO = new MongoUserDAO();
                        return new MongoUserRepository(userDAO);
                    case 'CART': 
                        const cartDAO = new MongoCartDAO();
                        return new MongoCartRepository(cartDAO);
                    case 'PRODUCT': 
                        const productDAO = new MongoProductDAO();
                        return new MongoProductRepository(productDAO);
                    case 'VIEW': 
                        const viewDAO = new MongoViewDAO();
                        return new MongoViewRepository(viewDAO);
                    case 'TICKET':
                        const ticketDAO = new MongoTicketDAO();
                        return new MongoTicketRepository(ticketDAO);
                }
        }
    }
}