import TicketModel from '../../../models/ticket.model.js';

export default class MongoTicketDAO extends TicketModel {

    async generateUniqueCode() {
        return await TicketModel.generateUniqueCode();
    }

    async createTicket(code, amount, userId, email, products) {
        const ticket = new TicketModel({ code, amount, purchaserId: userId, purchaser_email: email, products });
        return await ticket.save();
    }

    async getTicketByUserId(userId) {
        return await TicketModel.findById({ purchaserId: userId });
    }
}