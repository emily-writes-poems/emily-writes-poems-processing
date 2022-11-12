const { contextBridge, ipcRenderer } = require('electron');
var config = require('./config');

contextBridge.exposeInMainWorld('electron', {
    gatherPoems: () => {
        return ipcRenderer.sendSync('gather-all-poems');
    },
    gatherCollections: () => {
        return ipcRenderer.sendSync('gather-all-collections');
    },
    gatherFeatures: () => {
        return ipcRenderer.sendSync('gather-all-features');
    },
    sendProcessNotification: (ret, file_type) => {
        if(ret==1) {
            new Notification(file_type + ' not processed', { body : 'No ' + file_type + ' file was chosen to process' } );
        } else if(ret==-1) {
            new Notification(file_type + ' not processed', { body : 'An error occurred' } );
        } else {
            new Notification(file_type + ' processed', { body : ret } );
        }
    },
    sendCreateNotification: (ret, t) => {
        if(ret!=1) {
            new Notification(t + ' created', { body : ret } );
        } else {
            new Notification('Error creating new ' + file_type);
        }
    },
    sendDeleteNotification: (ret, t) => {
        if(ret==1) {
            new Notification(t + ' not deleted', { body : 'No ' + t + ' was chosen to process' } );
        } else {
            new Notification('Successfully deleted ' + t, { body : ret } );
        }
    },
    sendEditFeatureNotification: (ret, poem_id) => {
        if(ret==0) {
            new Notification('Successfully set current feature', { body: "For poem: " + poem_id });
        } else if(ret==1) {
            new Notification('Successfully removed current feature.');
        } else {
            new Notification('Error editing current feature', { body : "For poem: " + poem_id } );
        }
    }
});


contextBridge.exposeInMainWorld('poem_details', {
    createNewPoem: (poem_id, poem_title, poem_date, poem_lines) => {
        return ipcRenderer.sendSync('create-new-poem', [poem_id, poem_title, poem_date, poem_lines]);
    },
    createNewDetails: (poem_id, poem_title, poem_behind_title, poem_behind_poem, poem_lines) => {
        return ipcRenderer.sendSync('create-new-details', [poem_id, poem_title, poem_behind_title, poem_behind_poem, poem_lines]);
    },
    processPoem: () => {
        return ipcRenderer.sendSync('open-file-dialog', [config.poems_folder, true, config.process_poem_script]);
    },
    deletePoem: () => {
        return ipcRenderer.sendSync('open-file-dialog', [config.poems_folder, false, 'delete-poem']);
    },
    processDetails: () => {
        return ipcRenderer.sendSync('open-file-dialog', [config.details_folder, true, config.process_details_script]);
    }
});

contextBridge.exposeInMainWorld('features', {
    createNewFeature: (poem_id, poem_title, featured_text, set_current_feature) => {
        return ipcRenderer.sendSync('create-new-feature', [poem_id, poem_title, featured_text, set_current_feature]);
    },
    editCurrentFeature: (poem_id, featured_text, currently_featured) => {
        return ipcRenderer.sendSync('edit-current-feature', [poem_id, featured_text, currently_featured]);
    }
});
