import mongoose from 'mongoose';
import { User } from '../Schema/User.js'
import ErrorHandler from '../utils/ErrorHandler.js'
import { Course } from '../Schema/Course.js'
import sendToken from '../utils/sendToken.js'
import cloudinary from 'cloudinary'
import { getUri } from '../middleware/multer.js'
import { Stats } from '../Schema/Stats.js'
export const registerUser = async (req, res, next) => {

    try {

        const { Name, Email, Password } = req.body;



        let user = await User.findOne({ Email: Email })

        if (user)
            return next(new ErrorHandler("User already exists", 404));

        const file = getUri(req.file)

        const cloud = await cloudinary.v2.uploader.upload(file.content)
        user = await User.create({
            Email: Email,
            Password: Password,
            Name: Name,
            Avatar: {
                public_id: cloud.public_id,
                url: cloud.secure_url
            }
        })

        sendToken(res, user);

        //return res.status(200).json({ success: true, message: "user created " })


    }
    catch (err) {

        return next(new Error(err.message))

    }

}

export const loginUser = async (req, res, next) => {

    try {
        console.log('hi')
        console.log(req.body)
        const { Email, Password } = req.body
        // console.log(Email)
        let user = await User.findOne({ Email: Email }).select("+Password")



        if (!user) return res.status(401).json({ success: false, message: "user not found" })

        const exist = await user.compare(Password)

        if (!exist) return res.status(401).json({ success: false, message: "Incorrect Email or Password" })

        sendToken(res, user);



    }
    catch (err) {
        return next(new Error(err.message))
    }

}


export const logout = async (req, res, next) => {

    try {
        res.status(200).cookie("token", null, {
            expires: new Date(Date.now())
        }).json({ success: true, message: "logout successfull" })



    }
    catch (err) {
        return nect(new Error(err.message))


    }

}

export const updateProfile = async (req, res, next) => {


    try {

        const user = await User.findById(req.user._id)

        if (!user) return next(new Error("User not found"))

        const { Email, Name } = req.body

        if (Name)
            user.Name = Name;
        if (Email)
            user.Email = Email;

        await user.save();

        return res.status(200).json({ success: true, message: "profile updated" })



    }
    catch (err) {
        return next(new Error(err.message))
    }
}


export const getMyProfie = async (req, res, next) => {

    try {

        const user = await User.findById(req.user._id);

        return res.status(200).json({ success: true, user })

    }
    catch (err) {
        return next(new Error(err.message))
    }
}

export const addToPlaylist = async (req, res, next) => {

    try {
        const { courseId } = req.body;
        //console.log(courseId)

        console.log(req.body)
        const user = await User.findById(req.user._id);

        const course = await Course.findById(courseId);

        if (!course) return next(new Error("Course not found"))

        const exist = user.Playlist.find((item) => {
            if (item.courseId.toString() == courseId.toString())
                return true
        })

        if (exist) return next(new Error("Course already exist"))

        user.Playlist.push({
            courseId: courseId,
            poster: course.poster.url,
        })

        await user.save();

        return res.status(200).json({ success: true, message: "Added to playlist" })

    }
    catch (err) {
        return next(new Error(err.message))
    }
}


export const removePlaylist = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.id);
        const user = await User.findById(req.user._id);

        const newlist = user.Playlist.filter((item) => {
            if (item.courseId.toString() !== course._id.toString())
                return item
        })

        user.Playlist = newlist;

        await user.save();
        return res.status(200).json({ success: true, message: "removed from playlist" });


    }
    catch (err) {

        return next(new Error(err.message))
    }
}
export const DeleteMyProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)

        if (!user) return next(new Error("User not found "))

        //look at subscription

        await cloudinary.v2.uploader.destroy(user.Avatar.public_id)
        await user.remove()

        return res.status.json({ success: true, message: "Profile Deleted" })

    }
    catch (err) {
        return next(new Error(err.message))
    }
}


//admin role

export const updateRole = async (req, res) => {


    const user = await User.find(req.params.id)

    if (user.Role === "user")
        user.Role = "admin"
    else
        user.Role = "user"

    await user.save();

    return res.status(200).json({ success: true, message: "User Role changed" })

}



export const getAllusers = async (req, res, next) => {
    try {

        const users = await User.find({})

        return res.status(200).json({ success: true, users })

    }
    catch (err) {
        return next(new Error(err.message))
    }
}





export const DeleteUser = async (req, res) => {


    try {
        const user = await user.findById(req.params.id)

        if (!user) return next(new Error("user not found"))
        //look at subscription

        await cloudinary.v2.uploader.destroy(user.Avatar.public_id)
        await user.remove();

        return res.status(200).json({ success: true, message: "user deleted" })

    }
    catch (err) {
        return next(new Error(err.message))
    }
}

User.watch().on('change', async () => {
    try {

        const subscription = await User.find({ 'subscription.status': 'active' })

        const stats = await Stats.find({}).sort({ createdAt: 'desc' }).limit(1)
        stats[0].subscribers = subscription.length;
        stats[0].users = await User.countDocuments();
        stats[0].createdAt = new Date(Date.now())
        await stats[0].save()
    }
    catch (err) {
        console.log(err.message)
    }
})