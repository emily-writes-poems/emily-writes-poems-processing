const ipc = require('electron').ipcRenderer;
var config = require('./config');

document.getElementById('process-poem').onclick = () => {
    console.log('process poem!');
    ipc.send('open-file-dialog', config.poems_folder);
}

document.getElementById('process-details').onclick = () => {
    console.log('process details!');
    ipc.send('open-file-dialog', config.details_folder);
}
