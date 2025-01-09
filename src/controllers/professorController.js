const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

exports.createSlot = async (req, res) => {
  try {
    const { date, timeSlots } = req.body;
    const professorId = req.user._id; // Assuming authenticated professor

    // Check if the professor already has availability for the date
    let availability = await Availability.findOne({ professorId, date: new Date(date) });

    if (availability) {
      // Append new time slots (avoiding duplicates)
      const updatedSlots = [...new Set([...availability.timeSlots, ...timeSlots])];
      availability.timeSlots = updatedSlots;
      await availability.save();
    } else {
      // Create new availability
      availability = await Availability.create({ professorId, date: new Date(date), timeSlots });
    }

    res.status(201).json({ message: 'Slot created successfully', availability });
  } catch (err) {
    console.error('Error creating slot:', err.message);
    res.status(500).json({ message: 'Failed to create slot', error: err.message });
  }
};

exports.deleteSlot = async (req, res) => {
    try {
      const { date, timeSlots } = req.body;
      const professorId = req.user._id; // Assuming authenticated professor
  
      // Find the availability for the given date
      const availability = await Availability.findOne({ professorId, date: new Date(date) });
  
      if (!availability) {
        return res.status(404).json({ message: 'No availability found for the given date' });
      }
  
      // Remove the specified time slots
      availability.timeSlots = availability.timeSlots.filter((slot) => !timeSlots.includes(slot));
  
      // Delete the availability if no time slots remain
      if (availability.timeSlots.length === 0) {
        await availability.deleteOne();
        return res.status(200).json({ message: 'All slots removed for the given date' });
      }
  
      await availability.save();
      res.status(200).json({ message: 'Slots deleted successfully', availability });
    } catch (err) {
      console.error('Error deleting slot:', err.message);
      res.status(500).json({ message: 'Failed to delete slot', error: err.message });
    }
};


exports.bookedSlots = async (req, res) => {
try {
    const professorId = req.user._id; // Assuming authenticated professor

    // Fetch all booked appointments for the professor
    const appointments = await Appointment.find({ professorId, status: 'booked' })
    .populate('studentId', 'name email') // Populate student details
    .sort({ date: 1, timeSlot: 1 }); // Sort by date and time slot

    if (appointments.length === 0) {
    return res.status(404).json({ message: 'No booked slots found' });
    }

    res.status(200).json({ message: 'Booked slots fetched successfully', data: appointments });
} catch (err) {
    console.error('Error fetching booked slots:', err.message);
    res.status(500).json({ message: 'Failed to fetch booked slots', error: err.message });
}
};

exports.cancelBookedSlot = async (req, res) => {
try {
    const { appointmentId } = req.body;
    const professorId = req.user._id; // Assuming authenticated professor

    // Find the appointment
    const appointment = await Appointment.findOne({ _id: appointmentId, professorId });

    if (!appointment) {
    return res.status(404).json({ message: 'Appointment not found' });
    }

    // Update the status to 'cancelled'
    appointment.status = 'cancelled';
    await appointment.save();

    // Restore the cancelled time slot to professor's availability
    const availability = await Availability.findOne({ professorId, date: appointment.date });

    if (availability) {
    availability.timeSlots.push(appointment.timeSlot);
    availability.timeSlots = [...new Set(availability.timeSlots)]; // Remove duplicates
    await availability.save();
    } else {
    // Create a new availability if none exists for the date
    await Availability.create({
        professorId,
        date: appointment.date,
        timeSlots: [appointment.timeSlot],
    });
    }

    res.status(200).json({ message: 'Appointment cancelled successfully', appointment });
} catch (err) {
    console.error('Error cancelling appointment:', err.message);
    res.status(500).json({ message: 'Failed to cancel appointment', error: err.message });
}
};
