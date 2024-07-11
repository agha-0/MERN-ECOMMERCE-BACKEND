import { CheckoutService } from "../services/checkout.service.js";
import jwt from 'jsonwebtoken';

export const CheckoutController = {
    createCheckoutSession: async (req, res) => {
        const { guestId, successUrl, cancelUrl, name, phoneNumber, address, state, city, country, additionalInfo } = req.body;

        let userId = null;

        // Check if token is provided in the headers
        const authHeader = req.headers['authorization'];
        if (authHeader && authHeader.startsWith('Bearer ') && !guestId) {
            const token = authHeader.split(' ')[1];
            try {
                // Verify the token and extract user ID
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                userId = decoded.id;
            } catch (error) {
                return res.status(401).json({ message: 'Invalid token', status: 401 });
            }
        } else if (req.user) {
            userId = req.user._id;
        }

        try {
            const sessionUrl = await CheckoutService.createCheckoutSession({
                userId,
                guestId,
                successUrl,
                cancelUrl,
                name,
                phoneNumber,
                address,
                state,
                city,
                country,
                additionalInfo,
            });

            res.json({ url: sessionUrl });
        } catch (error) {
            console.error(error);
            res.status(500).send('Failed to create checkout session');
        }
    }
}
