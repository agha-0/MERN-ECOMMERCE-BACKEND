const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const swaggerUi = require("swagger-ui-express"), swaggerDocument = require("./uploads/swagger.json");

const errors = require ("./middleware/errors");

const app = express();
app.use(express.json({ limit: '100mb', }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))
const connectDB = require('./database/DB.Connect')


const userRouter = require('./routes/userRouter')

app.use(cors())
const port = process.env.PORT || 5000;

app.use("/auth", userRouter)
app.use('/profile_pic', express.static("profile_pic"))
app.use("/uploads", express.static("uploads"));

app.use("/api", require("./routes/routes"));
app.use(errors.errorHandler);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(bodyParser.json())

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(port,
            console.log("Listen at PORT ", port)
        )
    } catch (error) {
        console.log(error);
    }
}


start()