const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
//Using bcrypt to hash passwords for security

//Creating a token for the user using jwt
const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

//Signup for a new user
exports.signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, role });
    res.status(201).json({ message: 'User created successfully', user });
  } catch (err) {
    res.status(400).json({ message: 'Error creating user', error: err.message });
  }
};

//Login for an existing user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Please sign up first and then try again' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Wrong password, please try again' });
    }

    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 24 * 60 * 60 * 1000 });
    res.status(200).json({ message: 'Login successful' });
  } catch (err) {
    res.status(400).json({ message: 'Error logging in', error: err.message });
  }
};

//Logging out the user by deleting the jwt token
exports.logout = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.status(200).json({ message: 'Log out successful' });
};
