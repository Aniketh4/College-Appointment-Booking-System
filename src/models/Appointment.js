const mongoose = require('mongoose');

//studentId and professorId are indexed separately, as we are filtering slots by professorId and studentId individually
const appointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});
  
module.exports = mongoose.model('Appointments', appointmentSchema);
