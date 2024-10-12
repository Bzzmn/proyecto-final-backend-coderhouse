import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    purchase_datetime: { type: Date, default: Date.now },
    amount: { type: Number, required: true },
    purchaser_email: { type: String, required: true },
    purchaserId: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true },
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true},
        quantity: { type: Number, required: true},
        price: { type: Number, required: true},
    }],
    paymentStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
});

ticketSchema.statics.generateUniqueCode = async function() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code;
    let isUnique = false;

    while (!isUnique) {
        code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        const existingTicket = await this.findOne({ code });
        if (!existingTicket) {
            isUnique = true;
        }
    }
    return code;
};

const TicketModel = mongoose.model('Ticket', ticketSchema);

export default TicketModel;
