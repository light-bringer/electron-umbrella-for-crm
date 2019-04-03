const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const pjson = require('./package.json');
const appname = pjson.name;

let win;

const createWindow = () => {
    win = new BrowserWindow({
        titleBarStyle: 'hidden',
        backgroundColor: '#312450',
        width: 800,
        height: 600,
        icon: path.join(__dirname,  'favicon.ico'),
    });


    win.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file:',
        slashes: true
    }));

    win.on('closed', () => {
        win = null;
    });
}

app.on('ready', createWindow);


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
