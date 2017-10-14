const electron = require('electron');
const path = require('path');
const url = require('url');
const {app, BrowserWindow, Menu, Tray} = electron;

let mainWindow, appIcon;

function createWindow() {
  mainWindow = new BrowserWindow({
    //width: 350,
    //height: 120,
    width: 900,
    height: 640,
    frame: false,
    icon: path.join(__dirname, 'icons/png/64x64.png')
  });

  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname,'index.html'),
    protocol: 'file:',
    slashes: true
  }));

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

app.on('ready', () => {
  createWindow();
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
