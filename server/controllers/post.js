const Post = require('../models/postModel');
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.sendPost = async (req, res) => {
  // console.log("sendPost started");
  try {
    const verified = await verifyToken(req);

    //console.log(req.body);
    const newPost = new Post({
      author: req.body.author,
      content: req.body.content,
      timestamp: Date.now(),
    });

    if (newPost.author !== verified.user.username) {
      return res.status(403).send({message: 'Forbidden'});
    }
    await newPost.save();
    res.status(200).send({message: "Post created successfully"});
  } catch (error) {
    return res.status(500).send({message: 'Internal Server Error'});
  }
  // console.log("sendPost finished");
}

exports.getAllPosts = async (req, res) => {
  // console.log("getAllPosts started");
  try {
    const verified = await verifyToken(req);

    const posts = await Post.find();
    res.status(200).send({message: 'Got all posts successfully', posts: posts, user: verified.user.username});
  } catch (error) {
    return res.status(500).send({message: 'Internal Server Error'});
  }
}

exports.getUserPosts = async (req, res) => {
  //console.log("getUserPosts started");
  try {
    await verifyToken(req);

    const posts = await Post.find({author: req.body.author});
    res.status(200).send({message: 'Got user posts successfully', posts: posts});
  } catch (error) {
    return res.status(500).send({message: 'Internal Server Error'});
  }
}

async function verifyToken(req) {
  const token = req.cookies.auth_token;

  if (!token) {
    throw new Error('No token provided');
  }

  // Verify and return the decoded user payload
  const decoded = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
  // console.log(verifiedToken);

  const user = await User.findOne({username: decoded.user.username});
  if (!user) {
    throw new Error('User not found');
  }

  return decoded;
}