import express from 'express';
import { CheckoutController } from '../controllers/checkout.controller.js';

const checkoutRouter = express.Router();

checkoutRouter.post(
    '/create-checkout-session',
    CheckoutController.createCheckoutSession
);

export default checkoutRouter;
