import express from 'express';
import cookieParser from "cookie-parser";
import cors from 'cors'
import { config } from 'dotenv'
import userRoute from './Routes/userRoute.js'
import courseRoute from './Routes/courseRoute.js'
import paymentRoute from './Routes/PaymentRoute.js'
//import connectDB from './config/ConnectDB.js'
import rest from './Routes/rest.js'
config({
    path: "./config/config.env"
})

//connectDB();
const app = express();


app.use(
    express.urlencoded({
        extended: true,
    })
);
app.use(cookieParser());
app.use(
    cors({
        origin: process.env.FRONTEND_URL,
        //'http://localhost:3000'
        //process.env.FRONTEND_URL
        credentials: true,
        methods: ["GET", "POST", "PUT", "DELETE"],
    })
);
app.use(express.json())

app.get('/', (req, res) => {
    res.send('<h1>Server Deployed!!!🚀🚀</h1>')
})
app.use('/api/v1/user', userRoute)

app.use('/api/v1/course', courseRoute)


app.use('/api/v1/payment', paymentRoute)

app.use('/api/v1/admin', rest)

export default app;