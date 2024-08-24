const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';



// Creating Main Window
function createMainWindow() {
    const mainWindow = new BrowserWindow({
        title: 'tftoverlay',
        x: 0,
        y:0,
        maxWidth: 500,
        maxHeight: 200,
        minHeight: 200,
        minWidth: 500,
        transparent: true,
        frame: false,
        focusable: true,
        backgroundColor: '#00000000',
        //icon: path.join(__dirname,'assets/jinx_circle_38.png'),
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

    // loads html
    mainWindow.loadFile(path.join(__dirname,'./renderer/index.html'));

    // sets the window ontop of everything in the display
    mainWindow.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });
    mainWindow.setAlwaysOnTop(true, 'screen-saver', 1);

    // communicates with the renderer that the app has loaded
    mainWindow.on('ready-to-show', () => {
        mainWindow.webContents.send('start');
    });
    
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

// App is ready
app.whenReady().then(() => {
    createMainWindow();
    


    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createMainWindow()
        }
    });
});


app.on('window-all-closed', () => {
    if (!isMac) {
      app.quit()
    }
})