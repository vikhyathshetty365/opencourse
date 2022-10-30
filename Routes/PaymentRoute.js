import express from 'express';
import { getKey, CreateSubscription, verifydubscription } from '../controller/PaymentController.js'
import { isAuth } from '../middleware/Auth.js'
const router = express.Router()


router.route('/key').get(getKey)

router.route('/subscribe').get(isAuth, CreateSubscription)

router.route('/verify').post(isAuth, verifydubscription);

export default router