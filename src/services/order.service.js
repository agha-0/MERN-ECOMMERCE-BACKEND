import Stripe from 'stripe';
import Order from '../models/order.model.js';
import Cart from '../models/cart.model.js';
import sendEmail from '../services/email.service.js';

const stripe = new Stripe('sk_test_51PbH3CRu6kZztMnCfbNwsYpr75ZbKFfDR5QdyKUDGMW7MAihIYHFzXEh9HJtD7cJ1OdhJg9LokhYZcQ1UTj6c6ZP00YV7tZUiv');

export const OrderService = {
    saveOrder: async (sessionId) => {
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        const userId = session.metadata.userId;
        const guestId = session.metadata.guestId;
        const name = session.metadata.name;
        const phoneNumber = session.metadata.phoneNumber;
        const address = session.metadata.address;
        const state = session.metadata.state;
        const city = session.metadata.city;
        const country = session.metadata.country;
        const additionalInfo = session.metadata.additionalInfo;

        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId }).populate('items.product');
        } else if (guestId) {
            cart = await Cart.findOne({ guestId }).populate('items.product');
        }

        if (!cart) {
            throw new Error('Cart not found');
        }

        const orderData = {
            userId: userId || null,
            guestId: guestId || null,
            items: cart.items,
            billingInfo: {
                address: address,
                city: city,
                state: state,
                country: country,
            },
            customerInfo: {
                name: name,
                phoneNumber: phoneNumber,
                email: session.customer_details.email,
            },
            additionalInfo: additionalInfo,
            total: cart.total,
            status: 'completed',
            paymentSessionId: sessionId,
        };

        const order = new Order(orderData);
        await order.save();

        let html = `
        <h1>Order Confirmation</h1>
        <p>Thank you for your order!</p>
        <p>Here are your order details:</p>
        <ul>
            ${order.items.map(item => `<li>${item.product.name} - ${item.totalPrice}</li>`).join('')}
        </ul>
        <p>Subtotal: ${order.total}</p>
        <p>Billing Address: ${order.billingInfo.address}, ${order.billingInfo.city}, ${order.billingInfo.state}, ${order.billingInfo.country}</p>
        <p>Thank you for shopping with us!</p>
    `;

        await sendEmail(session.customer_details.email, "Order Confirmation", html);

        // Empty the cart
        cart.items = [];
        cart.total = 0;
        await cart.save();

        return { order, cart };
    }
}
