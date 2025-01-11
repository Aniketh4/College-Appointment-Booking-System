const User = require('../models/User');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment')

exports.listAvailableProfessors = async (req, res) => {
  try {
    const { date, professorId } = req.body;

    const filterDate = date ? new Date(date) : null;

    const professorQuery = professorId ? { _id: professorId, role: 'professor' } : { role: 'professor' };
    const professors = await User.find(professorQuery, { name: 1, email: 1 });

    const availabilityQuery = filterDate ? { date: filterDate } : {};
    const availabilityData = await Availability.find(availabilityQuery);

    const result = professors.map((professor) => {
      const availability = availabilityData.filter(
        (slot) => String(slot.professorId) === String(professor._id)
      );
      return {
        professorId: professor._id,
        name: professor.name,
        email: professor.email,
        availability: availability.map((a) => ({
          date: a.date,
          timeSlots: a.timeSlots,
        })),
      };
    });

    res.status(200).json({
      message: 'List of professors with their available slots',
      data: result,
    });
  } catch (err) {
    console.error('Error listing professors with availability:', err.message);
    res.status(500).json({
      message: 'An error occurred while fetching professors and availability.',
      error: err.message,
    });
  }
};

exports.bookslot = async (req, res) => {
    try {
      const { professorId, date, timeSlot } = req.body;
      const studentId = req.user._id; // Assuming `req.user` contains the authenticated student's details
  
      // Validate required fields
      if (!professorId || !date || !timeSlot) {
        return res.status(400).json({ message: 'Professor ID, date, and time slot are required' });
      }
  
      // Check if the professor is available for the given date and time slot
      const availability = await Availability.findOne({
        professorId,
        date: new Date(date), // Ensure date is in Date format
        timeSlots: timeSlot, // Check if the timeSlot exists in the array
      });
  
      if (!availability) {
        return res.status(404).json({ message: 'The professor is not available for the selected slot' });
      }
  
      // Create the appointment
      const appointment = await Appointment.create({
        studentId,
        professorId,
        date: new Date(date),
        timeSlot
      });
  
      // Remove the booked time slot from the professor's availability
      await Availability.updateOne(
        { professorId, date: new Date(date) },
        { $pull: { timeSlots: timeSlot } } // Remove the booked timeSlot
      );
  
      res.status(201).json({ message: 'Slot booked successfully', appointment });
    } catch (err) {
      console.error('Error booking slot:', err.message);
      res.status(500).json({ message: 'An error occurred while booking the slot', error: err.message });
    }
};

exports.viewbookedslots = async (req, res) => {
    try {
      // Extract the student ID from the authenticated user
      const studentId = req.user._id;
  
      // Fetch all booked appointments for the student
      const bookedSlots = await Appointment.find({ 
        studentId 
      }).populate('professorId', 'name email'); // Populate professor details
  
      // Check if the student has any bookings
      if (bookedSlots.length === 0) {
        return res.status(404).json({ message: 'No booked slots found' });
      }
  
      res.status(200).json({ 
        message: 'Booked slots fetched successfully', 
        data: bookedSlots 
      });
    } catch (err) {
      console.error('Error fetching booked slots:', err.message);
      res.status(500).json({ 
        message: 'An error occurred while fetching booked slots', 
        error: err.message 
      });
    }
};