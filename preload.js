const { contextBridge, ipcRenderer } = require('electron');
const https = require('https');
const { net } = require('electron');
const fetch = require('node-fetch-commonjs')
const { Client } = require('pg');
const Toastify = require('toastify-js');

contextBridge.exposeInMainWorld('electron', {
    minimizeWin: () => ipcRenderer.send('close'),
    setPin: (...args) => ipcRenderer.send('setpin'),
    loadLocalStorage: (callback) => ipcRenderer.on('start', callback)
});

contextBridge.exposeInMainWorld('nodefetch', {
    fetch: (...args) => fetch(...args),
});




