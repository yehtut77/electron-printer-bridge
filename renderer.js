document.addEventListener('DOMContentLoaded', () => {
    window.electronAPI.listUSBDevices()
        .then(devices => {
            const printerList = document.getElementById('printerList');
            
            // Check if any printers are found
            const printers = devices.filter(device => device.deviceType === 'printer');
            if (printers.length === 0) {
                const option = document.createElement('option');
                option.text = 'No printers available';
                printerList.appendChild(option);
              
                return;
            }
            
            // Populate printer list
            printers.forEach(printer => {
                const option = document.createElement('option');
                option.value = printer.deviceId;
                option.text = `Printer ${printer.deviceId}`;
                printerList.appendChild(option);
            });
        })
        .catch(err => console.error("Failed to get printers:", err));

    
});

function generateReceiptData() {
    // Replace with your receipt data generation logic
    return "Your receipt data";
}
