require('dotenv').config();
const mongoose = require('mongoose');
const app = require('./app');

//connect to db and start server
mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
    .then(() => {
        console.log('Connected to MongoDB');

        //start server
        app.listen(process.env.PORT, () => {
            console.log(`Server running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.error('Failed to connect to MongoDB', error);
    });
