const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Routes
const inspectionRoutes = require('./routes/inspectionRoutes');
const userRoutes = require('./routes/userRoutes');

// Initialize express app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});

// Routes
app.use('/api/v1/inspections', inspectionRoutes);
app.use('/api/v1/users', userRoutes);

// Serves the frontend (for local/production builds handling static files)
const frontendBuildPath = path.join(__dirname, 'frontend-build');
const frontendDevPath = path.join(__dirname, '../frontend/dist');

// Check if packaged frontend exists (Electron/Production)
if (fs.existsSync(frontendBuildPath)) {
    console.log('Serving frontend from packaged build:', frontendBuildPath);
    app.use(express.static(frontendBuildPath));
    app.get(/(.*)/, (req, res) => {
        if (!req.path.startsWith('/api')) {
            res.sendFile(path.join(frontendBuildPath, 'index.html'));
        } else {
            res.status(404).send('Not Found');
        }
    });
} else {
    // Fallback to dev structure
    // Note: In Vercel, this might not find the separate frontend folder unless deployed together, 
    // but we keep this logic for consistency with local dev.
    if (fs.existsSync(frontendDevPath)) {
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
}

module.exports = app;
