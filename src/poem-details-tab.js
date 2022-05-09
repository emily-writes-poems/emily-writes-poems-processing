const PoemDetailsTab = () => {
    const [ poems, setPoems ] = React.useState([]);

    React.useEffect(() => {
        const res = window.electron.gatherData('gather-all-poems');
        setPoems(res);
    }, []);

    return (
        <>
        <h4>Poem & Details</h4>

        <div>
            <button className="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#poems_table_div">Display all poems ({poems.length}) <span className="material-icons">menu_open</span></button>

            <div id="poems_table_div" className="collapse">
                <table id="poems_table" className="table table-sm table-bordered text-center">
                    <thead>
                        <tr>
                            <th>Poem ID</th>
                            <th>Poem Title</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>

        </div>

        <div>
        <button className="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#new-poem-details">Create a new poem and/or details file <span className="material-icons">note_add</span></button>
        <div id="new-poem-details" className="collapse">
            <h5>New poem and/or details file</h5>
            <form id="new-poem-details_form">
                <div className="row">
                    <div className="col">
                        <div className="form-floating form-field">
                            <input id="poem-details_poem_id" type="text" className="form-control" placeholder="Poem ID" required />
                            <label htmlFor="poem-details_poem_id">Poem ID</label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-floating form-field">
                            <input id="poem-details_poem_title" type="text" className="form-control" placeholder="Poem Title" required />
                            <label htmlFor="poem-details_poem_title">Poem Title</label>
                        </div>
                    </div>
                    <div className="col">
                        <div className="form-floating form-field">
                            <input id="poem_poem_date" type="text" className="form-control" placeholder="Poem Date" />
                            <label htmlFor="poem_poem_date">Poem Date</label>
                        </div>
                    </div>
                </div>
                <div className="form-floating form-field">
                    <textarea id="poem-details_poem_lines" style={{height: "200px"}} className="form-control" placeholder="Poem Lines" required></textarea>
                    <label htmlFor="poem-details_poem_lines">Poem Lines</label>
                </div>
                <div className="form-floating form-field">
                    <textarea id="details_behind_title" style={{height: "100px"}} className="form-control" placeholder="Behind the Title"></textarea>
                    <label htmlFor="details_behind_title">Behind the Title</label>
                </div>
                <div className="form-floating form-field">
                    <textarea id="details_behind_poem" style={{height: "100px"}} className="form-control" placeholder="Behind the Poem"></textarea>
                    <label htmlFor="details_behind_poem">Behind the Poem</label>
                </div>
                <input type="reset" className="btn btn-outline-primary" />
                <button id="create-poem-details" type="submit" className="btn btn-outline-primary">Submit</button>
            </form>
        </div>
        </div>

        <div>
        <button id="process-poem" className="btn btn-outline-primary">Process a poem file <span className="material-icons">file_open</span></button>

        <button id="delete-poem" className="btn btn-outline-primary">Remove a poem <span className="material-icons">file_open</span></button>
        </div>

        <div>
        <button id="process-details" className="btn btn-outline-primary">Process a poem details file <span className="material-icons">file_open</span></button>
        </div>


        {/* // Clear existing options for a full refresh
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
        */}
        </>
    );
}

export default PoemDetailsTab;
