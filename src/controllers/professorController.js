const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

//Creating a new availability for a professor based on the date and time slots
exports.createSlot = async (req, res) => {
  try {
    const { date, timeSlots } = req.body;
    const professorId = req.user._id;

    // Check if the professor already has time slots for the date
    let availability = await Availability.findOne({ professorId, date: new Date(date) });

    if (availability) {
      // Append new time slots to the perticular date
      const updatedSlots = [...new Set([...availability.timeSlots, ...timeSlots])];
      availability.timeSlots = updatedSlots;
      await availability.save();
    } else {
      // Create new availability for the perticular date
      availability = await Availability.create({ professorId, date: new Date(date), timeSlots });
    }

    res.status(201).json({ message: 'Slots created successfully', availability });
  } catch (err) {
    console.error('Error creating slot:', err.message);
    res.status(500).json({ message: 'Failed to create slot', error: err.message });
  }
};

//Viewing all booked slots students booked for a professor
exports.bookedSlots = async (req, res) => {
try {
    const professorId = req.user._id;

    // Fetch all booked appointments for the professor for all dates
    const appointments = await Appointment.find({ professorId })
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

//Cancelling a booked slot for a professor
exports.cancelBookedSlot = async (req, res) => {
try {
    const { appointmentId } = req.body;
    const professorId = req.user._id;

    // Find the appointment using the appointment id and professor id
    const appointment = await Appointment.findOne({ _id: appointmentId, professorId });

    if (!appointment) {
    return res.status(404).json({ message: 'AppointmentId does not exist, please check the appointmentId' });
    }

    // Delete the appointment using the appointment id
    await Appointment.deleteOne({ _id: appointmentId });
    res.status(200).json({ message: 'Appointment cancelled successfully', appointment });
} catch (err) {
    console.error('Error cancelling appointment:', err.message);
    res.status(500).json({ message: 'Failed to cancel appointment', error: err.message });
}
};
