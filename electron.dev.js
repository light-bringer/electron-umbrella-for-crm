const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');

let win;

const createWindow = () => {
  setTimeout(() => {
    // Create the browser window.
    win = new BrowserWindow({
      width: 800,
      height: 600,
      icon: './src/favicon.ico',
      webPreferences: {
        nodeIntegration: false 
      },
      autoHideMenuBar: true
    });

    win.webContents.on('dom-ready', ()=> {
      win.show();
    });

    // and load the app.
    win.loadURL(url.format({
      pathname: 'localhost:4200',
      protocol: 'http:',
      slashes: true
    }));

   

    // win.webContents.openDevTools();

    // Emitted when the window is closed.
    win.on('closed', () => {
      win = null;
    });
  }, 1000000);
}

app.on('ready', createWindow);

// Quit when all windows are closed.
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
