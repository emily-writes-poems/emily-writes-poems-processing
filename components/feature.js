const FeatureTab = () => {
  const [features, setFeatures] = React.useState([]);
  React.useEffect(() => {
    const res = window.electron.gatherData('gather-all-features');
    setFeatures(res);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("h4", null, "Feature"));
};

export default FeatureTab;