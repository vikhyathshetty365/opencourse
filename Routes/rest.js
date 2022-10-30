import express from 'express';
import { getdata } from '../controller/restController.js'
import { isAuth, isAdmin } from '../middleware/Auth.js'

const router = express.Router()


router.route('/getdata').get(isAuth, isAdmin, getdata);

export default router