import MongoUserDAO from './mongo/MongoUserDAO.js';
import MongoCartDAO from './mongo/MongoCartDAO.js';
import MongoProductDAO from './mongo/MongoProductDAO.js';
import MongoViewDAO from './mongo/MongoViewDAO.js';

export default class DAOFactory {
    static getDAO(type, persistence) {
        switch (persistence) {
            case 'MONGO':
                switch (type) {
                    case 'USER': return new MongoUserDAO();
                    case 'CART': return new MongoCartDAO();
                    case 'PRODUCT': return new MongoProductDAO();
                    case 'VIEW': return new MongoViewDAO();
                }
            // Other persistence types...
        }
    }
}