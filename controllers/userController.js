const User = require('../models/userModels');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

//create token
const createToken = (_id) => {
    return jwt.sign({ _id }, process.env.SECRET, { expiresIn: '2h' });
}

//login user
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.login(email, password);

        //create a token
        const token = createToken(user._id);
        res.status(200).json({ email, token ,name:user.name});
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

//signup user
const signupUser = async (req, res) => {
    const { name, email, password ,invitecode} = req.body;
    if(invitecode !== process.env.INVITE_CODE){
        return res.status(400).json({ error: 'Invalid invite code' });
    }

    try {
        const user = await User.signup(name, email, password);
        //create a token
        const token = createToken(user._id);
        res.status(200).json({ email, token ,name:user.name});
    }catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { loginUser, signupUser };