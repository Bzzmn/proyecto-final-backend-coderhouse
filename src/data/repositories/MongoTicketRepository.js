import TicketRepository from './interfaces/TicketRepository.js';

export default class MongoTicketRepository extends TicketRepository {
    constructor(dao) {
        super();
        this.dao = dao;
    }   

    async createTicket(code, amount, purchaserId, purchaser_email, products) {
        return await this.dao.createTicket(code, amount, purchaserId, purchaser_email, products);
    }

    async getTicketByUserId(userId) {
        return await this.dao.getTicketByUserId(userId);
    }

    async generateUniqueCode() {
        console.log('Generating unique code');
        const code = await this.dao.generateUniqueCode();
        console.log('Generated code:', code);
        return code;
    }
}