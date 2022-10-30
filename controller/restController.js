
import { Stats } from '../Schema/Stats.js'
export const getdata = async (req, res, next) => {

    try {
        const data = await Stats.find({}).sort({ 'createdAt': 'desc' }).limit(12)

        const statsdata = []

        const rem = 12 - data.length

        for (let i = 0; i < data.length; i++) {
            statsdata.unshift(data[i])
        }

        for (let i = 0; i < rem; i++) {
            statsdata.unshift({
                users: 0,
                views: 0,
                subscribers: 0

            })
        }

        const totalusers = statsdata[11].users;
        const totalsubs = statsdata[11].subscribers;
        const totalviews = statsdata[11].views;

        return res.status(201).json({
            success: true,
            statsdata,
            totalusers,
            totalsubs,
            totalviews
        })


    }
    catch (err) {
        return next(new Error(err));
    }

}