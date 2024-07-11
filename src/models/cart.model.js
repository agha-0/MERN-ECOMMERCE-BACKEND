import mongoose from 'mongoose';

const cartItemSchema = new mongoose.Schema({
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, default: 1 },
    price: { type: Number, required: true },
    discountedPrice: { type: Number, default: null },
    totalPrice: { type: Number, required: true },
    image: { type: String,required: true},
    name: { type: String, required: true},
});

const cartSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    guestId: { type: String, default: null },
    items: [cartItemSchema],
    total: { type: Number, default: 0 },
});

// Pre-save hook to calculate cart total
cartSchema.pre('save', function (next) {
    this.total = this.items.reduce((acc, item) => {
        return acc + item.totalPrice;
    }, 0);
    next();
});

export default mongoose.model('Cart', cartSchema);
