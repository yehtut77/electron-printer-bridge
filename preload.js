const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    listUSBDevices: () => ipcRenderer.invoke('list-usb-devices'),
});