const { app, BrowserWindow, ipcMain } = require('electron');
const express = require('express');
const bodyParser = require('body-parser');
const { listUSBDevices } = require('./printService');
const escpos = require('escpos');

let mainWindow;
let devices; // Define the devices variable to hold the list of USB devices

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    mainWindow.loadFile('index.html');
}

app.whenReady().then(async () => { // Use async/await to wait for listUSBDevices to complete
    createWindow();

    // Start the HTTP server
    const httpServer = express();
    httpServer.use(bodyParser.json());

    // Endpoint to list USB devices
    httpServer.get('/list-usb-devices', async (req, res) => {
        devices = await listUSBDevices(); // Populate the devices variable with the list of USB devices
        res.json(devices);
    });

    // Endpoint to print receipt
    httpServer.post('/print-receipt', (req, res) => {
        const { printerId, data } = req.body;
    
        if (!devices || devices.length === 0) {
            console.error('No USB devices found');
            res.status(400).json({ error: 'No USB devices found' });
            return;
        }
    
        // Retrieve printer info based on the selected printerId
        const printerInfo = devices.find(device => device.deviceId === printerId);
    
        if (!printerInfo) {
            console.error('Printer not found');
            res.status(400).json({ error: 'Printer not found' });
            return;
        }
    
        const { vendorId, productId } = printerInfo;
    
        const device = new escpos.USB(vendorId, productId);
        const printer = new escpos.Printer(device);
    
        device.open((error) => {
            if (error) {
                console.error('Error opening printer:', error);
                res.status(500).json({ error: 'Error opening printer' });
                return;
            }
    
            // Send the ESC/POS commands to the printer
            printer
                .text(data)
                .close((error) => {
                    if (error) {
                        console.error('Error printing receipt:', error);
                        res.status(500).json({ error: 'Error printing receipt' });
                        return;
                    }
                    console.log('Receipt printed successfully');
                    res.json({ status: 'Receipt printed successfully' });
                });
        });
    });
    

    httpServer.listen(3001, () => {
        console.log('Print server running on http://localhost:3001');
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});
