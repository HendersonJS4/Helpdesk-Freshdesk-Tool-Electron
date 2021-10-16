// SET ENV 'development' - 'production'
process.env.NODE_ENV = 'production';

const electron = require('electron');
const path = require('path');
const url = require('url');

const {app, BrowserWindow, Menu} = electron;

let mainWindow;


// Listen for app to be ready
app.on('ready', function() {

  // Create new window
  mainWindow = new BrowserWindow( {
      backgroundColor: '#FFF',
      width: 1126,
      height: 725,
      resizable: false,
      webPreferences: {
        enableRemoteModule: true,
        nodeIntegration: true,
        webSecurity: false,
        webviewTag: true
      }
  });

  // Load html in window
  mainWindow.loadURL(url.format( {
    //pathname: path.join(__dirname, 'mainWindow.html'),
    pathname: path.join(__dirname, 'mainWindow.html'),
    protocol: 'file:',
    //protocol: 'http:',
    // slashes: true
  }));

  // Open dev tools
  mainWindow.openDevTools( {
  });

  // Disable throttling while in background/minimized
  mainWindow.webContents.setBackgroundThrottling(false);

  // Quit app when closed
  mainWindow.on('closed', function() {
    app.quit();
  });

  // Build menu from template
  const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
  // Insert menu
  Menu.setApplicationMenu(mainMenu);

  mainWindow2 = new BrowserWindow( { //mainWindow2 to authenticate the app as a valid user in freshdesk - login with your freshdesk / VPN credentials
    width: 687,
    height: 775,
    minimizable: false,
    resizable: false,
    show: true,
    webPreferences: {
      enableRemoteModule: true,
      nodeIntegration: true,
      webSecurity: false,
      webviewTag: true
    }
  });

  // Load html in window
  mainWindow2.loadURL(url.format( {
    pathname: path.join('https://0your-freshdesk-url0.com/'), //URL to authenticate yourself with your freshdesk / VPN credentials
  //protocol: 'http:',
  //slashes:true
  }));

  mainWindow2.setAlwaysOnTop(true);
  mainWindow2.focus();
  mainWindow2.webContents.openDevTools();
});


// Create menu template
const mainMenuTemplate = [
  // Each object is a dropdown
  {
    label: 'File',
    submenu: [
      {
        label: 'Console',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      },
      {
        label: 'Quit',
        accelerator:process.platform == 'darwin' ? 'Command+Q' : 'Ctrl+Q',
        click() {
          app.quit();
        }
      }
    ]
  }
];

// If OSX, add empty object to menu
if(process.platform == 'darwin') {
  mainMenuTemplate.unshift({});
}

// Add developer tools option if in dev
if(process.env.NODE_ENV !== 'production') {
  mainMenuTemplate.push( {
    label: 'Developer Tools',
    submenu: [
      {
        role: 'reload'
      },
      {
        label: 'Toggle DevTools',
        accelerator:process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    ]
  });
}