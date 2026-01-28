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

// Mock Backend Logic
let isConnected = false;

ipcMain.handle('connect-vpn', async (event, authKey) => {
    // Simulate connection delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    if (!authKey || authKey.length < 5) {
        return { success: false, error: 'Invalid Auth Key' };
    }

    isConnected = true;
    return { success: true, ip: '100.64.0.5', status: 'Connected' };
});

ipcMain.handle('disconnect-vpn', async () => {
    await new Promise(resolve => setTimeout(resolve, 800));
    isConnected = false;
    return { success: true, status: 'Disconnected' };
});
