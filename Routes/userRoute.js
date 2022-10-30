import express from 'express';
import { registerUser, loginUser, logout, getMyProfie, addToPlaylist, removePlaylist, getAllusers } from '../controller/userController.js'
import { multerUploads } from '../middleware/multer.js'
import { isAuth, isAdmin } from '../middleware/Auth.js'
const router = express.Router();
router.route('/login').post(loginUser)
router.route('/register').post(multerUploads, registerUser)

router.route('/logout').get(logout)

router.route('/me').get(isAuth, getMyProfie)

router.route('/addplaylist').post(isAuth, addToPlaylist)

router.route('/removeplaylist/:id').delete(isAuth, removePlaylist)

router.route('/admin/users').get(isAuth, isAdmin, getAllusers);

export default router;
