import express from 'express';
import { createCourse, getAllCourses, getLectures, AddLecture } from '../controller/courseController.js'
import { isAuth, isSubscriber } from '../middleware/Auth.js'
import { multerUploads } from '../middleware/multer.js'

const router = express.Router()


router.route('/createcourse').post(isAuth, multerUploads, createCourse)

router.route('/getcourses').get(getAllCourses)

router.route('/getlectures/:id').get(isAuth, isSubscriber, getLectures)

router.route('/addlecture/:id').post(isAuth, multerUploads, AddLecture)

export default router