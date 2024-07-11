import authRouter from "../routes/auth.routes.js";
import cartRouter from "../routes/cart.routes.js";
import categoryRouter from "../routes/category.routes.js";
import checkoutRouter from "../routes/checkout.routes.js";
import orderRouter from "../routes/order.routes.js";
import productRouter from "../routes/product.routes.js";

export const RoutesConfig = (app) => {
    app.use("/api/category", categoryRouter);
    app.use("/api/product", productRouter);
    app.use("/api/auth", authRouter);
    app.use('/api/cart', cartRouter);
    app.use('/api/checkout', checkoutRouter);
    app.use('/api/order', orderRouter);
};
