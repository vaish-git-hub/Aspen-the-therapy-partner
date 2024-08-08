const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    name: String,
    email: String,
    mobile: String,
    gender: String,
    note: String,
});

module.exports = mongoose.model('Feedback', feedbackSchema);
