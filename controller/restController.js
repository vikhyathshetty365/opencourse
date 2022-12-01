
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

        let userprecent = 0, subscriberpercent = 0, viewspercent = 0;

        let userprofit = true, subscriberprofit = true, viewsprofit = true;

        if (statsdata[10].users === 0)
            userprecent = statsdata[11] * 100;

        if (statsdata[10].views === 0)
            subscriberpercent = statsdata[11] * 100;

        if (statsdata[10].subscribers === 0)
            subscriberpercent = statsdata[11] * 100



        if (statsdata[10].users > 0) {
            userprecent = ((statsdata[11].users - statsdata[10].users) / statsdata[10].users) * 100;
        }
        if (statsdata[10].views > 0) {
            viewspercent = ((statsdata[11].views - statsdata[10].views) / statsdata[10].views) * 100
        }
        if (statsdata[10].subscribers > 0) {
            subscriberpercent = ((statsdata[11].subscribers - statsdata[10].subscribers) / statsdata[10].subscribers) * 100
        }

        if (userprecent < 0) {
            userprofit = false;
        }
        if (viewspercent < 0)
            viewsprofit = false

        if (subscriberpercent < 0)
            subscriberprofit = false
        return res.status(201).json({
            success: true,
            statsdata,
            totalusers,
            totalsubs,
            totalviews,
            userprecent,
            userprofit,
            viewspercent,
            viewsprofit,
            subscriberpercent,
            subscriberprofit
        })


    }
    catch (err) {
        return next(new Error(err));
    }

}