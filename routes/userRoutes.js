const express = require('express');
const roter = express.Router();
const { loginUser, signupUser } = require('../controllers/userController');

//login route
roter.post('/login', loginUser);

//signup route
roter.post('/signup', signupUser);

module.exports = roter;