const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Using jwt to authenticate the user
const authenticate = async (req, res, next) => {
  try {
    // Getting the token from the cookies or headers
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Please login first and then try again' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found in database, first sign up and then try again' });
    }

    // Attach the user data to the request object
    req.user = user;

    next();
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ message: 'Invalid token or session expired.', error: err.message });
  }
};

module.exports = authenticate;
