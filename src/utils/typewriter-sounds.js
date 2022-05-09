const TypewriterSounds = () => {
    React.useEffect(() => {
        document.querySelectorAll('.form-control').forEach((item) => {
            item.addEventListener('keydown', (event) => {
                switch(event.key) {
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

    return (
        <React.Fragment>
            <audio id="typewriter-bell">
                <source src="audio/typewriter_bell.mp3" />
            </audio>
            <audio id="typewriter-key">
                <source src="audio/typewriter_key.mp3" />
            </audio>
            <audio id="typewriter-return">
                <source src="audio/typewriter_return.mp3" />
            </audio>
            <audio id="typewriter-space">
                <source src="audio/typewriter_space.mp3" />
            </audio>
        </React.Fragment>
    )
}

(ReactDOM.createRoot(document.getElementById('typewriter-sounds')).render(<TypewriterSounds />));
