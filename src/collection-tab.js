const CollectionTab = () => {
    const [ collections, setCollections ] = React.useState([]);

    React.useEffect(() => {
        const res = window.electron.gatherCollections();
        setCollections(res);
    }, []);

    return (
        <>
        <button className="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#collections_table_div">Display all collections ({collections.length}) <span className="material-icons">menu_open</span></button>

        <div id="collections_table_div" className="collapse">
            <table id="collections_table" className="table table-sm table-bordered text-center">
                <thead>
                    <tr>
                        <th className="col-2">Collection Name</th>
                        <th>Collection Summary</th>
                        <th className="col-6">Poems</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>

        <button className="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#new_collection">Create a new poem collection <span className="material-icons">add_circle</span></button>
        <div id="new_collection" className="collapse">
            <h5>New collection</h5>
            {/*<form id="new_collection_form">
                <div className="row">
                    <div className="col">
                        <div className="form-floating form-field">
                            <input id="coll_collection_id" type="text" className="form-control" placeholder="Collection ID" required/>
                            <label for="coll_collection_id">Collection ID</label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-floating form-field">
                            <input id="coll_collection_name" type="text" className="form-control" placeholder="Collection Name" required/>
                            <label for="coll_collection_name">Collection Name</label>
                        </div>
                    </div>
                </div>
                <div className="form-floating form-field">
                    <textarea id="coll_collection_summary" style="height: 100px" className="form-control" placeholder="Collection Summary"></textarea>
                    <label for="coll_collection_summary">Collection Summary</label>
                </div>
                <input type="reset" className="btn btn-outline-primary">
                <button id="create-collection" type="submit" className="btn btn-outline-primary">Submit</button>
            </form>*/}
        </div>
        </>
    );
}

export default CollectionTab;
