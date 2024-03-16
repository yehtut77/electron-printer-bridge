const usb = require('usb');

async function listUSBDevices() {
    const devices = usb.getDeviceList();
    return devices.map(device => {
        return {
            deviceId: device.deviceAddress,
            vendorId: device.deviceDescriptor.idVendor,
            productId: device.deviceDescriptor.idProduct
        };
    });
}

module.exports = { listUSBDevices };
