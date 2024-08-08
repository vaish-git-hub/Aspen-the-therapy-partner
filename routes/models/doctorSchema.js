const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const doctorSchema = new mongoose.Schema({
    name: String,
    photo:
    {
        data: Buffer,
        contentType: String,
        size: Number
    },
    bio: String,
});

// const Doctor = mongoose.model('Doctor', doctorSchema);

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor;