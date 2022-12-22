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

    return (
        <>
        <button className="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#collections_table_div">Display all collections ({collections.length}) <span className="material-icons">menu_open</span></button>

        <div id="collections_table_div" className="collapse">
            <table id="collections_table" className="table table-sm table-bordered text-center">
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
                                <span className="small-option" onClick={() => processWordcloud(coll.collection_id)}>(process)</span>
                                {coll.wordcloud &&
                                    coll.wordcloud.map((i, idx) => <p key={idx} className="list-spacing">- {i.text} : {i.value}</p>)
                                }
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>

        <button className="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#new_collection">Create a new poem collection <span className="material-icons">note_add</span></button>
        <div id="new_collection" className="collapse">
            <h5>New collection</h5>
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
        </>
    );
}

export default CollectionTab;
