const CollectionTab = ({poems}) => {
    const [ collections, setCollections ] = React.useState([]);
    const [ refreshCollections, setRefreshCollections ] = React.useState(false);

    React.useEffect(() => {
        const res = window.electron.gatherCollections();
        setCollections(res);
    }, [refreshCollections]);

    const createNewCollection = (event) => {
        event.preventDefault();
        console.log('clicked to create a new collection!');
        let collection_id = document.getElementById('coll_collection_id').value;
        let collection_name = document.getElementById('coll_collection_name').value;
        let collection_summary = document.getElementById('coll_collection_summary').value;

        let ret = window.collections.createNewCollection(collection_id, collection_name, collection_summary);
        window.electron.sendCreateNotification(ret, "collection");
        setRefreshCollections(!refreshCollections);
    }

    const deleteCollection = (collection_id, collection_name) => {
        event.preventDefault();
        console.log('clicked to delete collection!');
        let ret = window.collections.deleteCollection(collection_id, collection_name);
        window.electron.sendDeleteNotification(ret, "collection");
        setRefreshCollections(!refreshCollections);
    }

    const editCollectionPoems = (action, collection_id, poem_id, poem_title) => {
        let ret = window.collections.editCollectionPoems(action, collection_id, poem_id, poem_title);
        window.collections.sendCollectionPoemsNotification(ret);
        setRefreshCollections(!refreshCollections);
    }

    const addCollectionPoem = (collection_id) => {
        let poem_dropdown = document.getElementById("add-collection-poem-dropdown-" + collection_id);
        let poem_id = poem_dropdown.options[poem_dropdown.selectedIndex].value;
        let poem_title = poem_dropdown.options[poem_dropdown.selectedIndex].text;
        editCollectionPoems("add", collection_id, poem_id, poem_title);
    }

    const processWordcloud = (collection_id) => {
        event.preventDefault();
        console.log('clicked to process wordcloud!');
        let ret = window.collections.processWordcloud(collection_id);
        window.electron.sendProcessNotification(ret, "wordcloud for collection: " + collection_id);
        setRefreshCollections(!refreshCollections);
    }

    const deleteWordcloud = (collection_id) => {
        event.preventDefault();
        console.log('clicked to delete wordcloud!');
        let ret = window.collections.deleteWordcloud(collection_id);
        window.electron.sendDeleteNotification(ret, "wordcloud for collection: " + collection_id);
        setRefreshCollections(!refreshCollections);
    }

    return (
        <>
        <div id="collection" className="text-center">
            <div className="button-options">
                <button className="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#new_collection">Create a new poem collection <span className="material-icons">note_add</span></button>
            </div>

            <div id="new_collection" className="collapse" data-bs-parent="#collection">
                <h4>New collection</h4>
                <form id="new_collection_form" onSubmit={createNewCollection}>
                    <div className="row">
                        <div className="col">
                            <div className="form-floating form-field">
                                <input id="coll_collection_id" type="text" className="form-control" placeholder="Collection ID" required />
                                <label htmlFor="coll_collection_id">Collection ID</label>
                            </div>
                        </div>
                        <div className="col">
                            <div className="form-floating form-field">
                                <input id="coll_collection_name" type="text" className="form-control" placeholder="Collection Name" required />
                                <label htmlFor="coll_collection_name">Collection Name</label>
                            </div>
                        </div>
                    </div>
                    <div className="form-floating form-field">
                        <textarea id="coll_collection_summary" style={{height: "100px"}} className="form-control" placeholder="Collection Summary"></textarea>
                        <label htmlFor="coll_collection_summary">Collection Summary</label>
                    </div>
                    <input type="reset" className="btn btn-outline-primary" />
                    <button id="create-collection" type="submit" className="btn btn-outline-primary">Submit</button>
                </form>
            </div>

            <div id="collections_table_div">
                <h4>Collections ({collections.length})</h4>
                <table id="collections_table" className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th className="col-2">Collection Name</th>
                            <th>Collection Summary</th>
                            <th className="col-2">Poems</th>
                            <th className="col-2">Wordcloud</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collections.map((coll, index) =>
                            <tr key={index}>
                                <td className="align-middle">
                                    {coll.collection_name}
                                    <br/>
                                    <span className="small-option" onClick={() => deleteCollection(coll.collection_id, coll.collection_name)}>(delete)</span>
                                </td>
                                <td className="align-middle">{coll.collection_summary}</td>
                                <td className="align-middle">
                                    <div className="small-option" data-bs-toggle="modal" data-bs-target={"#coll-poems-" + coll.collection_id}>(edit poems)</div>
                                </td>
                                <td className="align-middle">
                                    <div className="small-option" onClick={() => processWordcloud(coll.collection_id)}>(process)</div>
                                    {coll.wordcloud && coll.wordcloud.length != 0 &&
                                        <>
                                        &nbsp;<div className="small-option" onClick={() => deleteWordcloud(coll.collection_id)}>(delete)</div>
                                        {coll.wordcloud.map((i, idx) => <p key={idx} className="list-spacing">- {i.text} : {i.value}</p>)}
                                        </>
                                    }
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {collections.map((coll, index) =>
                    <div key={index} className="modal fade" id={"coll-poems-" + coll.collection_id} tab-index="-1" data-bs-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h6 className="modal-title">COLLECTION POEMS > {coll.collection_name}</h6>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div className="modal-body modal-section">
                                    { coll.poem_ids &&
                                        <div id="coll-poems-list">
                                            <h6>Poems in collection</h6>
                                            {coll.poem_titles.map((coll_poem_title, index) =>
                                                <p key={index} className="list-spacing">{coll_poem_title} <span className="small-option same-line" onClick={() => editCollectionPoems("delete", coll.collection_id, coll.poem_ids[index], coll_poem_title)}>(delete)</span></p>
                                            )}
                                        </div>
                                    }
                                    <div className="poem-dropdown">
                                        <h6>Select a poem</h6>
                                        <select className="form-select" id={"add-collection-poem-dropdown-" + coll.collection_id} defaultValue={""}>
                                            <option value="" disabled>Select a poem</option>
                                            {poems.map((poem, index) =>
                                                <option key={index} value={poem.poem_id}>
                                                    {poem.poem_title}
                                                </option>
                                            )}
                                        </select>
                                        <button id={"add-collection-poem-submit-" + coll.collection_id + index} className="btn btn-outline-primary modal-button" onClick={()=> addCollectionPoem(coll.collection_id)}>Add poem to collection</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
        </>
    );
}

export default CollectionTab;
