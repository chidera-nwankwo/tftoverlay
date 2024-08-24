const { contextBridge, ipcRenderer } = require('electron');
const https = require('https');
const { net } = require('electron');
const fetch = require('node-fetch-commonjs')
const { Client } = require('pg');
const { Toastify } = require('toastify-js')
const path = require('path');
const { app, isPackaged } = require('electron')

contextBridge.exposeInMainWorld('electron', {
    minimizeWin: () => ipcRenderer.send('close'),
    setPin: (...args) => ipcRenderer.send('setpin'),
    loadLocalStorage: (callback) => ipcRenderer.on('start', callback),
    getAppPath: () => app.getAppPath(),
    isPackaged:() => app.isPackaged(),
});

contextBridge.exposeInMainWorld('nodefetch', {
    fetch: (...args) => fetch(...args),
});

contextBridge.exposeInMainWorld('toastify', {
    toast: () => Toastify

});

contextBridge.exposeInMainWorld('path', {
    join: (...args) => path.join(...args)
})
