document.addEventListener('DOMContentLoaded', () => {
    window.electronAPI.listUSBDevices()
        .then(devices => {
            // Filter printers based on your criteria
            const printers = devices.filter(device => {
                // Replace with your printer's VID and PID
                return device.vendorId === YOUR_PRINTER_VENDOR_ID && device.productId === YOUR_PRINTER_PRODUCT_ID;
            });

            // Display printers to the user for selection
            const printerList = document.getElementById('printerList');
            printers.forEach(printer => {
                const option = document.createElement('option');
                option.value = printer.deviceId;
                option.text = `Printer ${printer.deviceId}`;
                printerList.appendChild(option);
            });
        })
        .catch(err => console.error("Failed to get printers:", err));

    document.getElementById('print').addEventListener('click', () => {
        const selectedPrinterId = document.getElementById('printerList').value;

        if (!selectedPrinterId) {
            console.error("No printer selected");
            return;
        }

        // Fetch the receipt data (replace with your receipt data)
        const receiptData = generateReceiptData();

        // Send print request to the main process
        window.ipcRenderer.send('print-receipt', { printerId: selectedPrinterId, data: receiptData });
    });
});

function generateReceiptData() {
    // Replace with your receipt data generation logic
    return "Your receipt data";
}
