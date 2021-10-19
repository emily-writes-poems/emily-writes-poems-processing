const { ipcRenderer } = require('electron')
var config = require('./config')

document.getElementById('process-poem').onclick = () => {
    console.log('process poem!');
    ret = ipcRenderer.sendSync('open-file-dialog', [config.poems_folder, config.process_poem_script]);
}

document.getElementById('process-details').onclick = () => {
    console.log('process details!');
    ret = ipcRenderer.sendSync('open-file-dialog', [config.details_folder, config.process_details_script]);
}

document.getElementById('create-collection').onclick = () => {
    console.log('create collection!');
    ret = ipc.send();
}

document.getElementById('delete-poem').onclick = () => {
    console.log('remove poem!');
    // First gather the effects of removing this poem
    ret = ipcRenderer.sendSync('open-file-dialog', [config.poems_folder, config.remove_poem_script, "find"]);
    // Pass data to confirmation modal
    ret_array = ret.split('\n');
    let d_poems, d_collections, d_features, poem_id;
    [d_poems, d_collections, d_features] = (ret_array.slice(0,3)).map(x => x.slice(1,-1));
    poem_id = ret_array[3]
    poem_file = ret_array[4]
    // Remove poem with confirmed options
    ipcRenderer.sendSync('delete-poem-confirmation', [d_poems, d_collections, d_features, poem_id, poem_file])
    return
}
