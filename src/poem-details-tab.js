const PoemDetailsTab = ({poems, refreshPoemsList}) => {

    const openFile = (type, poem) => {
        window.poem_details.openFile(type, poem);
    }

    const createPoemDetails = (event) => {
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
            let ret = window.poem_details.createNewPoem(poem_id, poem_title, poem_date, poem_lines);
            window.electron.sendCreateNotification(ret, "poem file");
        } else {
            console.log('missing something to create a poem file')
        }

        if (poem_id && poem_title && (poem_behind_title || poem_behind_poem) && poem_lines) {
            console.log('create details file!');
            let ret = window.poem_details.createNewDetails(poem_id, poem_title, poem_behind_title, poem_behind_poem, poem_lines);
            window.electron.sendCreateNotification(ret, "details file");
        } else {
            console.log('missing something to create a poem details file')
        }
    }

    const processPoem = () => {
        console.log('process poem!');
        let ret = window.poem_details.processPoem();
        window.electron.sendProcessNotification(ret, "poem");
        refreshPoemsList();
    }

    const deletePoem = () => {
        console.log('delete poem!');
        let ret = window.poem_details.deletePoem();
        window.electron.sendDeleteNotification(ret, "poem");
        refreshPoemsList();
    }

    const processDetails = () => {
        console.log('process details!');
        let ret = window.poem_details.processDetails();
        window.electron.sendProcessNotification(ret, "details");
    }

    const linkPoems = (poem1_id, poem1_title) => {
        let poem_dropdown = document.getElementById("link-to-poem-dropdown-" + poem1_id);
        let poem2_id = poem_dropdown.options[poem_dropdown.selectedIndex].value;

        if (poem2_id) {
            console.log(poem1_id, poem2_id);
            let poem2_title = poem_dropdown.options[poem_dropdown.selectedIndex].text;
            let ret = window.poem_details.linkPoems(poem1_id, poem1_title, poem2_id, poem2_title);
            window.poem_details.sendPoemsLinkedNotification(ret);
            refreshPoemsList();
        } else {
            console.log("select a poem to link");
        }
    }

    const deleteLinkedPoem = (poem1_id, poem1_title, poem2_id, poem2_title) => {
        console.log(poem1_id, poem2_id);
        let ret = window.poem_details.deleteLinkedPoem(poem1_id, poem1_title, poem2_id, poem2_title);
        window.poem_details.sendPoemsLinkedNotification(ret);
        refreshPoemsList();
    }

    return (
        <>
        <div id="poem-details" className="text-center">
            <div className="button-options">
                <button className="btn btn-outline-primary" data-bs-toggle="collapse" data-bs-target="#new-poem-details">Create a new poem and/or details file <span className="material-icons">note_add</span></button>
                <br />
                <button id="process-poem" className="btn btn-outline-primary" onClick={processPoem}>Process a poem file <span className="material-icons">file_open</span></button>
                <button id="delete-poem" className="btn btn-outline-primary" onClick={deletePoem}>Remove a poem <span className="material-icons">file_open</span></button>
                <button id="process-details" className="btn btn-outline-primary" onClick={processDetails}>Process a poem details file <span className="material-icons">file_open</span></button>
            </div>

            <div id="new-poem-details" className="collapse">
                <h4>New poem and/or details file</h4>
                <form id="new-poem-details_form" onSubmit={createPoemDetails}>
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

            <div id="poems-table">
                <h4>Poems ({poems.length})</h4>
                <table id="poems_table" className="table table-sm table-bordered">
                    <thead>
                        <tr>
                            <th>Poem ID</th>
                            <th>Poem Title</th>
                            <th><i>Tools</i></th>
                        </tr>
                    </thead>
                    <tbody>
                        {poems.map((poem, index) =>
                            <tr key={index}>
                                <td>
                                    {poem.poem_id}
                                </td>
                                <td>{poem.poem_title}</td>
                                <td>
                                    <div className="small-option" onClick={() => openFile("poem", poem.poem_id)}>(open poem file)</div>
                                    <div className="small-option" onClick={() => openFile("details", poem.poem_id)}>(open details file)</div>
                                    <div className="small-option" data-bs-toggle="modal" data-bs-target={"#link-poems-" + poem.poem_id}>(link poems)</div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {poems.map((poem, index) =>
                    <div key={index} className="modal fade" id={"link-poems-" + poem.poem_id} tab-index="-1" data-bs-backdrop="static">
                        <div className="modal-dialog modal-dialog-centered">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h6 className="modal-title">LINK POEM > {poem.poem_title}</h6>
                                    <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                                </div>
                                <div className="modal-body modal-section">
                                    { poem.linked_poems_ids &&
                                        <div id="linked-poems-list">
                                            <h6>Currently linked poems</h6>
                                            {poem.linked_poems_titles.map((linked_poem_title, index) =>
                                                <p key={index} className="list-spacing">{linked_poem_title} <span className="small-option same-line" onClick={() => deleteLinkedPoem(poem.poem_id, poem.poem_title, poem.linked_poems_ids[index], linked_poem_title)}>(delete link)</span></p>
                                            )}
                                        </div>
                                    }
                                    <div className="poem-dropdown">
                                        <h6>Select a poem</h6>
                                        <select className="form-select" id={"link-to-poem-dropdown-" + poem.poem_id} defaultValue={""}>
                                            <option value="" disabled>Select a poem</option>
                                            {poems.map((poem, index) =>
                                                <option key={index} value={poem.poem_id}>
                                                    {poem.poem_title}
                                                </option>
                                            )}
                                        </select>
                                        <button id={"link-poems-submit-" + poem.poem_id + index} className="btn btn-outline-primary modal-button" onClick={()=> linkPoems(poem.poem_id, poem.poem_title)}>Link poems</button>
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

export default PoemDetailsTab;
