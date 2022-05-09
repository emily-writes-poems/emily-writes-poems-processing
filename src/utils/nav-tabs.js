import PoemDetailsTab from '../poem-details-tab.js';
import CollectionTab from '../collection-tab.js';


const NavTabs = () => {
    return (
        <>
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button className="nav-link active" data-bs-toggle="tab" data-bs-target="#poem-details-tab" type="button" role="tab">Poem & Details</button>
          </li>
          <li className="nav-item">
            <button className="nav-link" data-bs-toggle="tab" data-bs-target="#collection-tab" type="button" role="tab">Collection</button>
          </li>
        </ul>
        <div className="tab-content">
          <div className="tab-pane fade show active" id="poem-details-tab"><PoemDetailsTab /></div>
          <div className="tab-pane fade" id="collection-tab"><CollectionTab /></div>
        </div>
        </>
    )
}

(ReactDOM.createRoot(document.getElementById('nav-tabs')).render(<NavTabs />));
