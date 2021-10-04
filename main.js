const { app, BrowserWindow } = require('electron')
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog

function createWindow () {
    const wind = new BrowserWindow({
        width: 1000,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
        },
    })

    wind.loadFile('index.html')
}

ipc.on('open-file-dialog', function (event, path) {
    dialog.showOpenDialog({
        defaultPath: path,
        properties: ['openFile']
    }).then(poem_file => {
        console.log(poem_file.filePaths);
    });
})


app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})
