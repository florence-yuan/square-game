export default function TogglePref({setPlaying}) {
    return (
        <div className="pref-item">
            <a
                href="#"
                onClick={() => {
                    document.body.classList.toggle("pref-mode");
                    setPlaying(false);
                }}
            >
                Change preferences
            </a>
            <br />
            <span className="pref-info">(This will restart game)</span>
        </div>
    );
}