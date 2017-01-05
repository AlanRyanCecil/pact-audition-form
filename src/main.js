const electron = require('electron');
const { app, BrowserWindow, ipcMain: ipc } = electron;
const path = require('path');
const url = require('url');

const windows = [];
const windowProperties = {};
let loginWindow;
let mainFormWindow;
let mainWindow;
let userDatabaseDirectory = app.getPath('desktop');

function urler(fileName) {
    return url.format({
        pathname: path.join(__dirname, fileName),
        protocol: 'file',
        slashes: true
    });
}

function createWindow () {
    const screen = electron.screen.getPrimaryDisplay();
    let height = screen.size.height * 0.9;
    let width = height / (11 / 8.5);

    windowProperties.height = height;
    windowProperties.width = width;
    windowProperties.resize = false;
    windowProperties.frame = false;

    mainWindow = new BrowserWindow(windowProperties);
    // mainWindow.openDevTools();
    mainWindow.loadURL(urler('index.html'));

    // mainWindow.on('closed', _=> {
    //     mainWindow = null;
    // });
    // windows.push(mainWindow);
};

app.on('ready', createWindow);

ipc.on('userLogin', _=> {
    mainWindow.webContents.send('userLogin');
});

ipc.on('adminLogin', _=> {
    mainWindow.webContents.send('adminLogin');
});

ipc.on('userHistoryFound', (event, history) => {
    mainWindow.webContents.send('userHistorySend', history);
});

ipc.on('updateUser', (event, key, value) => {
    mainWindow.webContents.send('updateUser', key, value);
});

ipc.on('userLogout', _=> {
    mainWindow.loadURL(urler('index.html'));
    // mainWindow.webContents.send('userLogout');
});