// In your backend code where you define the Mongoose model
const mongoose = require('mongoose');
// const reportSchema = new mongoose.Schema({
//     reason: String
// }, { _id: false });

const commentSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;

const penSchema = new mongoose.Schema({
    text: String,
    likes: {
        type: Number,
         default: 0,
         },
   shares: {
        type: Number,
        default: 0, // Default to 0 shares
    },
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    // reports: [reportSchema]
}, { collection: 'pen' }); // Specify the collection name here

const Pen = mongoose.model('Pen', penSchema);




module.exports = Pen;
