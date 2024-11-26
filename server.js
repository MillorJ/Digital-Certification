const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const os = require('os'); // Added to get the local IP address

const app = express();

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// HTTPS Server Options
const options = {
    key: fs.readFileSync('./server.key'),
    cert: fs.readFileSync('./server.cert'),
};

// Get the local IP address
function getLocalIP() {
    const interfaces = os.networkInterfaces();
    for (const iface in interfaces) {
        for (const alias of interfaces[iface]) {
            if (alias.family === 'IPv4' && !alias.internal) {
                return alias.address;
            }
        }
    }
    return 'localhost';
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start HTTPS server (listen on all network interfaces)
https.createServer(options, app).listen(443, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log(`HTTPS Server running on https://${localIP}:443`);
    console.log(`Access on your phone via https://${localIP}`);
});
