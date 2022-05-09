const { ipcRenderer } = require('electron')
var config = require('./config')


function createDropdown(function_call, dropdown_menu, option_text, option_value) {
    ret = ipcRenderer.sendSync(function_call);

    // Clear existing options for a full refresh
    let dropdown = document.getElementById(dropdown_menu);
    while (dropdown.lastChild) {
        dropdown.removeChild(dropdown.lastChild);
    }

    let placeholder_option = document.createElement("option");
    placeholder_option.selected = true;
    placeholder_option.text = "--";
    placeholder_option.value = "";
    dropdown.add(placeholder_option);

    for(let i = 0; i < ret.length; i++) {
        let opt = document.createElement("option");
        opt.text = ret[i][option_text];
        opt.value = ret[i][option_value];
        dropdown.add(opt);
    }

}


document.getElementById('new-poem-details_form').onsubmit = (event) => {
    event.preventDefault();
    console.log('clicked to create poem and/or details file!');
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
    } else {
        console.log('missing something to create a poem file')
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
    } else {
        console.log('missing something to create a poem details file')
    }

}


document.getElementById('new_collection_form').onsubmit = (event) => {
    event.preventDefault();
    console.log('create new collection!');
    let collection_id = document.getElementById('coll_collection_id').value;
    let collection_name = document.getElementById('coll_collection_name').value;
    let collection_summary = document.getElementById('coll_collection_summary').value;

    ret = ipcRenderer.sendSync('create-new-collection', [collection_id, collection_name, collection_summary])
    if (ret!=-1) {
        new Notification('Created new collection successfully', { body : ret } )
    }
}


document.getElementById('feature_form').onsubmit = (event) => {
    event.preventDefault();
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


document.getElementById('process-poem').onclick = () => {
    console.log('process poem!');
    ret = ipcRenderer.sendSync('open-file-dialog', [config.poems_folder, true, config.process_poem_script]);
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
    ret = ipcRenderer.sendSync('open-file-dialog', [config.details_folder, true, config.process_details_script]);
    if (ret==1) {
        new Notification('Details not processed', { body : 'No poem details file was chosen to process' } )
    } else if (ret==-1) {
        new Notification('Details not processed', { body : 'An error occurred' } )
    } else {
        new Notification('Details processed', { body : ret } )
    }
}


document.getElementById('delete-poem').onclick = () => {
    console.log('remove poem!');
    ret = ipcRenderer.sendSync('open-file-dialog', [config.poems_folder, false, 'delete-poem']);

    if (ret!=-1) {
        new Notification('Successfully deleted poem', { body : ret });
    } else {
        new Notification('Did not delete poem');
    }
}


document.getElementById('collections_table_div').addEventListener('show.bs.collapse', () => {
    refreshCollectionsTable();
});


function refreshCollectionsTable() {
    ret = ipcRenderer.sendSync('gather-all-collections');

    // Clear existing tbody for a full refresh
    let collections_tbody = document.getElementById('collections_table').tBodies[0];
    while (collections_tbody.lastChild) {
        collections_tbody.removeChild(collections_tbody.lastChild);
    }

    for(let i = 0; i < ret.length; i++) {
        let collection_id = ret[i]['collection_id'];
        let collection_name = ret[i]['collection_name'];
        let collection_summary = ret[i]['collection_summary'];
        let poem_ids = ret[i]['poem_ids'];
        let poem_titles = ret[i]['poem_titles'];

        let row = document.createElement("tr");

        let collection_name_el = document.createElement("td");
        collection_name_el.textContent = collection_name;
        row.append(collection_name_el);

        let collection_summary_el = document.createElement("td");
        collection_summary_el.textContent = collection_summary;
        row.append(collection_summary_el);

        let poems_el = document.createElement("td");

        let edit_poems_option = document.createElement("span");
        edit_poems_option.classList.add("small-option");
        edit_poems_option.textContent = '(edit)';
        poems_el.append(edit_poems_option);

        let poems_list = document.createElement("ul");
        poems_list.classList.add("collection-poems");
        if (poem_titles) {
            for(let j = 0; j < poem_titles.length; j++) {
                let poem = document.createElement("li");
                poem.textContent = poem_titles[j];
                poems_list.append(poem);
            }
        }

        poems_el.append(poems_list);

        row.append(poems_el);

        collections_tbody.append(row);
    }
}


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
        let currently_featured = ret[i]['currently_featured'];

        let row = document.createElement("tr");

        let currently_featured_el = document.createElement("td");
        currently_featured_el.textContent = currently_featured ? '✔' : ''
        let set_unset_feat_option = document.createElement("span");
        set_unset_feat_option.classList.add("small-option");
        set_unset_feat_option.textContent = currently_featured ? '(unset)' : '(set)';
        currently_featured_el.append(set_unset_feat_option);
        row.append(currently_featured_el);

        let poem_title_el = document.createElement("td");
        poem_title_el.textContent = poem_title;
        let delete_option = document.createElement("span");
        delete_option.classList.add("small-option");
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

        set_unset_feat_option.addEventListener("click", () => {
            edit_current_feature(poem_id, featured_text, currently_featured);
        });
    }
}


function delete_feature(poem_id, featured_text) {
    ret = ipcRenderer.sendSync('delete-feature', [poem_id, featured_text]);
    if (ret==0) {
        refreshFeaturesTable();
    }
}


function edit_current_feature(poem_id, featured_text, currently_featured) {
    ret = ipcRenderer.sendSync('edit-current-feature', [poem_id, featured_text, currently_featured]);
    console.log(ret);
    if (ret==0) {
        refreshFeaturesTable();
    }
}


document.getElementById('new_feature').addEventListener('show.bs.collapse', () => {
    createDropdown('gather-all-poems', 'feat_select-poem-dropdown', 'poem_id', 'poem_title');
});
