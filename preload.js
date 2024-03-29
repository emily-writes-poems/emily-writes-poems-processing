const { contextBridge, ipcRenderer } = require('electron');
var config = require('./config');

contextBridge.exposeInMainWorld('electron', {
    toggleTheme: () => {
        ipcRenderer.send('toggle-theme');
    },
    gatherPoems: () => {
        return ipcRenderer.sendSync('gather-all-poems');
    },
    gatherCollections: () => {
        return ipcRenderer.sendSync('gather-all-collections');
    },
    gatherFeatures: () => {
        return ipcRenderer.sendSync('gather-all-features');
    },
    sendProcessNotification: (ret, type) => {
        if(ret==1) {
            new Notification(type + ' not processed', { body : 'No ' + type + ' was chosen to process' } );
        } else if(ret==-1) {
            new Notification(type + ' not processed', { body : 'An error occurred' } );
        } else {
            new Notification(type + ' processed', { body : ret } );
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
        } else if (ret==-1) {
            new Notification(t + ' not deleted', { body : 'An error occurred' } );
        } else if (ret==0) {
            new Notification('Successfully deleted ' + t)
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
    },
});


contextBridge.exposeInMainWorld('poem_details', {
    openFile: (type, poem) => {
        var folder = type == 'poem' ? config.poems_folder : config.details_folder;
        var suffix = type == 'poem' ? '.txt' : '_ANNOTATED.txt';
        ipcRenderer.send('open-file', [folder, poem, suffix]);
    },
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
    },
    linkPoems: (poem1_id, poem1_title, poem2_id, poem2_title) => {
        return ipcRenderer.sendSync('link-poems', [poem1_id, poem1_title, poem2_id, poem2_title]);
    },
    deleteLinkedPoem: (poem1_id, poem1_title, poem2_id, poem2_title) => {
        return ipcRenderer.sendSync('delete-poem-link', [poem1_id, poem1_title, poem2_id, poem2_title]);
    },
    sendPoemsLinkedNotification: (ret) => {
        new Notification('Link poems', { body : ret } );
    }
});

contextBridge.exposeInMainWorld('collections', {
    createNewCollection: (collection_id, collection_name, collection_summary) => {
        return ipcRenderer.sendSync('create-new-collection', [collection_id, collection_name, collection_summary]);
    },
    deleteCollection: (collection_id, collection_name) => {
        return ipcRenderer.sendSync('delete-collection', [collection_id, collection_name]);
    },
    editCollectionPoems: (action, collection_id, poem_id, poem_title) => {
        return ipcRenderer.sendSync('edit-collection-poems', [action, collection_id, poem_id, poem_title]);
    },
    sendCollectionPoemsNotification: (ret) => {
        new Notification('Collection poems', { body : ret } );
    },
    processWordcloud: (collection_id) => {
        return ipcRenderer.sendSync('process-wordcloud', collection_id);
    },
    deleteWordcloud: (collection_id) => {
        return ipcRenderer.sendSync('delete-wordcloud', collection_id);
    }
});

contextBridge.exposeInMainWorld('features', {
    createNewFeature: (poem_id, poem_title, featured_text, set_current_feature) => {
        return ipcRenderer.sendSync('create-new-feature', [poem_id, poem_title, featured_text, set_current_feature]);
    },
    editCurrentFeature: (poem_id, featured_text, currently_featured) => {
        return ipcRenderer.sendSync('edit-current-feature', [poem_id, featured_text, currently_featured]);
    },
    deleteFeature: (poem_id, featured_text) => {
        return ipcRenderer.sendSync('delete-feature', [poem_id, featured_text]);
    }
});
