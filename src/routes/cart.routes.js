import express from 'express';
import { CartController } from '../controllers/cart.controller.js';

const cartRouter = express.Router();

cartRouter.get('/:guestId?', CartController.getCart);
cartRouter.post('/add', CartController.addToCart);
cartRouter.post('/update', CartController.updateCart);
cartRouter.post('/remove', CartController.removeFromCart);
cartRouter.post('/clear', CartController.clearCart);

export default cartRouter;
