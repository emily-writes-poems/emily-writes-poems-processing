const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
    gatherData (func) {
        const ret = ipcRenderer.sendSync(func);
        return ret;
    }
})
