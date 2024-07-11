import express from 'express';
import { OrderController } from '../controllers/order.controller.js';

const orderRouter = express.Router();

orderRouter.post(
    '/save-order',
    OrderController.saveOrder
);

export default orderRouter;
