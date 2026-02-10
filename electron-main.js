const { app, BrowserWindow } = require('electron');
const path = require('path');
// Set to true to connect to remote backend (skips local server start)
const CONNECT_REMOTE = true;

if (!CONNECT_REMOTE) {
    const server = require('./server'); // This starts the express server
}

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1280,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
        icon: path.join(__dirname, 'build/icon.ico') // Adjust icon path if needed
    });

    if (CONNECT_REMOTE) {
        // Load frontend from local file system
        const indexHtml = path.join(__dirname, 'frontend-build', 'index.html');
        mainWindow.loadFile(indexHtml).catch(err => {
            console.error('Failed to load local frontend:', err);
        });
    } else {
        // Load the local server
        // Note: We use the PORT from .env or default to 3000
        const PORT = process.env.PORT || 3000;

        // Retry loading URL until server is ready
        const loadUrl = () => {
            mainWindow.loadURL(`http://localhost:${PORT}`).catch((err) => {
                console.log('Server not ready, retrying...');
                setTimeout(loadUrl, 1000);
            });
        };

        loadUrl();
    }

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', function () {
    if (mainWindow === null) {
        createWindow();
    }
});
