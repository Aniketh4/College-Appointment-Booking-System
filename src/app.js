const express = require('express');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const connectDB = require('./db.js')
const { authenticateProfessor, authenticateStudent } = require('./middleware/authMiddleware.js')

dotenv.config();
const PORT = process.env.PORT || 5000;

const app = express();

//authRoutes for signup, login and logout
const authRoutes = require('./routes/authRoutes');
//studentRoutes for viewing all available slots, booking a slot and viewing all booked slots
const studentRoutes = require('./routes/studentRoutes');
//professorRoutes for creating a new availability, viewing all booked slots and cancelling a booked slot
const professorRoutes = require('./routes/professorRoutes.js');

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

app.use('/auth', authRoutes);
//authentication middleware to check if the user is a student for student routes
app.use('/students', authenticateStudent, studentRoutes);
//authentication middleware to check if the user is a professor for professor routes
app.use('/professors', authenticateProfessor, professorRoutes);

app.use((req, res) => {
    res.status(404).json({ message: 'Route does not exist, please check the documentation' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});

connectDB();