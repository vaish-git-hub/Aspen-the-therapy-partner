const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Reference to the User model
  // Add fields for assessment data, e.g., score, date, etc.
  score: Number,
  date: Date,
});

module.exports = mongoose.model('Assessment', assessmentSchema);
