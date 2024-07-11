import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, default: null },
    totalPrice: { type: Number, required: true },
    image: { type: String, required: true },
    name: { type: String, required: true },
});

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestId: { type: String, default: null },
    items: [orderItemSchema],
    billingInfo: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        country: { type: String, required: true },
    },
    customerInfo: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phoneNumber: { type: String, required: true },
    },
    additionalInfo: { type: String, default: null },
    total: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    paymentSessionId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Order', orderSchema);
