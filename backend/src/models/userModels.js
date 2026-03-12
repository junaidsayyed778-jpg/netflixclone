const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Username is required"],
        unique: true
    },
    email:{
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password:{
        type: String,
        required: [true, "Password is required"]
    },
    otp: String,
    otpExpiry: Date,
    isVerified: {
        type: Boolean,
        default: false,
    },

    watchlist:[
        {
            movieId: String,
            title: String,
            poster: String,
            backdrop: String,
            addedAt:{
                type: Date,
                default: Date.now
            }
        }
    ]
})

const userModel = mongoose.model("user", userSchema);
module.exports = userModel;