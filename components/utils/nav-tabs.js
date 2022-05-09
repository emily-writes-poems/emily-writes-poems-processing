import PoemDetailsTab from '../poem-details-tab.js';
import CollectionTab from '../collection-tab.js';

const NavTabs = () => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("ul", {
    className: "nav nav-tabs"
  }, /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nav-link active",
    "data-bs-toggle": "tab",
    "data-bs-target": "#poem-details-tab",
    type: "button",
    role: "tab"
  }, "Poem & Details")), /*#__PURE__*/React.createElement("li", {
    className: "nav-item"
  }, /*#__PURE__*/React.createElement("button", {
    className: "nav-link",
    "data-bs-toggle": "tab",
    "data-bs-target": "#collection-tab",
    type: "button",
    role: "tab"
  }, "Collection"))), /*#__PURE__*/React.createElement("div", {
    className: "tab-content"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tab-pane fade show active",
    id: "poem-details-tab"
  }, /*#__PURE__*/React.createElement(PoemDetailsTab, null)), /*#__PURE__*/React.createElement("div", {
    className: "tab-pane fade",
    id: "collection-tab"
  }, /*#__PURE__*/React.createElement(CollectionTab, null))));
};

ReactDOM.createRoot(document.getElementById('nav-tabs')).render( /*#__PURE__*/React.createElement(NavTabs, null));