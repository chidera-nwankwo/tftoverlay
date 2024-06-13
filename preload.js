const { contextBridge } = require('electron');
const https = require('https');
const { net } = require('electron');
const fetch = require('node-fetch-commonjs')
const { Client } = require('pg');


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
})
