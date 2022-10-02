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
    sendCreateNotification: (ret, file_type) => {
        if(ret!=1) {
            new Notification(file_type + ' file created', { body : ret } );
        } else {
            new Notification('Error creating new ' + file_type + ' file');
        }
    },
    sendDeleteNotification: (ret, t) => {
        if(ret==1) {
            new Notification(t + ' not deleted', { body : 'No ' + t + ' was chosen to process' } );
        } else {
            new Notification('Successfully deleted ' + t, { body : ret } );
        }
    }
})


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
})
