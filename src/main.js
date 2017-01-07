'use strict';
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
    windowProperties.backgroundColor = '#262626';

    mainWindow = new BrowserWindow(windowProperties);
    // mainWindow.openDevTools();
    mainWindow.loadURL(urler('index.html'));

    mainWindow.on('closed', _=> {
        mainWindow = null;
    });
};

app.on('ready', createWindow);

ipc.on('adminLogin', (event, userDatabase) => {
    mainWindow.webContents.send('adminLogin', userDatabase);
});

ipc.on('login-submit', _=> {
    mainWindow.webContents.send('login-submit');
});

ipc.on('userHistoryFound', (event, history) => {
    mainWindow.webContents.send('userHistoryFound', history);
});

ipc.on('userLogin', _=> {
    mainWindow.webContents.send('userLogin');
});

ipc.on('updateUser', (event, key, value) => {
    mainWindow.webContents.send('updateUser', key, value);
});

ipc.on('userLogout', _=> {
    mainWindow.loadURL(urler('index.html'));
    // mainWindow.webContents.send('userLogout');
});

ipc.on('removeUser', (event, user) => {
    mainWindow.webContents.send('removeUser', user);
});