import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
const schema = new mongoose.Schema({

    Name: {
        type: String,
        required: true
    },
    Email: {
        type: String,
        required: true,
        unique: true,
        //validator
    },
    Password: {
        type: String,
        required: true,
        select: false,
        minLength: [8, "minimum length should be 8"]
    },
    Role: {
        type: String,
        default: "user",
        enum: ["admin", "user"]
    },

    subscription: {
        id: {
            type: String,
            default: "undefined",
        },
        status: {
            type: String,
            default: "undefined",
        }
    },

    Avatar: {

        public_id: { type: String },
        url: { type: String }
    },

    Playlist: [{
        courseId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Course'
        },
        poster: {
            type: String,
        }
    }],
    /*createdAt: {
        type: Date,
        default: Date.now
    },
*/


    ResetPasswordToken: String,
    ResetPasswordExpire: String

})

schema.pre("save", async function (next) {
    if (this.isModified("Password")) {
        this.Password = await bcrypt.hash(this.Password, 10);
        next();
    }
    next();

})

schema.methods.getJwt = function () {
    return jwt.sign({ _id: this._id }, process.env.JWT_SECRET, {
        expiresIn: "15d"
    })
}

schema.methods.compare = async function (password) {
    return await bcrypt.compare(password, this.Password)
}

export const User = mongoose.model("User", schema)