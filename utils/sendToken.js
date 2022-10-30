//import jsonwebtoken from 'jsonwebtoken';


const sendToken = async (res, user) => {
    const token = await user.getJwt();

    console.log(token)
    const options = {
        expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: true,

        sameSite: "none",
    };


    res.status(200).cookie("token", token, options).json({
        success: true,
        user

    })
}

export default sendToken;