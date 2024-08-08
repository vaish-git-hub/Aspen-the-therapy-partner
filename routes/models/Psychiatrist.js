const mongoose = require('mongoose');

// Define the schema for the Psychiatrist model
const psychiatristSchema = new mongoose.Schema({
    name: String,
    photo: {
        data: Buffer,
        contentType: String,
    },
    bio: String,
});

const Psychiatrist = mongoose.model('Psychiatrist', psychiatristSchema);

module.exports = Psychiatrist;
