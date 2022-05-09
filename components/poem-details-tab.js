const PoemDetailsTab = () => {
  const [poems, setPoems] = React.useState([]);
  React.useEffect(() => {
    const res = window.electron.gatherData('gather-all-poems');
    setPoems(res);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, "Poem & Details"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#poems_table_div"
  }, "Display all poems (", poems.length, ") ", /*#__PURE__*/React.createElement("span", {
    className: "material-icons"
  }, "menu_open")), /*#__PURE__*/React.createElement("div", {
    id: "poems_table_div",
    className: "collapse"
  }, /*#__PURE__*/React.createElement("table", {
    id: "poems_table",
    className: "table table-sm table-bordered text-center"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Poem ID"), /*#__PURE__*/React.createElement("th", null, "Poem Title"), /*#__PURE__*/React.createElement("th", null, "Date"))), /*#__PURE__*/React.createElement("tbody", null)))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    className: "btn btn-outline-primary",
    "data-bs-toggle": "collapse",
    "data-bs-target": "#new-poem-details"
  }, "Create a new poem and/or details file ", /*#__PURE__*/React.createElement("span", {
    className: "material-icons"
  }, "note_add")), /*#__PURE__*/React.createElement("div", {
    id: "new-poem-details",
    className: "collapse"
  }, /*#__PURE__*/React.createElement("h5", null, "New poem and/or details file"), /*#__PURE__*/React.createElement("form", {
    id: "new-poem-details_form"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-floating form-field"
  }, /*#__PURE__*/React.createElement("input", {
    id: "poem-details_poem_id",
    type: "text",
    className: "form-control",
    placeholder: "Poem ID",
    required: true
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "poem-details_poem_id"
  }, "Poem ID"))), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-floating form-field"
  }, /*#__PURE__*/React.createElement("input", {
    id: "poem-details_poem_title",
    type: "text",
    className: "form-control",
    placeholder: "Poem Title",
    required: true
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "poem-details_poem_title"
  }, "Poem Title"))), /*#__PURE__*/React.createElement("div", {
    className: "col"
  }, /*#__PURE__*/React.createElement("div", {
    className: "form-floating form-field"
  }, /*#__PURE__*/React.createElement("input", {
    id: "poem_poem_date",
    type: "text",
    className: "form-control",
    placeholder: "Poem Date"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "poem_poem_date"
  }, "Poem Date")))), /*#__PURE__*/React.createElement("div", {
    className: "form-floating form-field"
  }, /*#__PURE__*/React.createElement("textarea", {
    id: "poem-details_poem_lines",
    style: {
      height: "200px"
    },
    className: "form-control",
    placeholder: "Poem Lines",
    required: true
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "poem-details_poem_lines"
  }, "Poem Lines")), /*#__PURE__*/React.createElement("div", {
    className: "form-floating form-field"
  }, /*#__PURE__*/React.createElement("textarea", {
    id: "details_behind_title",
    style: {
      height: "100px"
    },
    className: "form-control",
    placeholder: "Behind the Title"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "details_behind_title"
  }, "Behind the Title")), /*#__PURE__*/React.createElement("div", {
    className: "form-floating form-field"
  }, /*#__PURE__*/React.createElement("textarea", {
    id: "details_behind_poem",
    style: {
      height: "100px"
    },
    className: "form-control",
    placeholder: "Behind the Poem"
  }), /*#__PURE__*/React.createElement("label", {
    htmlFor: "details_behind_poem"
  }, "Behind the Poem")), /*#__PURE__*/React.createElement("input", {
    type: "reset",
    className: "btn btn-outline-primary"
  }), /*#__PURE__*/React.createElement("button", {
    id: "create-poem-details",
    type: "submit",
    className: "btn btn-outline-primary"
  }, "Submit")))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    id: "process-poem",
    className: "btn btn-outline-primary"
  }, "Process a poem file ", /*#__PURE__*/React.createElement("span", {
    className: "material-icons"
  }, "file_open")), /*#__PURE__*/React.createElement("button", {
    id: "delete-poem",
    className: "btn btn-outline-primary"
  }, "Remove a poem ", /*#__PURE__*/React.createElement("span", {
    className: "material-icons"
  }, "file_open"))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("button", {
    id: "process-details",
    className: "btn btn-outline-primary"
  }, "Process a poem details file ", /*#__PURE__*/React.createElement("span", {
    className: "material-icons"
  }, "file_open"))));
};

export default PoemDetailsTab;