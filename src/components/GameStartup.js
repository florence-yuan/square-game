export default function GameStartup({setPlaying}) {
    return (
        <div className="start-flex">
            {/* <div
                className="start-shape"
                onClick={() => {
                    document.body.classList.add("game-mode");
                    setPlaying(true);
                }}
            >
                <button className="start-btn">start game</button>
            </div> */}
            <svg
                width="300"
                height="300"
                viewBox="0 0 100 100"
                className="circle"
                onClick={() => {
                    document.body.classList.add("game-mode");
                    setPlaying(true);
                }}
            >
                {/* <defs>
                    <linearGradient id="gradient" gradientTransform="rotate(45)">
                        <stop offset="5%" stop-color="var(--text-color3)" />
                        <stop offset="95%" stop-color="var(--text-color4)" />
                    </linearGradient>
                </defs>
                <filter id='shadow1' colorInterpolationFilters="sRGB">
                    <feDropShadow dx="0" dy="0" stdDeviation="2" floodOpacity="1" floodColor="var(--text-color5)" />
                    <feComposite operator="in" in2="SourceGraphic"/> 
                </filter>
                <filter id='shadow' colorInterpolationFilters="sRGB">
                    <feDropShadow dx="1" dy="1" stdDeviation="1" floodOpacity="1" floodColor="black" />
                    <feDropShadow dx="0" dy="1" stdDeviation="3" floodOpacity="0.75" floodColor="rgb(103, 67, 231)" />
                </filter> */}
                <filter id="violet-glow" filterUnits="userSpaceOnUse"
                        x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur5"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur10"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="20" result="blur20"/>
                    <feGaussianBlur in="SourceGraphic" stdDeviation="30" result="blur30"/>
                    <feMerge result="blur-merged">
                        <feMergeNode in="blur10"/>
                        <feMergeNode in="blur20"/>
                        <feMergeNode in="blur30"/>
                    </feMerge>
                    <feColorMatrix result="violet-blur" in="blur-merged" type="matrix"
                                    values="0.2 0 0 0 0
                                            0 0.06 0 0 0
                                            0.1 0 0.5 0 0
                                            0 0 0 1 0" />
                    <feMerge>
                        <feMergeNode in="violet-blur"/>
                        <feMergeNode in="blur5"/>          
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
                <g filter="url(#violet-glow)" className="title-wrapper">
                    <text x="15" y="30" className="title-base">GAME</text>
                    <text x="13.2" y="60" className="title-base">START</text>
                    <text x="15" y="30" pathLength="1" className="start-title">GAME</text>
                    <text x="13.2" y="60" pathLength="1" className="start-title">START</text>
                </g>
            </svg>
        </div>
    )
}