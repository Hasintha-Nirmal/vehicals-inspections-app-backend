const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

//initialize express app
const app = express();
const inspectionRoutes = require('./routes/inspectionRoutes');


//middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

//routes
app.use('/api/v1/inspections', inspectionRoutes);


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

