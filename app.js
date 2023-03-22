const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()

const app = express();
app.use(express.json({ limit: '100mb', }))
app.use(express.urlencoded({ limit: '100mb', extended: true }))
const connectDB = require('./database/connectDB')


const userRouter = require('./routes/userRouter')


app.use(cors())
const port = process.env.PORT || 5000;

app.use("/auth", userRouter)


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