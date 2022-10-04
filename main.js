const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron')
const dialog = require('electron').dialog
const { execSync } = require('child_process')
const { MongoClient } = require('mongodb');

var fs = require('fs');
var path = require('path');
var config = require('./config');

var mongo_database = null


// Load the app window
function createWindow () {
    const win = new BrowserWindow({
        width: 1000,
        height: 750,
        webPreferences: {
            nativeWindowOpen: true,
            preload: path.join(__dirname, 'preload.js')
        },
    })

    win.loadFile('index-react.html')
}


// Gather list of poem collections
ipcMain.on('gather-all-collections', (event, args) => {
    mongo_database.collection(config.mongo_poemcolls_coll).find({}, { projection: { _id : 0 } }).toArray((err, result) => {
        if(err) throw err;
        event.returnValue = result;
    });
});


// Gather list of poems
ipcMain.on('gather-all-poems', (event, args) => {
    let t = args[0];
    if(t=='poemslist') {
        mongo_database.collection(config.mongo_poems_coll).find({}, { projection: {"poem_id" : 1, "poem_title" : 1, "poem_date" : 1, _id : 0} }).toArray((err, result) => {
            if(err) throw err;
            event.returnValue = result;
        });
    } else if(t=='features') {
        mongo_database.collection(config.mongo_poems_coll).find({}, { projection: {"poem_id" : 1, "poem_title" : 1, _id : 0} }).toArray((err, result) => {
            if(err) throw err;
            event.returnValue = result;
        });
    } else {
        console.log('gather-all-poems received an invalid argument: ' + t);
        event.returnValue = -1;
    }

});


// Gather list of features
ipcMain.on('gather-all-features', (event, args) => {
    mongo_database.collection(config.mongo_feat_coll).find({}, { projection: {_id : 0} }).toArray((err, result) => {
        if(err) throw err;
        event.returnValue = result;
    })
});


// Create new poem file from form fields
ipcMain.on('create-new-poem', (event, args) => {
    console.log('attempting to create new poem');
    let file_name = config.poems_folder + args[0] + '.txt'

    var poem_file = fs.createWriteStream(file_name)
    poem_file.on('open', () => {
        poem_file.write(args[1]);  // title
        poem_file.write("\n" + config.poem_author + "\n");  // author
        poem_file.write(args[2]);  // date
        poem_file.write("\n\n");
        poem_file.write(args[3]);  // lines

        poem_file.end();
    });

    poem_file.on('close', () => {
        event.returnValue = file_name;
    })
})


// Create new poem details file from form fields
ipcMain.on('create-new-details', (event, args) => {
    console.log('attempting to create new details');
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

    details_file.on('close', () => {
        event.returnValue = file_name;
    })
})


// Create new feature from form fields
ipcMain.on('create-new-feature', (event, args) => {
    let [poem_id, poem_title, feature_text, set_current_feature] = args;

    if (set_current_feature == true) { // Want to set this new feature as the current feature, so unset any existing current feature
        unsetCurrentFeature();
    }
    // Insert into DB
    mongo_database.collection(config.mongo_feat_coll).insertOne( { "poem_id" : poem_id, "poem_title" : poem_title, "featured_text" : feature_text, "currently_featured" : set_current_feature }, (err, result) => {
        if(err) throw err;
        console.log("Inserted new feature: " + args)
        if(set_current_feature) {
            event.returnValue = "Set as current feature: " + poem_title;
        } else {
            event.returnValue = "Not set as current feature: " + poem_title;
        }
    } );
});


// Create new poem collection from form fields
ipcMain.on('create-new-collection', (event, args) => {
    // Insert into DB
    mongo_database.collection(config.mongo_poemcolls_coll).insertOne( { "collection_id" : args[0], "collection_name" : args[1], "collection_summary" : args[2] }, (err, result) => {
        if(err) throw err;
        console.log("Inserted new collection: " + args);
        event.returnValue = args[1];
    } );
});


