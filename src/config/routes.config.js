import authRouter from "../routes/auth.routes.js";
import categoryRouter from "../routes/category.routes.js";
import productRouter from "../routes/product.routes.js";

export const RoutesConfig = (app) => {
    app.use("/api/category", categoryRouter);
    app.use("/api/product", productRouter);
    app.use("/api/auth", authRouter)
};
