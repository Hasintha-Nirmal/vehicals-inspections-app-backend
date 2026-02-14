const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const schema = mongoose.Schema

const userSchema = new schema({
    name: {
        type: String, 
        required: [true, 'Please enter your name']
    },
    email: {
        type: String,
        required: [true, 'Please enter your email'],
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Please enter your password'],
    }
},);

//static signup method
userSchema.statics.signup = async function(name, email, password) {
    //validation
    if (!name || !email || !password) {
        throw Error('All fields must be filled');
    }
    if (!validator.isEmail(email)) {
        throw Error('Email is not valid');
    }
    if (!validator.isStrongPassword(password)) {
        throw Error('Password is not strong enough');
    }
    //check if email already exists
    const exists = await this.findOne({ email });

    if (exists) {
        throw Error('Email already in use');
    }

    //hashing password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    //create user
    const user = await this.create({ name, email, password: hash });
    return user;

}

//static login method
userSchema.statics.login = async function(email, password) {
    if (!email || !password) {
        throw Error('All fields must be filled');
    }
    const user = await this.findOne({ email });
    if (!user) {
        throw Error('Incorrect email');
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
        throw Error('Incorrect password');
    }
    return user;
}

module.exports = mongoose.model('User', userSchema);