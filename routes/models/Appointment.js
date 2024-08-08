const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const appointmentSchema = new Schema({
    name: String,
    email: String,
    phone: String,
    doctor: { type: Schema.Types.ObjectId, ref: 'Doctor' },

    date: Date,
    time: String,
});

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;
