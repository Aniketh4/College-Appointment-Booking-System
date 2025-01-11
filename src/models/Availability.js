const mongoose = require('mongoose');

//professor Id and date are indexed separately, as we are filtering slots by professorId and date individually
const availabilitySchema = new mongoose.Schema({
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true, required: true },
    date: { type: Date, index: true, required: true },
    timeSlots: [{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Availability', availabilitySchema);
