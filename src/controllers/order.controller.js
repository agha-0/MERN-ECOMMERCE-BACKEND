import { OrderService } from "../services/order.service.js";

export const OrderController = {
    saveOrder: async (req, res) => {
        try {
            const { sessionId } = req.body;
            const result = await OrderService.saveOrder(sessionId);
            res.status(200).json({
                status: 200,
                message: "Your order has been processed successfully",
                data: result,
            });
        } catch (error) {
            res.status(500).json({
                status: 500,
                message: error.message,
            });
        }
    }
}
