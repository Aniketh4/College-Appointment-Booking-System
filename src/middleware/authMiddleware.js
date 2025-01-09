const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    // Check for token in cookies or headers
    const token = req.cookies.jwt || req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the user based on the decoded token
    const user = await User.findById(decoded.id).select('-password'); // Exclude password
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }

    // Attach the user to the request object
    req.user = user;

    next(); // Continue to the next middleware or route handler
  } catch (err) {
    console.error('Authentication error:', err.message);
    res.status(401).json({ message: 'Invalid token or session expired.', error: err.message });
  }
};

module.exports = authenticate;
