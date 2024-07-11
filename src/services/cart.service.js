// services/cart.service.js

import Cart from '../models/cart.model.js';
import Product from '../models/product.model.js';

export const CartService = {
    getCart: async (userId, guestId) => {
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId }).populate('items.product');
        } else if (guestId) {
            cart = await Cart.findOne({ guestId }).populate('items.product');
        }

        if (!cart) {
            cart = { userId, guestId, items: [] };
        }

        return cart;
    },

    addToCart: async (userId, guestId, productId, quantity = 1) => {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const availableQuantity = product.quantity;
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
        } else {
            cart = await Cart.findOne({ guestId });
        }

        if (!cart) {
            cart = new Cart({ userId, guestId, items: [] });
        }

        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
        const currentQuantityInCart = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;

        const remainingQuantity = availableQuantity - currentQuantityInCart;
        if (remainingQuantity < quantity) {
            const errorMessage = remainingQuantity === 0 ? 'Out of stock.' : `Only ${remainingQuantity} items left in stock. Can't add more.`;
            throw new Error(errorMessage);
        }

        const name = product.name;
        const image = product.image;
        const price = product.price;
        const discountedPrice = product.discounted_price || null;
        const totalPrice = (discountedPrice || price) * quantity;

        if (itemIndex > -1) {
            cart.items[itemIndex].quantity += quantity;
            cart.items[itemIndex].totalPrice += totalPrice;
        } else {
            cart.items.push({ product: productId, quantity, price, discountedPrice, totalPrice, name, image });
        }

        await cart.save();
        return cart;
    },

    updateCart: async (userId, guestId, productId, quantity) => {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error('Product not found');
        }

        const availableQuantity = product.quantity;
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
        } else {
            cart = await Cart.findOne({ guestId });
        }

        if (!cart) {
            throw new Error('Cart not found');
        }

        const itemIndex = cart.items.findIndex(item => item.product.equals(productId));
        if (itemIndex === -1) {
            throw new Error('Product not in cart');
        }

        const currentQuantityInCart = cart.items[itemIndex].quantity;
        const newQuantity = quantity;

        if (newQuantity > currentQuantityInCart) { // Increasing quantity
            const increaseAmount = newQuantity - currentQuantityInCart;
            if (increaseAmount > (availableQuantity - currentQuantityInCart)) {
                const remainingQuantity = availableQuantity - currentQuantityInCart;
                const errorMessage = remainingQuantity === 0 ? 'Out of stock.' : `Only ${remainingQuantity} items left in stock. Can't update further.`;
                throw new Error(errorMessage);
            }
        }

        cart.items[itemIndex].quantity = newQuantity;
        const price = cart.items[itemIndex].price;
        const discountedPrice = cart.items[itemIndex].discountedPrice || null;
        cart.items[itemIndex].totalPrice = (discountedPrice || price) * newQuantity;

        if (newQuantity <= 0) {
            cart.items.splice(itemIndex, 1);
        }

        await cart.save();
        return cart;
    },

    removeFromCart: async (userId, guestId, productId) => {
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
        } else {
            cart = await Cart.findOne({ guestId });
        }

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = cart.items.filter(item => !item.product.equals(productId));
        await cart.save();
        return cart;
    },

    clearCart: async (userId, guestId) => {
        let cart;
        if (userId) {
            cart = await Cart.findOne({ userId });
        } else {
            cart = await Cart.findOne({ guestId });
        }

        if (!cart) {
            throw new Error('Cart not found');
        }

        cart.items = [];
        await cart.save();
        return cart;
    },
};
