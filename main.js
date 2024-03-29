const { app, BrowserWindow, ipcMain, nativeTheme, shell } = require('electron')
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

    win.loadFile('index.html')
}


// Gather list of poems
ipcMain.on('gather-all-poems', (event, args) => {
    mongo_database.collection(config.mongo_poems_coll).find({}, { sort: ["poem_id", 1], projection: {_id : 0, poem_date : 0} }).toArray((err, result) => {
        if(err) throw err;
        event.returnValue = result;
    });
});


// Gather list of poem collections
ipcMain.on('gather-all-collections', (event, args) => {
    mongo_database.collection(config.mongo_poemcolls_coll).find({}, { projection: { _id : 0 } }).toArray((err, result) => {
        if(err) throw err;
        event.returnValue = result;
    });
});


// Gather list of features
ipcMain.on('gather-all-features', (event, args) => {
    mongo_database.collection(config.mongo_feat_coll).find({}, { projection: {_id : 0} }).toArray((err, result) => {
        if(err) throw err;
        event.returnValue = result;
    })
});


// Open file from path
ipcMain.on('open-file', (event, args) => {
    shell.openPath(args[0] + args[1] + args[2]);
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


// Link 2 poems
ipcMain.on('link-poems', (event, args) => {
    let poem1_id = args[0];
    let poem2_id = args[2];
    // No self link
    if(poem1_id == poem2_id) { event.returnValue = "You can't link a poem to itself!"; return; }
    // Check if poems are already linked
    mongo_database.collection(config.mongo_poems_coll).count( { "poem_id" : poem1_id, "linked_poems_ids" : poem2_id }, (err, result) => {
        if(err) throw err;
        if(result > 0) { event.returnValue = "Poems are already linked!"; return; }
        else {
            let poem1_title = args[1];
            let poem2_title = args[3];
            mongo_database.collection(config.mongo_poems_coll).updateOne( { "poem_id" : poem1_id }, { $push: { "linked_poems_ids" : poem2_id, "linked_poems_titles" : poem2_title } });
            mongo_database.collection(config.mongo_poems_coll).updateOne( { "poem_id" : poem2_id }, { $push: { "linked_poems_ids" : poem1_id, "linked_poems_titles" : poem1_title } });

            event.returnValue = ("Linked 2 poems: " + poem1_id + ", " + poem2_id);
        }
    })
});


ipcMain.on('delete-poem-link', (event, args) => {
    let poem1_id = args[0];
    let poem2_id = args[2];

    // Check if poems are linked, then delete link
    mongo_database.collection(config.mongo_poems_coll).count( { "poem_id" : poem1_id, "linked_poems_ids" : poem2_id }, (err, result) => {
        if(err) throw err;
        if(result == 0) { event.returnValue = "Poems are not linked!"; return; }
        else {
            let poem1_title = args[1];
            let poem2_title = args[3];
            mongo_database.collection(config.mongo_poems_coll).updateOne( { "poem_id" : poem1_id }, { $pull: { "linked_poems_ids" : poem2_id, "linked_poems_titles" : poem2_title } });
            mongo_database.collection(config.mongo_poems_coll).updateOne( { "poem_id" : poem2_id }, { $pull: { "linked_poems_ids" : poem1_id, "linked_poems_titles" : poem1_title } });

            event.returnValue = ("Unlinked poems: " + poem1_id + ", " + poem2_id);
        }
    })
})


// Create new poem collection from form fields
ipcMain.on('create-new-collection', (event, args) => {
    // Insert into DB
    mongo_database.collection(config.mongo_poemcolls_coll).insertOne( { "collection_id" : args[0], "collection_name" : args[1], "collection_summary" : args[2] }, (err, result) => {
        if(err) throw err;
        console.log("Inserted new collection: " + args);
        event.returnValue = args[1];
    } );
});


// Confirm deleting a poem collection
ipcMain.on('delete-collection', (event, args) => {
    let options = {
        buttons: ["Yes" , "No"],
        message: 'Are you sure you want to delete this poem collection?',
        detail: args[1],
        type: 'question'
    }

    dialog.showMessageBox(options).then((response) => {
        if (response.response == 0) {  // confirmed to delete
            mongo_database.collection(config.mongo_poemcolls_coll).deleteOne( { "collection_id" : args[0], "collection_name" : args[1] }, (err, result) => {
                if(err) throw err;
                console.log("Successfully deleted poem collection.")
                event.returnValue = 0;
            })
        } else {
            event.returnValue = 1;
        }
    })
})


// Add or delete a poem to/from a collection
ipcMain.on('edit-collection-poems', (event, args) => {
    let [action, collection_id, poem_id, poem_title] = args;

    if (action=='add') {
        mongo_database.collection(config.mongo_poemcolls_coll).count( { "collection_id" : collection_id, "poem_ids" : poem_id }, (err, result) => {
        if(err) throw err;
        if(result > 0) { event.returnValue = "Poem is already in collection!"; return; }
        else {
            mongo_database.collection(config.mongo_poemcolls_coll).updateOne( { "collection_id" : collection_id }, { $push: { "poem_ids" : poem_id, "poem_titles" : poem_title } });

            event.returnValue = ("Added poem: " + poem_id + " to collection: " + collection_id);
        }
    })
    } else if (action=='delete') {
        mongo_database.collection(config.mongo_poemcolls_coll).count( { "collection_id" : collection_id, "poem_ids" : poem_id }, (err, result) => {
            if(err) throw err;
            if(result == 0) { event.returnValue = "Poem is not in collection!"; return; }
            else {
                mongo_database.collection(config.mongo_poemcolls_coll).updateOne( { "collection_id" : collection_id }, { $pull: { "poem_ids" : poem_id, "poem_titles" : poem_title } });

                event.returnValue = ("Removed poem: " + poem_id + " from collection: " + collection_id);
            }
        });
    } else {
       event.returnValue = "Invalid action for editing poem collection!";
    }
});

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


// Process wordcloud for collection
ipcMain.on('process-wordcloud', (event, collection_id) => {
    let ret = runShellCommand(createCommand(config.process_wordcloud_script, ["update", collection_id]));
    if (ret == 0) {
        event.returnValue = collection_id;
    } else { // Some error occured when running command
        event.returnValue = -1;
    }
});


// Delete wordcloud for collection
ipcMain.on('delete-wordcloud', (event, collection_id) => {
    let ret = runShellCommand(createCommand(config.process_wordcloud_script, ["delete", collection_id]));
    if (ret == 0) {
        event.returnValue = 0;
    } else { // Some error occured when running command
        event.returnValue = -1;
    }
});


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
        if (response.response == 0) {  // confirmed, unset the current feature
            mongo_database.collection(config.mongo_feat_coll).updateMany( { "currently_featured" : true }, { "$set" : { "currently_featured" : false } }, (err, res) => {
                if(err) { event.returnValue = -1; }
                else {
                    if(!args[2]) {  // if this wasn't the previously set feature, set it as the current feature
                        mongo_database.collection(config.mongo_feat_coll).updateOne( { "poem_id" : args[0], "featured_text" : args[1] }, { "$set" : { "currently_featured" : true } }, (err, res) => {
                            if(err) { event.returnValue = -1; }
                            else {
                                event.returnValue = 0;
                            }
                        } );

                    } else {  // this means we removed the previously set feature, and that's all we want to do
                        event.returnValue = 1;
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
            event.returnValue = 1;
        }
    })
})


nativeTheme.on('updated', () => {
    if (nativeTheme.shouldUseDarkColors) {
        app.dock.setIcon('./images/ewp-logo-alt.png');
    } else {
        app.dock.setIcon('./images/ewp-logo.png');
    }
});


ipcMain.on('toggle-theme', () => {
    if (nativeTheme.shouldUseDarkColors) {
        nativeTheme.themeSource = 'light';
    } else {
        nativeTheme.themeSource = 'dark';
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

       nativeTheme.source = 'system';
       // Set the dock icon
       if (nativeTheme.shouldUseDarkColors) {
           app.dock.setIcon('./images/ewp-logo-alt.png');
       } else {
           app.dock.setIcon('./images/ewp-logo.png');
       }
    });
})
