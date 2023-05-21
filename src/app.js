import PoemDetailsTab from './poem-details-tab.js';
import CollectionTab from './collection-tab.js';
import FeatureTab from './feature-tab.js';

const App = () => {
    const [ poemsList, setPoemsList ] = React.useState([]);
    const [ refreshPoemsList, setRefreshPoemsList ] = React.useState(false);

    React.useEffect(() => {
        const res = window.electron.gatherPoems();
        setPoemsList(res);
    }, [refreshPoemsList]);

    const toggleTheme = () => {
        window.electron.toggleTheme();
    }

    return (
        <>
        <div className="container py-3">
            <h1 className="my-4" id="title">Emily Writes Poems Processing</h1>
            <ul className="nav nav-pills">
                <li className="nav-item">
                    <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#poem-details-tab" type="button" role="tab">Poem & Details</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#collection-tab" type="button" role="tab">Collection</button>
                </li>
                <li className="nav-item">
                    <button className="nav-link" data-bs-toggle="tab" data-bs-target="#feature-tab" type="button" role="tab">Feature</button>
                </li>
                <li className="nav-item">
                    <button id="toggle-theme" className="nav-link" type="button" role="tab" onClick={toggleTheme}>Day/Night <span className= "material-icons">brightness_4</span></button>
                </li>
            </ul>
            <div className="tab-content">
                <div className="tab-pane fade show active" id="poem-details-tab"><PoemDetailsTab poems={poemsList} refreshPoemsList={() => setRefreshPoemsList(!refreshPoemsList)}/></div>
                <div className="tab-pane fade" id="collection-tab"><CollectionTab /></div>
                <div className="tab-pane fade" id="feature-tab"><FeatureTab poems={poemsList}/></div>
            </div>
        </div>
        </>
    )
}

(ReactDOM.createRoot(document.getElementById('app')).render(<App />));
