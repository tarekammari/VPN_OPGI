const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('vpnAPI', {
    connect: (authKey) => ipcRenderer.invoke('connect-vpn', authKey),
    disconnect: () => ipcRenderer.invoke('disconnect-vpn')
});
