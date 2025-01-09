const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    status: { type: String, enum: ['booked', 'cancelled'], default: 'booked' },
    createdAt: { type: Date, default: Date.now },
});
  
module.exports = mongoose.model('Appointments', appointmentSchema);
