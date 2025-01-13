const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Using jwt to authenticate the professor
const authenticateProfessor = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Please login first and then try again' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.role !== 'professor') {
      return res.status(401).json({ message: 'Access restricted to professors only' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ message: 'Invalid token or session expired.', error: err.message });
  }
};

// Using jwt to authenticate the student
const authenticateStudent = async (req, res, next) => {
  try {
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Please login first and then try again' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user || user.role !== 'student') {
      return res.status(401).json({ message: 'Access restricted to students only' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ message: 'Invalid token or session expired.', error: err.message });
  }
};

module.exports = { authenticateProfessor, authenticateStudent };
