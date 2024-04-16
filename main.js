const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';



// Creating Main Window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'tftoverlay',
        width: isDev ? 1000 : 500,
        height: 300
    });

    // Open devtools if in dev env
    if (isDev) {
        mainWindow.webContents.openDevTools();
    }


    mainWindow.loadFile(path.join(__dirname,'./renderer/index.html'));
}

// Create about window
function createAboutWindow() {
    const aboutWindow = new BrowserWindow({
        title: 'About tftoverlay',
        width: 300,
        height: 300
    });

    aboutWindow.loadFile(path.join(__dirname,'./renderer/about.html'));
}

function createSummonerForm() {
    const summonerWindow = new BrowserWindow({
        title: 'Summoner Details',
        width: isDev ? 1000 : 500,
        height: 300
});

    summonerWindow.loadFile(path.join(__dirname,'./renderer/summoner.html'));
}

// App is ready
app.whenReady().then(() => {
    createMainWindow();

    // Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu)

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow()
        }
    });
});

//Menu template
const menu = [
    ...(isMac ? [{
        label: app.name,
        submenu: [
            {
                label: 'About',
                click: createAboutWindow
            }
        ]
    }] : []),


    {
        role: 'fileMenu',
    },
    ...(!isMac ? [{
        label:'Help',
        submenu: [{
            label: 'About',
            click: createAboutWindow
        }]
    }] : [])

];

app.on('window-all-closed', () => {
    if (!isMac) {
      app.quit()
    }
  })