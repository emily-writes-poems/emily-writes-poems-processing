const CollectionTab = () => {
  const [collections, setCollections] = React.useState([]);
  React.useEffect(() => {
    const res = window.electron.gatherData('gather-all-collections');
    setCollections(res);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, "Collection"), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#collections_table_div"
  }, "Display all collections (", collections.length, ") ", /*#__PURE__*/React.createElement("span", {
    className: "material-icons"
  }, "menu_open")), /*#__PURE__*/React.createElement("div", {
    id: "collections_table_div",
    className: "collapse"
  }, /*#__PURE__*/React.createElement("table", {
    id: "collections_table",
    className: "table table-sm table-bordered text-center"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    className: "col-2"
  }, "Collection Name"), /*#__PURE__*/React.createElement("th", null, "Collection Summary"), /*#__PURE__*/React.createElement("th", {
    className: "col-6"
  }, "Poems"))), /*#__PURE__*/React.createElement("tbody", null))), /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#new_collection"
  }, "Create a new poem collection ", /*#__PURE__*/React.createElement("span", {
    className: "material-icons"
  }, "add_circle")));
};

export default CollectionTab;