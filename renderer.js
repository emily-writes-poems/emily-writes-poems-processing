const { ipcRenderer } = require('electron')
var config = require('./config')

document.getElementById('process-poem').onclick = () => {
    console.log('process poem!');
    ret = ipcRenderer.sendSync('open-file-dialog', [config.poems_folder, config.process_poem_script]);
    if(ret==1){
        new Notification('Poem not processed', { body : 'No poem file was chosen to process' } )
    } else if(ret==-1){
        new Notification('Poem not processed', { body : 'An error occurred' } )
    } else {
        new Notification('Poem processed', { body : ret } )
    }
}

document.getElementById('select-poem_form').addEventListener('show.bs.collapse', () => {
    createDropdown('gather-all-poems', 'select-poem-dropdown', 'poem_id', 'poem_title');
});

document.getElementById('create-details').onclick = () => {
    console.log('create details file!');
    let poem_id = document.getElementById('details_poem_id').value;
    let poem_title = document.getElementById('details_poem_title').value;
    let poem_behind_title = document.getElementById('details_behind_title').value;
    let poem_behind_poem = document.getElementById('details_behind_poem').value;
    let poem_lines = document.getElementById('details_poem_lines').value;

    ret = ipcRenderer.sendSync('create-new-details', [poem_id, poem_title, poem_behind_title, poem_behind_poem, poem_lines]);
    if (ret!=-1) {
        new Notification('Details file created', { body : ret } )
    } else {
        console.log('error creating new details file');
        new Notification('Error creating new details file');
    }
}

document.getElementById('process-details').onclick = () => {
    console.log('process details!');
    ret = ipcRenderer.sendSync('open-file-dialog', [config.details_folder, config.process_details_script]);
    if (ret==1) {
        new Notification('Details not processed', { body : 'No poem details file was chosen to process' } )
    } else if (ret==-1) {
        new Notification('Details not processed', { body : 'An error occurred' } )
    } else {
        new Notification('Details processed', { body : ret } )
    }
}

document.getElementById('create-collection').onclick = () => {
    console.log('create new collection!');
    let collection_id = document.getElementById('coll_collection_id').value;
    let collection_name = document.getElementById('coll_collection_name').value;
    let collection_summary = document.getElementById('coll_collection_summary').value;

    ret = ipcRenderer.sendSync('create-new-collection', [collection_id, collection_name, collection_summary])
    if (ret!=-1) {
        new Notification('Created new collection successfully', { body : ret } )
    }
}

document.getElementById('delete-poem').onclick = () => {
    console.log('remove poem!');
    // First gather the effects of removing this poem
    ret = ipcRenderer.sendSync('open-file-dialog', [config.poems_folder, config.remove_poem_script, "find"]);
    // Pass data to confirmation modal
    if (ret!=-1) {
        ret_array = ret.split('\n');
        let d_poems, d_collections, d_features, poem_id;
        [d_poems, d_collections, d_features] = (ret_array.slice(0,3)).map(x => x.slice(1,-1));
        poem_id = ret_array[3]
        poem_file = ret_array[4]
        // Remove poem with confirmed options
        ipcRenderer.sendSync('delete-poem-confirmation', [d_poems, d_collections, d_features, poem_id, poem_file])
    } else {
        console.log('no poem was chosen to delete')
    }
}

document.getElementById('select-collection_form').addEventListener('show.bs.collapse', () => {
    createDropdown('gather-all-collections', 'select-collection-dropdown', 'collection_name', 'collection_id');
});

function createDropdown(function_call, dropdown_menu, option_text, option_value) {
    ret = ipcRenderer.sendSync(function_call);

    var dropdown = document.getElementById(dropdown_menu);
    while (dropdown.firstChild) {
        dropdown.removeChild(dropdown.firstChild);
    }

    for(var i = 0; i < ret.length; i++) {
        let opt = document.createElement("option");
        opt.text = ret[i][option_text];
        opt.value = ret[i][option_value];
        dropdown.add(opt);
    }

}

document.getElementById('new_feature').addEventListener('show.bs.collapse', () => {
    createDropdown('gather-all-poems', 'feat_select-poem-dropdown', 'poem_id', 'poem_title');
});

document.getElementById('create-feature').onclick = () => {
    console.log('create new feature!');
    let selected_poem = document.getElementById('feat_select-poem-dropdown');
    let poem_id = selected_poem.options[selected_poem.selectedIndex].text;
    let poem_title = selected_poem.options[selected_poem.selectedIndex].value;
    let feature_text = document.getElementById('feat_feature_text').value;
    let set_current_feature = document.getElementById('feat_set_current_feature').checked;

    ret = ipcRenderer.sendSync('create-new-feature', [poem_id, poem_title, feature_text, set_current_feature])

    if (ret!=-1) {
        new Notification('Created new feature successfully', { body : ret } )
    } else {
        console.log('error creating new feature');
        new Notification('Error creating new feature');
    }
}
