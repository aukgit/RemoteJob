const electron = require('electron');
const path = require('path');
const url = require('url');
const {app, BrowserWindow, Menu, Tray, ipcMain} = electron;

let mainWindow, appIcon, loginWindow, preferenceWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 350,
    height: 120,
    backgroundColor: '#3B464B',
    width: 900,
    height: 640,
    frame: false,
    show: false,
    icon: path.join(__dirname, 'icons/png/64x64.png')
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'index.html'),
    protocol: 'file:',
    slashes: true
  }));

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    app.quit();
  });

  mainWindow.webContents.toggleDevTools();

}

function createContextMenu() {
  appIcon = new Tray(path.join(__dirname, 'icons/png/64x64.png'));
  let contextMenu = Menu.buildFromTemplate(contextMenuTemplate);
  appIcon.setToolTip('UAT');
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
    icon: path.join(__dirname, 'icons/png/64x64.png')
  });

  loginWindow.loadURL(url.format({
    pathname: path.join(__dirname,'./src/login.html'),
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
    height: 378,
    parent: mainWindow,
    frame: false,
    show: false,
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

ipcMain.on('show-preference', () => {
  createPreferenceWindow();
});

ipcMain.on('hide-preference', () => {
  preferenceWindow.close();
});

ipcMain.on('loadMainWindow', (e, config) => {
  //console.log(config);
  createWindow();
  loginWindow.close();
});

app.on('ready', () => {
  //createWindow();
  createLoginWindow();
  createContextMenu();
});


let contextMenuTemplate = [
  {
    label: 'Start',
    click(){

    }
  },
  {
    label: 'Stop',
    click(){

    }
  },
  {
    label: 'Pause',
    click(){

    }
  },
  {
    label: 'Close',
    accelerator: 'CommandOrControl+Q',
    click(){
      app.quit();
    }
  }
]
