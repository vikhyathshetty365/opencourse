
import mongoose from 'mongoose'

const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        minLength: [10, "minimum length should be 10"],
        maxLength: [25, "maximum length should be 25"]
    },
    Description: {
        type: String,
        required: true,
        minLength: [10, "minimum length should be 10"]
    },
    lectures: [{
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        video: {
            public_id: {
                type: String
            },
            url: {
                type: String
            }
        }
    }],

    poster: {
        public_id: {
            type: String
        },
        url: {
            type: String
        }
    },
    category: {
        type: String
    }
    ,
    views: {
        type: Number,
        default: 0
    },
    NumOfVideos: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }

})

export const Course = mongoose.model('Course', schema)