import { Course } from '../Schema/Course.js'
import { getUri } from '../middleware/multer.js'
import cloudinary from 'cloudinary'
import { Stats } from '../Schema/Stats.js'
import { User } from '../Schema/User.js'
import { Docs } from '../Schema/Docs.js'
export const createCourse = async (req, res, next) => {
    try {

        const { title, Description, category } = req.body


        const file = getUri(req.file)

        console.log(file)

        const image = await cloudinary.v2.uploader.upload(file.content)
        const course = await Course.create({
            title: title,
            Description: Description,
            createdBy: req.user._id,
            category: category,
            poster: {
                public_id: image.public_id,
                url: image.secure_url
            }

        })



        //console.log(req.file)

        return res.status(200).json({ success: true, course })

    }
    catch (err) {


        console.log(`vik:${err.message}`)

        return next(new Error(err.message));
    }

}


export const createDocs = async (req, res, next) => {
    try {


        const { title, Description, category } = req.body


        const file = getUri(req.file)

        console.log(file)

        const image = await cloudinary.v2.uploader.upload(file.content)
        const Doc = await Docs.create({
            title: title,
            Description: Description,
            createdBy: req.user._id,
            category: category,
            poster: {
                public_id: image.public_id,
                url: image.secure_url
            }

        })





        return res.status(200).json({ success: true, Doc })

    }
    catch (err) {
        console.log(`vik:${err.message}`)
        return next(new Error(err.message));
    }
}


export const Adddocs = async (req, res, next) => {
    try {

        console.log('hi')
        //const courseId = req.params.id;
        //console.log(courseId);
        console.log(`id-->${req.params.id}`)
        const Doc = await Docs.findById(req.params.id);
        // console.log(course)
        if (!Doc)
            return next(new Error("Course not found"))
        //console.log(req.body)
        const { title, description, type } = req.body

        console.log(title, description)
        const file = getUri(req.file)

        console.log(file)


        const cloud = await cloudinary.v2.uploader.upload(file.content, {
            resource_type: "raw",
            format: 'pdf'
        })

        //const cloud = await cloudinary.v2.uploader.upload(file.content)

        Doc.lectures.push({
            title: title,
            description: description,
            pdf: {
                public_id: cloud.public_id,
                url: cloud.secure_url
            }

        })

        Doc.NumOfVideos = Doc.lectures.length

        await Doc.save();

        return res.status(201).json({
            success: true,
            lectures: Doc.lectures
        })

    }
    catch (err) {

        return next(new Error(err));
    }
}

export const getDocs = async (req, res, next) => {
    try {

        const docs = await Docs.find({}).select('-lectures');

        if (!docs)
            return next(new Error("Documents not found"))

        return res.status(200).json({ success: true, documents: docs })
    }
    catch (err) {

        return next(new Error(err.message));
    }
}


export const getAllCourses = async (req, res, next) => {

    try {

        const key = req.query.key || "";
        const category = req.query.category || "";

        console.log(key, category)
        const courses = await Course.find({
            title: {
                $regex: key,
                $options: "i"
            }
            , category: {
                $regex: category,
                $options: "i"
            }

        }).select("-lectures")

        /*title: {
                $regex: key,
                $options: "i"
            }
            , category: {
                $regex: category,
                $options: "i"
            }*/
        if (!courses) return next(new Error("Courses not found"))

        return res.status(200).json({ success: true, courses })





    }
    catch (err) {

        return next(new Error(err.message));
    }
}


export const AddLecture = async (req, res, next) => {
    try {

        console.log('hi')
        //const courseId = req.params.id;
        //console.log(courseId);
        const course = await Course.findById(req.params.id);
        // console.log(course)
        if (!course)
            return next(new Error("Course not found"))
        //console.log(req.body)
        const { title, description, type } = req.body

        console.log(title, description)
        const file = getUri(req.file)

        console.log(file)


        const cloud = await cloudinary.v2.uploader.upload(file.content, {
            resource_type: "video"
        })

        //const cloud = await cloudinary.v2.uploader.upload(file.content)

        course.lectures.push({
            title: title,
            description: description,
            video: {
                public_id: cloud.public_id,
                url: cloud.secure_url
            }

        })

        course.NumOfVideos = course.lectures.length

        await course.save();

        return res.status(201).json({
            success: true,
            lectures: course.lectures
        })

    }
    catch (err) {

        return next(new Error(err));
    }
}

export const getDoc = async (req, res, next) => {
    try {
        const Doc = await Docs.findById(req.params.id)
        if (!Doc)
            return next(new Error('Document not found'));

        Doc.views += 1;
        await Doc.save()
        return res.status(200).json({
            success: true,
            document: Doc
        })
    }
    catch (err) {
        return next(new Error(err.message))
    }
}

export const getLectures = async (req, res, next) => {


    try {
        const course = await Course.findById(req.params.id);

        if (!course) {
            return next(new Error("Course not found"))
        }
        course.views += 1;

        await course.save();

        return res.status(200).json({ success: true, lectures: course.lectures })

    }
    catch (err) {
        return next(new Error(err.message))
    }
}

export const DeleteLecture = async (req, res) => {

    try {

        const { courseId, LectureId } = req.query;

        const course = await Course.findById(courseId);

        if (!course)
            return next(new Error("course not found"))


        const lecture = course.lectures.find((item) => {
            if (item._id.toString() === LectureId.toString())
                return item
        })

        await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
            resource_type: "video"
        })

        course.lectures = course.lectures.filter((item) => {
            if (item._id.toString() !== LectureId.toString())
                return item
        })
        course.NumOfVideos = course.lectures.length
        await course.save()

    }
    catch (err) {
        return next(new Error(err.message))
    }
}

export const DelCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id)



        if (!course)
            return next(new Error("Course not found"))
        await cloudinary.v2.uploader.destroy(course.poster.public_id)

        for (let i = 0; i < course.lectures.length; i++) {
            await cloudinary.v2.uploader.destroy(course.lectures[i].video.public_id, {
                resource_type: "video"
            })
        }
        await course.remove()


    }
    catch (err) {
        return next(new Error(err.message))
    }
}

Course.watch().on('change', async () => {
    try {

        const stat = await Stats.find({}).sort({ createdAt: 'desc' }).limit(1)
        const subscription = await User.find({ 'subscription.status': 'active' })
        const courses = await Course.find({})

        let cnt = 0;

        for (let i = 0; i < courses.length; i++) {
            cnt += courses[i].views;
        }

        stat[0].views = cnt;
        //stat[0].users = await User.countDocuments()
        //stat[0].subscribers = subscription.length
        stat[0].createdAt = new Date(Date.now());
        await stat[0].save()
    }
    catch (err) {
        console.log(err.message)
    }
})