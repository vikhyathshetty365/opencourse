import { User } from '../Schema/User.js';
import { Payment } from '../Schema/Payment.js'
import { instance } from '../server.js'
import crypto from 'crypto'
export const CreateSubscription = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id)

        if (user.Role === "admin")
            return next(new Error("Admin cannot Subscribes"))

        const subscription = await instance.subscriptions.create({
            plan_id: "plan_KSAuofyaZo2aNv",
            customer_notify: 1,
            total_count: 12,
        })

        user.subscription.id = subscription.id;

        user.subscription.status = subscription.status;

        await user.save();

        return res.status(200).json({
            success: true,
            subscriptionId: subscription.id

        });

    }
    catch (err) {
        return next(new Error(err.message));
    }
}

export const verifydubscription = async (req, res, next) => {

    const user = await User.findById(req.user._id)

    const { razorpay_payment_id, razorpay_subscription_id, razorpay_signature } = req.body

    console.log(razorpay_payment_id)
    console.log(razorpay_subscription_id)
    console.log(razorpay_signature)
    const key_secret = 'MsIyyJapelB4A9UaZvWnkXdB'

    const SubId = user.subscription.id;

    const hmac = crypto.createHmac('sha256', key_secret);

    hmac.update(razorpay_payment_id + "|" + razorpay_subscription_id);

    let generatedSignature = hmac.digest('hex');

    let isSignatureValid = generatedSignature === razorpay_signature;

    if (!isSignatureValid)
        return res.redirect(`${process.env.FRONTEND_URL}/Paymentfailure`)

    await Payment.create({
        razorpay_payment_id,
        razorpay_subscription_id,
        razorpay_signature,
        subscriptionId: SubId

    });

    user.subscription.status = "active";

    await user.save();

    return res.redirect(`${process.env.FRONTEND_URL}/Paymentsucess`)



}

export const getKey = async (req, res, next) => {
    try {
        await res.status(201).json({ success: true, key: 'rzp_test_1ahj30Q0E9chQt' })
    }
    catch (err) {
        res.status(500).json({ success: false, message: err.message })
    }




}

export const cancelSubscription = async (req, res, next) => {

    try {

        const user = await User.findById(req.user._id);

        const refund = false;
        subId = user.subscription.id;

        await instance.subscriptions.cancel(subId)


        const payment = await Payment.findOne({
            subscriptionId: subId,
        })

        const time = Data.now() - payment.createdAt;

        if (time < 1000 * 60 * 60 * 24 * 7) {
            await instance.payments.refund(payment.razorpay_payment_id);
            refund = true;
        }


        user.subscription.id = undefined;
        user.subscription.status = undefined;

        await payment.remove();

        await user.save();


    }
    catch (err) {
        return next(new Error(err.message))
    }
}