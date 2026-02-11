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

const requireApiKey = require('./middleware/requireApiKey');

//routes
app.use('/api/v1/inspections', requireApiKey, inspectionRoutes);


// Serves the frontend
const path = require('path');
const fs = require('fs');
const frontendBuildPath = path.join(__dirname, 'frontend-build');
const frontendDevPath = path.join(__dirname, '../frontend/dist');

// Check if packaged frontend exists (Electron/Production)
if (fs.existsSync(frontendBuildPath)) {
    console.log('Serving frontend from packaged build:', frontendBuildPath);
    app.use(express.static(frontendBuildPath));
    app.get(/(.*)/, (req, res) => {
        // Handle API routes passing through if regex matches everything? 
        // No, Express handles middleware in order. Routes are defined above.
        // We just need to check if it's an API call or not? 
        // Actually, with `/(.*)/` it matches everything.
        // Since API routes are defined ABOVE, they are handled.
        // But we should filter if sending index.html
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendBuildPath, 'index.html'));
        } else {
            // Should not happen if API routes are matched, but just in case
            res.status(404).send('Not Found');
        }
    });
} else {
    // Fallback to dev structure
    console.log('Serving frontend from dev build:', frontendDevPath);
    app.use(express.static(frontendDevPath));
    app.get(/(.*)/, (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendDevPath, 'index.html'));
        } else {
            res.status(404).send('Not Found');
        }
    });
}


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

