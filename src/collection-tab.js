const CollectionTab = () => {
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

    const processWordcloud = (collection_id) => {
        event.preventDefault();
        console.log('clicked to process wordcloud!');
        let ret = window.collections.processWordcloud(collection_id);
        window.electron.sendProcessNotification(ret, "collection");
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
                            <th className="col-4">Poems</th>
                            <th className="col-2">Wordcloud</th>
                        </tr>
                    </thead>
                    <tbody>
                        {collections.map((coll, index) =>
                            <tr key={index}>
                                <td className="align-middle">{coll.collection_name}</td>
                                <td className="align-middle">{coll.collection_summary}</td>
                                <td className="align-middle">
                                    {coll.poem_titles &&
                                        coll.poem_titles.map((poem, index) => <p key={index} className="list-spacing">- {poem}</p>)
                                    }
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
            </div>
        </div>
        </>
    );
}

export default CollectionTab;
