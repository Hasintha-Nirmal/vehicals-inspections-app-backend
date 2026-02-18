const app = require('../app');
const mongoose = require('mongoose');
require('dotenv').config();

let conn = null;

module.exports = async (req, res) => {

  if (!conn) {
    try {
      conn = await mongoose.connect(process.env.MONGODB_URI, {
        dbName: process.env.DB_NAME,
        serverSelectionTimeoutMS: 5000 
      });
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }

  return app(req, res);
};
