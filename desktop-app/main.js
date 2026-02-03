const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 400,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        },
        resizable: false,
        title: "OPGI VPN Client",
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'icon.ico') // We'll need an icon later, but this is fine for now
    });

    win.loadFile('index.html');
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

// Real Backend Logic
let isConnected = false;
const SERVER_URL = 'http://localhost:3000';

ipcMain.handle('connect-vpn', async (event, authKey) => {
    try {
        const response = await fetch(`${SERVER_URL}/api/connect`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ authKey, action: 'connect' })
        });

        const data = await response.json();

        if (response.ok && data.success) {
            isConnected = true;
            return { success: true, ip: data.ip, status: data.status };
        } else {
            return { success: false, error: data.error || 'Connection refused' };
        }
    } catch (e) {
        return { success: false, error: 'Cannot reach server. Is it running?' };
    }
});

ipcMain.handle('disconnect-vpn', async () => {
    // In a real app, we might want to notify the server, but for now we just reset local state
    // Or send a disconnect signal if the server tracks active sessions strictly
    try {
        // Optional: Notify server of disconnect
        // await fetch(`${SERVER_URL}/api/connect`, { ... action: 'disconnect' ... });
    } catch (e) { }

    isConnected = false;
    return { success: true, status: 'Disconnected' };
});
