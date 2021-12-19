const { app, BrowserWindow, ipcMain } = require('electron')
const dialog = require('electron').dialog
const { execSync } = require('child_process')
const { MongoClient } = require('mongodb');

var config = require('./config')

var mongo_database = null

// Connect to Mongo database
MongoClient.connect(config.mongo_conn, function(err, client) {
   if(err) throw err;
   mongo_database = client.db(config.mongo_db);
});


// Load the app window
function createWindow () {
    const win = new BrowserWindow({
        width: 1000,
        height: 750,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true,
            nativeWindowOpen: true
        },
    })

    win.loadFile('index.html')
}


// Gather list of poem collections
ipcMain.on('gather-collections', (event, args) => {
    mongo_database.collection(config.mongo_poemcolls_coll).find({}, { projection: {"collection_id" : 1, "collection_name" : 1, _id : 0} }).toArray(function(err, result) {
        if(err) throw err;
        console.log(result);
        event.returnValue = result;
    });
});


// Create new poem details file from form fields
ipcMain.on('create-new-details', (event, args) => {
    var fs = require('fs');
    let file_name = config.details_folder + args[0] + '_ANNOTATED.txt'

    var details_file = fs.createWriteStream(file_name)
    details_file.on('open', () => {
        details_file.write(args[1]);
        details_file.write("\n\nTitle\n");
        details_file.write(args[2]);
        details_file.write("\n\nBehind the poem\n");
        details_file.write(args[3]);
        details_file.write("\n\nPoem lines\n");
        details_file.write(args[4]);

        details_file.end();
    });

    event.returnValue = file_name;
})


// Show open file dialog:
// If a file was chosen, run the specified command via shell script
ipcMain.on('open-file-dialog', (event, [path, command, args]) => {
    dialog.showOpenDialog({
        defaultPath: path,
        properties: ['openFile']
    }).then(selected_file => {
        if (!selected_file.canceled) {
            ret = runShellCommand(createCommand(command, [selected_file.filePaths, args]));
            if (ret==0) {
                event.returnValue = selected_file.filePaths;
            } else { // Some error occured when running command
                event.returnValue = -1;
            }
        } else { // Open file menu was canceled - No file was selected.
            event.returnValue = 1;
        }
    });
})


// Create a command given arguments
function createCommand(command, args) {
    let commandWithArgs = command
    for (const arg of args) {
        commandWithArgs += " " + arg
    }
    return commandWithArgs;
}


// Run a command via shell script
function runShellCommand(command) {
    try {
        let ret = execSync(command, { 'shell' : '/bin/zsh' })
        console.log(ret.toString());
        return 0;
    } catch(err) {
        console.log(err.stderr.toString());
        return -1;
    }
}


// Awful code related to deleting a poem - TODO: completely rewriting this process
ipcMain.on('delete-poem-confirmation', (event, args) => {
    let details = [];
    details.push('POEMS: ' + args[0])
    details.push('COLLECTIONS: ' + args[1])
    details.push('FEATURES: ' + args[2])

    let options = {
        buttons: ["Yes" , "Cancel"],
        message: 'Confirm you want to remove: ' + args[3],
        detail: details.join('\n\n'),
        checkboxLabel: 'Delete all associated features',
        title: 'Confirm removing ' + args[3],
        type: 'question'
    }

    dialog.showMessageBox(options).then((response) => {
        if (response.response == 0) {
            featoption = response.checkboxChecked ? "delete" : "keep";
            ret = runShellCommand(createCommand(config.remove_poem_script, [args[4], "delete", featoption]))
            console.log(ret);
            return
        }
        return
    })
})


// Start up the app
app.whenReady().then(() => {
    createWindow()

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow()
        }
    })
})
