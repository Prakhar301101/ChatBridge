const User = require('../models/user');
const Message = require('../models/Message');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// @desc    Register a new User
// @route   POST /api/users
// @access  Public
module.exports.registerUser = async (req, res) => {
  const { email, name, password } = req.body;
  if (!name || !password || !email) {
    return res.status(400).json('Please provide all details!');
  }

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const user = await User.create({ name, password: hashedPass, email });
    if (user) {
      const token = generateToken(user._id, user.name);
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      return res.status(400).json({
        message: 'Invalid user',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
module.exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id, user.name);
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 25892000000),
        httpOnly: true,
        sameSite: 'none',
        secure: true,
      });
      return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      return res.status(400).json({
        message: 'Invalid credentials',
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    LogOut user
// @route   POST /api/users/logout
// @access  Private
module.exports.logoutUser = (req, res) => {
  res
    .cookie('jwt', '', {
      httpOnly: true,
    })
    .json('ok');
};

// @desc    Get user info
// @route   GET /api/users/me
// @access  Private
module.exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    return res.status(200).json({
      email: user.email,
      username: user.name,
      id: user._id,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get All users
// @route   GET /api/users
// @access  Private
module.exports.getAllUsers = async (req, res) => {
  try {
    const Users = await User.find({}, { _id: 1, name: 1 });
    if (Users) {
      return res.status(200).json(Users);
    } else {
      return res.status(400).json({ message: 'Unable to get Users' });
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({ message: 'Failed to get Users' });
  }
};

// @desc    Get messages between users
// @route   GET /api/messages/:id
// @access  Private
module.exports.getMessages = async (req, res) => {
  const recipientId = req.params.id;
  const senderId = req.user.id;
  if (recipientId && senderId) {
    try {
      const messages = await Message.find({
        sender: { $in: [senderId, recipientId] },
        recipient: { $in: [senderId, recipientId] },
      }).sort({ createdAt: 1 });
      return res.status(200).json(messages);
    } catch (err) {
      console.log('error occurred while fetching messages', err);
      return res
        .status(400)
        .json({ message: 'Error occurred while retrieving messages' });
    }
  } else {
    return res.status(400).json('Select Recipient first!');
  }
};

// Generate token
const generateToken = (id, name) => {
  return jwt.sign({ id, name }, process.env.SECRET, { expiresIn: '30d' });
};
