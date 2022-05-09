const TypewriterSounds = () => {
  React.useEffect(() => {
    document.querySelectorAll('.form-control').forEach(item => {
      item.addEventListener('keydown', event => {
        switch (event.key) {
          case 'Meta':
          case 'Shift':
          case 'Control':
          case 'Alt':
          case 'CapsLock':
            break;

          case 'Tab':
          case 'Escape':
            document.getElementById('typewriter-bell').play();

          case ' ':
            document.getElementById('typewriter-space').play();

          case 'Enter':
            document.getElementById('typewriter-return').play();

          default:
            document.getElementById('typewriter-key').play();
        }
      });
    });
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("audio", {
    id: "typewriter-bell"
  }, /*#__PURE__*/React.createElement("source", {
    src: "audio/typewriter_bell.mp3"
  })), /*#__PURE__*/React.createElement("audio", {
    id: "typewriter-key"
  }, /*#__PURE__*/React.createElement("source", {
    src: "audio/typewriter_key.mp3"
  })), /*#__PURE__*/React.createElement("audio", {
    id: "typewriter-return"
  }, /*#__PURE__*/React.createElement("source", {
    src: "audio/typewriter_return.mp3"
  })), /*#__PURE__*/React.createElement("audio", {
    id: "typewriter-space"
  }, /*#__PURE__*/React.createElement("source", {
    src: "audio/typewriter_space.mp3"
  })));
};

ReactDOM.createRoot(document.getElementById('typewriter-sounds')).render( /*#__PURE__*/React.createElement(TypewriterSounds, null));