const electron = require('electron');
const { app, BrowserWindow, ipcMain: ipc } = electron;
const path = require('path');
const url = require('url');

let mainWindow;
let userDatabaseDirectory = app.getPath('desktop');

function createWindow () {
    const screen = electron.screen.getPrimaryDisplay();
    let height = screen.size.height * 0.9;
    let width = height / (11 / 8.5);

    mainWindow = new BrowserWindow({
        height: height,
        width: width,
        // frame: false,
        resize: false,
    });

    mainWindow.openDevTools();

    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    mainWindow.on('closed', _=> {
        mainWindow = null;
    });

};

app.on('ready', createWindow);