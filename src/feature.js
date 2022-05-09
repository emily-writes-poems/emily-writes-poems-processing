const FeatureTab = () => {
    const [ features, setFeatures ] = React.useState([]);

    React.useEffect(() => {
        const res = window.electron.gatherData('gather-all-features');
        setFeatures(res);
    }, []);

    return (
        <React.Fragment>
        <h4>Feature</h4>

        {/*<button class="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#new_feature">Create a poem feature <span class="material-icons">add_circle</span></button>
        <div id="new_feature" class="collapse">
            <h5>New feature</h5>
            <form id="feature_form">
                <div class="row">
                    <div class="col">
                        <select class="form-select" id="feat_select-poem-dropdown"></select>
                    </div>
                </div>
                <div class="form-floating form-field">
                    <textarea id="feat_feature_text" style="height: 100px" class="form-control" placeholder="Feature Text" required></textarea>
                    <label for="feat_feature_text">Feature Text</label>
                </div>
                <div class="form-field form-check">
                    <input class="form-check-input" type="checkbox" id="feat_set_current_feature">
                    <label class="form-check-label" for="feat_set_current_feature">Set as current feature</label>
                </div>
                <input type="reset" class="btn btn-outline-primary">
                <button id="create-feature" type="submit" class="btn btn-outline-primary">Submit</button>
            </form>
        </div>
        <button class="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#features_table_div">Display all features <span class="material-icons">menu_open</span></button>
        <div id="features_table_div" class="collapse">
            <table id="features_table" class="table table-sm table-bordered text-center">
                <thead>
                    <tr>
                        <th><span class="material-icons">star</span></th>
                        <th>Poem Title</th>
                        <th>Feature Text</th>
                    </tr>
                </thead>
                <tbody></tbody>
            </table>
        </div>
        */}

        </React.Fragment>
    );
}

export default FeatureTab;
