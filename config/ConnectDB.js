import mongoose from 'mongoose';

export const connectDB = () => {

    mongoose.connect(process.env.MONGO_URL).then((data) => {
        console.log(`running on:${data.connection.port}`)
    })

}

export default connectDB