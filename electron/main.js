const electron = require('electron');
const { app, BrowserWindow } = electron;
const path = require('path');
const url = require('url');

const ipcMain = electron.ipcMain;

let mainWindow;

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    frame: false,
    kiosk: true
  });

  // and load the index.html of the app.
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, '/../dist/photobooth/index.html'),
    protocol: 'file:',
    slashes: true
  }));

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  ipcMain.on('fb-authenticate', function (e, args) {
    var options = {
      client_id: args.clientId,
      scopes: 'public_profile',
      redirect_uri: 'https://www.facebook.com/connect/login_success.html'
    };

    var authWindow = new BrowserWindow({
      width: 800, height: 600, show: false, modal: true, webPreferences: { nodeIntegration: false }
    });

    var facebookAuthURL = "https://www.facebook.com/v2.8/dialog/oauth?client_id=" + options.client_id + "&redirect_uri=" + options.redirect_uri + "&response_type=token,granted_scopes&scope=" + options.scopes + "&display=popup";
    authWindow.loadURL(facebookAuthURL);
    authWindow.show();
    authWindow.webContents.on('did-get-redirect-request', function (event, oldUrl, newUrl) {
      var raw_code = /access_token=([^&]*)/.exec(newUrl) || null;
      var access_token = (raw_code && raw_code.length > 1) ? raw_code[1] : null;
      var error = /\?error=(.+)$/.exec(newUrl);
      if (access_token) {
        e.sender.send('fb-token', access_token);
        authWindow.close();
      }
    });
  });
}

app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  if (mainWindow === null) {
    createWindow();
  }
});

