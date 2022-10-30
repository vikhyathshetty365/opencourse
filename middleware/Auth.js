
import jwt from 'jsonwebtoken'
import { User } from '../Schema/User.js'
export const isAuth = async (req, res, next) => {

    const { token } = req.cookies
    console.log(token)
    if (!token) {
        return next(new Error("not Authorized"))
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded._id)


    next()

}


export const isAdmin = async (req, res, next) => {
    if (req.user.Role !== "admin")
        return next(new Error("Not Authorized"))

    next()

}
export const isSubscriber = async (req, res, next) => {

    if (req.user.Role === "admin" || req.user.subscription.status === "active") {

        return next()
    }


    return next(new Error("only subsribers can access"))

}