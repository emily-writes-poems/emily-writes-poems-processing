const { ipcRenderer } = require('electron')
var config = require('./config')


function createDropdown(function_call, dropdown_menu, option_text, option_value) {
    ret = ipcRenderer.sendSync(function_call);

    // Clear existing options for a full refresh
    let dropdown = document.getElementById(dropdown_menu);
    while (dropdown.lastChild) {
        dropdown.removeChild(dropdown.lastChild);
    }

    for(let i = 0; i < ret.length; i++) {
        let opt = document.createElement("option");
        opt.text = ret[i][option_text];
        opt.value = ret[i][option_value];
        dropdown.add(opt);
    }

}


document.getElementById('create-poem-details').onclick = () => {
    console.log('create poem and/or details file!');
    let poem_id = document.getElementById('poem-details_poem_id').value;
    let poem_title = document.getElementById('poem-details_poem_title').value;
    let poem_date = document.getElementById('poem_poem_date').value;
    let poem_lines = document.getElementById('poem-details_poem_lines').value;
    let poem_behind_title = document.getElementById('details_behind_title').value;
    let poem_behind_poem = document.getElementById('details_behind_poem').value;

    if (poem_id && poem_title && poem_date && poem_lines) {
        console.log('create poem file!');
        ret = ipcRenderer.sendSync('create-new-poem', [poem_id, poem_title, poem_date, poem_lines]);
        if (ret!=-1) {
            new Notification('Poem file created', { body : ret } )
        } else {
            console.log('error creating new poem file');
            new Notification('Error creating new poem file');
        }
    }

    if (poem_id && poem_title && poem_behind_title && poem_behind_poem && poem_lines) {
        console.log('create details file!');
        ret = ipcRenderer.sendSync('create-new-details', [poem_id, poem_title, poem_behind_title, poem_behind_poem, poem_lines]);
        if (ret!=-1) {
            new Notification('Details file created', { body : ret } )
        } else {
            console.log('error creating new details file');
            new Notification('Error creating new details file');
        }
    }

}


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
    // console.log('remove poem!');
    // // First gather the effects of removing this poem
    // ret = ipcRenderer.sendSync('open-file-dialog', [config.poems_folder, config.remove_poem_script, "find"]);
    // // Pass data to confirmation modal
    // if (ret!=-1) {
    //     ret_array = ret.split('\n');
    //     let d_poems, d_collections, d_features, poem_id;
    //     [d_poems, d_collections, d_features] = (ret_array.slice(0,3)).map(x => x.slice(1,-1));
    //     poem_id = ret_array[3]
    //     poem_file = ret_array[4]
    //     // Remove poem with confirmed options
    //     ipcRenderer.sendSync('delete-poem-confirmation', [d_poems, d_collections, d_features, poem_id, poem_file])
    // } else {
    //     console.log('no poem was chosen to delete')
    // }
}


document.getElementById('select-collection_form').addEventListener('show.bs.collapse', () => {
    createDropdown('gather-all-collections', 'select-collection-dropdown', 'collection_name', 'collection_id');
});


document.getElementById('features_table_div').addEventListener('show.bs.collapse', () => {
    refreshFeaturesTable();
});


function refreshFeaturesTable() {
    ret = ipcRenderer.sendSync('gather-all-features');

    // Clear existing tbody for a full refresh
    let features_tbody = document.getElementById('features_table').tBodies[0];
    while (features_tbody.lastChild) {
        features_tbody.removeChild(features_tbody.lastChild);
    }

    for(let i = 0; i < ret.length; i++) {
        let poem_id = ret[i]['poem_id'];
        let poem_title = ret[i]['poem_title'];
        let featured_text = ret[i]['featured_text'];
        let currently_featured = ret[i]['currently_featured']

        let row = document.createElement("tr");

        let currently_featured_el = document.createElement("td");
        currently_featured_el.textContent = currently_featured ? '✔' : ''
        row.append(currently_featured_el);

        let poem_title_el = document.createElement("td");
        poem_title_el.textContent = poem_title;
        let delete_option = document.createElement("span");
        delete_option.classList.add("delete-option");
        delete_option.textContent = '(delete)';
        poem_title_el.append(delete_option);
        row.append(poem_title_el);

        let feature_text_el = document.createElement("td");
        feature_text_el.textContent = featured_text;
        row.append(feature_text_el);

        features_tbody.append(row);

        delete_option.addEventListener("click", () => {
            delete_feature(poem_id, featured_text);
        });
    }
}


function delete_feature(poem_id, featured_text) {
    ret = ipcRenderer.sendSync('delete-feature', [poem_id, featured_text]);
    if (ret==0) {
        refreshFeaturesTable();
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

    ret = ipcRenderer.sendSync('create-new-feature', [poem_id, poem_title, feature_text, set_current_feature]);

    if (ret!=-1) {
        new Notification('Created new feature successfully', { body : ret } );
        refreshFeaturesTable();
    } else {
        console.log('error creating new feature');
        new Notification('Error creating new feature');
    }
}
