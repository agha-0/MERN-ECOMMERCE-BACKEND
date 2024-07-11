import Stripe from 'stripe';
import Cart from '../models/cart.model.js';

const stripe = new Stripe('sk_test_51PbH3CRu6kZztMnCfbNwsYpr75ZbKFfDR5QdyKUDGMW7MAihIYHFzXEh9HJtD7cJ1OdhJg9LokhYZcQ1UTj6c6ZP00YV7tZUiv');

export const CheckoutService = {
    createCheckoutSession: async ({ userId, guestId, successUrl, cancelUrl, name, phoneNumber, address, state, city, country, additionalInfo }) => {
        try {
            // Find the cart
            let cart;
            if (userId) {
                cart = await Cart.findOne({ userId }).populate('items.product');
            } else if (guestId) {
                cart = await Cart.findOne({ guestId }).populate('items.product');
            }

            if (!cart) {
                throw new Error('Cart not found');
            }

            // Create line items for Stripe
            const lineItems = cart.items.map(item => ({
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: item.name,
                        images: [item.image],
                    },
                    unit_amount: item.totalPrice,
                },
                quantity: item.quantity,
            }));

            // Create the Checkout Session
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: lineItems,
                mode: 'payment',
                success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
                cancel_url: cancelUrl,
                metadata: {
                    userId: userId || '',
                    guestId: guestId || '',
                    name: name || '',
                    phoneNumber: phoneNumber || '',
                    address: address || '',
                    state: state || '',
                    city: city || '',
                    country: country || '',
                    additionalInfo: additionalInfo || '',
                },
            });

            // Return the session URL
            return session.url;
        } catch (error) {
            throw new Error('Failed to create checkout session');
        }
    }
}
