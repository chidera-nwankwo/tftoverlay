const { contextBridge, ipcRenderer } = require('electron');
const https = require('https');
const { net } = require('electron');
const fetch = require('node-fetch-commonjs')
const { Client } = require('pg');

contextBridge.exposeInMainWorld('electron', {
    minimizeWin: () => ipcRenderer.send('close'),
    setPin: (...args) => ipcRenderer.send('setpin'),
    loadLocalStorage: (callback) => ipcRenderer.on('start', callback)
});

contextBridge.exposeInMainWorld('https', {
    https: (...args) => https.request(...args),
});

contextBridge.exposeInMainWorld('net', {
    request: (...args) => net.request(...args),
});

contextBridge.exposeInMainWorld('nodefetch', {
    fetch: (...args) => fetch(...args),
});

contextBridge.exposeInMainWorld('DBClient', {
    connect: (...args) => Client.connect(...args),
});


