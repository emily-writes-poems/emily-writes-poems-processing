const FeatureTab = ({poems}) => {
    const [ features, setFeatures ] = React.useState([]);
    const [ refreshFeatures, setRefreshFeatures ] = React.useState(false);

    React.useEffect(() => {
        const res = window.electron.gatherFeatures();
        setFeatures(res);
    }, [refreshFeatures]);

    const createNewFeature = (event) => {
        event.preventDefault();
        console.log('clicked to create a new feature!');
        let selected_poem = document.getElementById('feat_select-poem-dropdown');
        let poem_id = selected_poem.options[selected_poem.selectedIndex].text;
        let poem_title = selected_poem.options[selected_poem.selectedIndex].value;
        let featured_text = document.getElementById('feat_feature_text').value;
        let set_current_feature = document.getElementById('feat_set_current_feature').checked;

        let ret = window.features.createNewFeature(poem_id, poem_title, featured_text, set_current_feature);
        window.electron.sendCreateNotification(ret, "feature");
        setRefreshFeatures(!refreshFeatures);
    }

    const editCurrentFeature = (poem_id, featured_text, currently_featured) => {
        event.preventDefault();
        console.log('clicked to set or unset current feature!');
        let ret = window.features.editCurrentFeature(poem_id, featured_text, currently_featured);
        window.electron.sendEditFeatureNotification(ret, poem_id);
        setRefreshFeatures(!refreshFeatures);
    }

    const deleteFeature = (poem_id, featured_text) => {
        event.preventDefault();
        console.log('clicked to delete feature!');
        let ret = window.features.deleteFeature(poem_id, featured_text);
        window.electron.sendDeleteNotification(ret, "feature");
        setRefreshFeatures(!refreshFeatures);
    }

    return (
        <>
        <div id="feature" className="text-center">
            <button className="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#features_table_div">Display all features <span className="material-icons">menu_open</span></button>
            <button className="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#new_feature">Create a poem feature <span className="material-icons">add_circle</span></button>

            <div id="features_table_div" className="collapse" data-bs-parent="#feature">
                <table id="features_table" className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th><span className="material-icons">star</span></th>
                            <th>Poem Title</th>
                            <th>Feature Text</th>
                        </tr>
                    </thead>
                    <tbody>
                        {features.map((feat, index) =>
                            <tr key={index}>
                                <td>
                                    {feat.currently_featured ? '✔' : ''}
                                    <span className="small-option" onClick={() => editCurrentFeature(feat.poem_id, feat.featured_text, feat.currently_featured)}>{feat.currently_featured ? '(unset)' : '(set)'}</span>
                                </td>
                                <td>
                                    {feat.poem_title}
                                    <br/>
                                    <span className="small-option" onClick={() => deleteFeature(feat.poem_id, feat.featured_text)}>(delete)</span>
                                </td>
                                <td>{feat.featured_text}</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <div id="new_feature" className="collapse" data-bs-parent="#feature">
                <h5>New feature</h5>
                <form id="feature_form" onSubmit={createNewFeature}>
                    <div className="row">
                        <div className="col">
                            <div className="form-field">
                                <select className="form-select" id="feat_select-poem-dropdown" defaultValue={""}>
                                    <option value="" disabled>Select a poem</option>
                                    {poems.map((poem, index) =>
                                        <option key={index} value={poem.poem_id}>
                                            {poem.poem_title}
                                        </option>
                                    )}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col">
                            <div className="form-floating form-field">
                                <textarea id="feat_feature_text" style={{height: "100px"}} className="form-control" placeholder="Feature Text" required></textarea>
                                <label htmlFor="feat_feature_text">Feature Text</label>
                            </div>
                        </div>
                    </div>

                    <div className="form-check form-check-inline">
                        <input className="form-check-input" type="checkbox" id="feat_set_current_feature" />
                        <label className="form-check-label" htmlFor="feat_set_current_feature">Set as current feature</label>
                    </div>
                    <div className="col">
                        <input type="reset" className="btn btn-outline-primary" />
                        <button id="create-feature" type="submit" className="btn btn-outline-primary">Submit</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    );
}

export default FeatureTab;
