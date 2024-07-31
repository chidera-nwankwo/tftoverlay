const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';



// Creating Main Window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'tftoverlay',
        width: 500,
        height: 200,
        transparent: true,
        frame: false,
        focusable: true,
        backgroundColor: '#00000000',
        icon: path.join(__dirname,'assets/jinx_circle_38.png'),
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname,'preload.js'),
            sandbox: false,
            //devTools: false,
        }
    });

    // Open devtools if in dev env
    if (isDev) {
        mainWindow.webContents.openDevTools({mode: 'detach'});
    }


    mainWindow.loadFile(path.join(__dirname,'./renderer/index.html'));
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    isalways = mainWindow.setAlwaysOnTop(false,'screen-saver');
    
    ipcMain.on('close', () => {
        if (!isMac) {
            app.quit()
          }
    })

    ipcMain.on('setpin', () => {
        const isAlwaysOnTop = mainWindow.isAlwaysOnTop();
        mainWindow.setAlwaysOnTop(!isAlwaysOnTop,'screen-saver');
    })
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