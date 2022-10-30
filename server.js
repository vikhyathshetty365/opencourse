import app from './app.js';

import { ErrorMiddleware } from './middleware/Error.js';

import cloudinary from 'cloudinary'
import razorpay from 'razorpay'

import nodecron from 'node-cron'
//import { Stats } from './Schema/Stats.js'

export const instance = new razorpay({
    key_id: process.env.RAZORPAY_ID,
    key_secret: process.env.RAZORPAY_SECRET
})


cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
});

/*const test = async () => {
    await Stats.create({})
}

test()*/
nodecron.schedule("0 0 0 1 * *", async () => {
    try {

    }
    catch (error) {
        console.log(error);
    }
})

app.listen(process.env.PORT, () => {
    console.log(`running on ${process.env.PORT}`)
})
//Error Handler Middleware
//app.use(ErrorMiddleware)