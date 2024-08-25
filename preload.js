const { contextBridge, ipcRenderer } = require('electron');
const fetch = require('node-fetch-commonjs')
const Toastify  = require('toastify-js')
const path = require('path');
const app = require('electron');

contextBridge.exposeInMainWorld('electron', {
    minimizeWin: () => ipcRenderer.send('close'),
    setPin: (...args) => ipcRenderer.send('setpin'),
    loadLocalStorage: (callback) => ipcRenderer.on('start', callback),
    getAppPath: () => app.getAppPath(),
    checkIsPackaged: app.isPackaged
});

contextBridge.exposeInMainWorld('nodefetch', {
    fetch: (...args) => fetch(...args),
});

contextBridge.exposeInMainWorld('path', {
    join: (...args) => path.join(...args)
});

contextBridge.exposeInMainWorld('toastify', {
    showToast: (options) => {
        Toastify(options).showToast();
    }
})