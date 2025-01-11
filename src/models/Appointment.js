const mongoose = require('mongoose');

/* studentId and professorId are indexed together and required, index is used to speed up the search as mostly 
we are searching by studentId and professorId */

const appointmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    timeSlot: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

// Compound index for studentId and professorId
appointmentSchema.index({ studentId: 1, professorId: 1 });
  
module.exports = mongoose.model('Appointments', appointmentSchema);
