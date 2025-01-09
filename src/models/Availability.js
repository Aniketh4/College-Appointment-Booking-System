const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    professorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, index: true, required: true },
    timeSlots: [{ type: String, required: true }],
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Availability', availabilitySchema);
