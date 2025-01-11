const User = require('../models/User');
const Availability = require('../models/Availability');
const Appointment = require('../models/Appointment');

//Listing all available slots optionally filtered by date and professorId
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
      message: 'List of all available slots',
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

//Booking a slot for a professor and student, removing the booked time slot from the professor's availability
exports.bookslot = async (req, res) => {
    try {
      const { professorId, date, timeSlot } = req.body;
      const studentId = req.user._id;
  
      // Checking if all the required fields are provided
      if (!professorId || !date || !timeSlot) {
        return res.status(400).json({ message: 'Professor ID, date, and time slot are required' });
      }
  
      // Check if the professor is available for the given date and time slot
      const availability = await Availability.findOne({
        professorId,
        date: new Date(date),
        timeSlots: timeSlot,
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
  
      // Removing the booked time slot from the professor's availability
      await Availability.updateOne(
        { professorId, date: new Date(date) },
        { $pull: { timeSlots: timeSlot } }
      );
  
      res.status(201).json({ message: 'Slot booked successfully', appointment });
    } catch (err) {
      console.error('Error booking slot:', err.message);
      res.status(500).json({ message: 'An error occurred while booking the slot', error: err.message });
    }
};

//Viewing all booked slots for a student, if professor cancels slot, it will be removed from the student's booked slots
exports.viewbookedslots = async (req, res) => {
    try {
      const studentId = req.user._id;
  
      const bookedSlots = await Appointment.find({ 
        studentId 
      }).populate('professorId', 'name email');

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