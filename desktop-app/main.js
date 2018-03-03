const electron = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');
const uData = (electron.app || electron.remote.app).getPath('userData');
const {
  app,
  BrowserWindow,
  Menu,
  Tray,
  ipcMain // inter process communication : 
} = electron;

let mainWindow, appIcon, loginWindow, preferenceWindow, sendEmailWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 350,
    height: 120,
    backgroundColor: '#3B464B',
    // width: 900,
    // height: 640,
    frame: false,
    show: false,
    resizable: false,
    icon: path.join(__dirname, 'icons/png/64x64.png')
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    app.quit();
  });
  //mainWindow.webContents.toggleDevTools();
}

function createContextMenu() {
  appIcon = new Tray(path.join(__dirname, 'icons/png/16x16.png'));
  let contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
  appIcon.setToolTip('RemoteJob');
  appIcon.setContextMenu(contextMenu);
  appIcon.on('click', () => {
    mainWindow.show();
  });
}

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width: 350,
    height: 350,
    frame: false,
    show: false,
    resizable: false,
    icon: path.join(__dirname, 'icons/png/64x64.png')
  });

  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/login.html'),
    protocol: 'file:',
    slashes: true
  }));

  loginWindow.once('ready-to-show', () => {
    loginWindow.show();
  });

  loginWindow.on('closed', () => {
    loginWindow = null;
  });
}

function createPreferenceWindow() {
  preferenceWindow = new BrowserWindow({
    width: 520,
    height: 379,
    parent: mainWindow,
    frame: false,
    show: false,
    resizable: false,
    icon: path.join(__dirname, 'icons/png/64x64.png')
  });

  preferenceWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/preference.html'),
    protocol: 'file:',
    slashes: true
  }));

  preferenceWindow.once('ready-to-show', () => {
    preferenceWindow.show();
  });

  preferenceWindow.on('closed', () => {
    preferenceWindow = null;
  });
}

function createSendEmailWindow() {
  sendEmailWindow = new BrowserWindow({
    width: 500,
    height: 290,
    parent: mainWindow,
    frame: false,
    show: false,
    resizable: false,
    icon: path.join(__dirname, 'icons/png/64x64.png')
  });

  sendEmailWindow.loadURL(url.format({
    pathname: path.join(__dirname, './src/send-email.html'),
    protocol: 'file:',
    slashes: true
  }));

  sendEmailWindow.once('ready-to-show', () => {
    sendEmailWindow.show();
  });

  sendEmailWindow.on('closed', () => {
    sendEmailWindow = null;
  });
  //sendEmailWindow.webContents.toggleDevTools();
}



ipcMain.on('show-email-form', () => { // called from initApp.js file
  createSendEmailWindow(); 
});

ipcMain.on('show-preference', () => {
  createPreferenceWindow();
});


ipcMain.on('hide-preference', () => {
  preferenceWindow.close();
});

ipcMain.on('close-app', () => {
  app.quit();
});

ipcMain.on('loadMainWindow', (err) => {
  createWindow();
  loginWindow.close();
});

console.log(ipcMain);

app.on('ready', () => {
  let data = uData + '/data',
    emailData = uData + '/data/emailData',
    dataPack = uData + '/data/dataPack',
    img = uData + '/data/img';

  if (!fs.existsSync(data)) {
    fs.mkdirSync(data);
  }
  if (!fs.existsSync(dataPack)) {
    fs.mkdirSync(dataPack);
  }
  if (!fs.existsSync(emailData)) {
    fs.mkdirSync(emailData);
  }
  if (!fs.existsSync(img)) {
    fs.mkdirSync(img);
  }

  createLoginWindow();
  createContextMenu();
});


let contextMenuTemplate = [{
    label: 'Start',
    click() {

    }
  },
  {
    label: 'Stop',
    click() {

    }
  },
  {
    label: 'Pause',
    click() {

    }
  },
  {
    label: 'Close',
    accelerator: 'CommandOrControl+Q',
    click() {
      app.quit();
    }
  }
]
