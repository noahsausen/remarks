const User  = require('../models/userModel');
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.registerUser = async (req, res) => {
  // console.log("registerUser started");
  try {
    const user = await User.findOne({username: req.body.username});
    if (user) {
      return res.status(409).send({message: 'An account with this username already exists'});
    }
    // console.log("User check completed");

    if (req.body.password.length < 5) {
      return res.status(400).send({message: 'Password must be at least 5 characters'});
    } else if (!(data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/))) {
      return res.status(400).send({message: 'Invalid email'});
    }

    const newUser = new User({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    await newUser.save();

    const getNewUser = await User.findOne({username: req.body.username});
    const token = jwt.sign(
        {user: {
            _id: getNewUser._id,
            username: getNewUser.username,
            email: getNewUser.email
        }},
        process.env.JWT_PRIVATE_KEY,
        {expiresIn: '7d'}
    );

    res.cookie('auth_token', token, {
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/api'
    });

    res.status(201).send({message: 'Account created successfully'});
  } catch (error) {
    console.log(error);
    return res.status(500).send({message: 'Internal Server Error'});
  }
}

exports.loginUser = async (req, res) => {
  // console.log("loginUser started");
  try {
    // Check for user
    const user = await User.findOne({username: req.body.username});
    if (!user) {
      return res.status(404).send({message: 'Account does not exist'});
    } else {
      // If exists, check auth
      if (user.password === req.body.password) {
        const token = jwt.sign(
            {user: {
              _id: user._id,
              username: user.username,
              email: user.email
            }},
            process.env.JWT_PRIVATE_KEY,
            {expiresIn: '7d'}
        );

        res.cookie('auth_token', token, {
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          path: '/api'
        });

        return res.status(200).send({message: 'Login successful'});
      } else {
        return res.status(401).send({message: 'Wrong password'});
      }
    }
  } catch (error) {
    // console.log(error);
    return res.status(500).send({message: 'Internal Server Error'});
  }
}