// Show open file dialog:
// If a file was chosen, run the specified command via shell script
ipcMain.on('open-file-dialog', (event, [folder_path, isShellCommand, command, args]) => {
    dialog.showOpenDialog({
        defaultPath: folder_path,
        properties: ['openFile']
    }).then(selected_file => {
        if (!selected_file.canceled) {
            if (isShellCommand) {
                let ret = runShellCommand(createCommand(command, [selected_file.filePaths, args]));
                if (ret == 0) {
                    event.returnValue = selected_file.filePaths;
                } else { // Some error occured when running command
                    event.returnValue = -1;
                }
            } else if (command == 'delete-poem') {  // Delete poem
                let poem_file = selected_file.filePaths[0];
                let poem_id = path.basename(poem_file, '.txt');
                let options = {
                    buttons: ["Yes" , "No"],
                    message: 'Are you sure you want to delete this poem? poem_id: ' + poem_id,
                    type: 'question'
                };

                dialog.showMessageBox(options).then((response) => {
                    if (response.response == 0) {  // confirmed to delete
                        let ret = runShellCommand(createCommand(config.remove_poem_script, [poem_file]));
                        event.returnValue = poem_id;
                    } else {  // canceled deletion
                        console.log('Canceled poem deletion');
                        event.returnValue = 1;
                    }
                });
            } else {
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


// Clear any currently featured poems
function unsetCurrentFeature() {
    mongo_database.collection(config.mongo_feat_coll).updateMany( { "currently_featured" : true }, { "$set" : { "currently_featured" : false } }, (err, res) => {
        if(err) { throw err; }
        else {
            console.log("Successfully unset current feature.");
            return;
        }
    });
}

// Handle editing current feature
ipcMain.on('edit-current-feature', (event, args) => {
    let options = {
        buttons: ["Yes" , "No"],
        message: "Are you sure?",
        detail: args[0] + '\n' + args[1] + '\ncurrently featured: ' + args[2],
        type: 'question'
    }

    dialog.showMessageBox(options).then((response) => {
        if (response.response == 0) {  // confirmed
            mongo_database.collection(config.mongo_feat_coll).updateMany( { "currently_featured" : true }, { "$set" : { "currently_featured" : false } }, (err, res) => {
                if(err) { event.returnValue = -1; }
                else {
                    // console.log("Successfully unset current feature.");
                    if(!args[2]) {
                        mongo_database.collection(config.mongo_feat_coll).updateOne( { "poem_id" : args[0], "featured_text" : args[1] }, { "$set" : { "currently_featured" : true } }, (err, res) => {
                            if(err) { event.returnValue = -1; }
                            else {
                                // console.log("Successfully set current feature.");
                                event.returnValue = 0;
                            }
                        } );

                    } else {
                        // console.log('Not setting any feature.');
                        event.returnValue = 0;
                    }
                }
            })
        } else {
            event.returnValue = -1;
        }
    })
})


// Confirm deleting a poem feature
ipcMain.on('delete-feature', (event, args) => {
    let options = {
        buttons: ["Yes" , "No"],
        message: 'Are you sure you want to delete this poem feature?',
        detail: args[0] + '\n' + args[1],
        type: 'question'
    }

    dialog.showMessageBox(options).then((response) => {
        if (response.response == 0) {  // confirmed to delete
            mongo_database.collection(config.mongo_feat_coll).deleteOne( { "poem_id" : args[0], "featured_text" : args[1] }, (err, result) => {
                if(err) throw err;
                console.log("Successfully deleted poem feature.")
                event.returnValue = 0;
            })
        } else {
            event.returnValue = -1;
        }
    })
})


nativeTheme.on('updated', () => {
    nativeTheme.themeSource = 'system';

    if (nativeTheme.shouldUseDarkColors) {
        app.dock.setIcon('./images/ewp-logo-alt.png');
    } else {
        app.dock.setIcon('./images/ewp-logo.png');
    }
});


// Start up the app
app.whenReady().then(() => {
    // Connect to Mongo database
    MongoClient.connect(config.mongo_conn, (err, client) => {
       if(err) throw err;
       mongo_database = client.db(config.mongo_db);
       console.log('finished connecting to Mongo DB')

       // Then create the window
       createWindow();

       // Set the dock icon
       if (nativeTheme.shouldUseDarkColors) {
           app.dock.setIcon('./images/ewp-logo-alt.png');
       } else {
           app.dock.setIcon('./images/ewp-logo.png');
       }
    });
})
