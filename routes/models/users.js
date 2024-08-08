// import mongoose from "mongoose";
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        min: 6,
        max: 50
    },
    email: {
        type: String,
        required: true,
        unique: true,
        min: 6,
        max: 25
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 1024
    },
    cpassword: {
        type: String,
        required: true
    },
    role: {
        type: Number,
        default: 0,
    },
    securityAnswer: {
        type: String,
        required: true,
    },
    doctorInfo: {
        experience: {
            type: Number,
            required: false
        },
        // category: {
        //     type: String,
        //     required: false 
        // },
        licenseNumber: {
            type: String,
            required: false, // You can adjust this as needed
            unique: true
        }
    },
    resetPasswordToken: {
        type: String,
        required: false,
    },
    resetPasswordTokenExpiration: {
        type: Date,
        required: false,
    },
    loginCount: {
        type: Number, // Add this field for login count
        default: 0, // Default login count is 0
    },
}, { timestamps: true })

const collection = new mongoose.model("collection", userSchema);
// export default mongoose.model('Users', userSchema);
module.exports = collection;
