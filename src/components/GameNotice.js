import { animated, useTrail } from "@react-spring/web";

const scoreBgs = [];

for (let i = 0; i < 10; i++) {
    scoreBgs.push(
        <span
            key={i}
            className="score-card score-bg"
        />
    );
}

export default function GameNotice({
    startGame, notice, noticeOpen, setNoticeOpen, stats, totSteps
}) {
    const content = notice ? 'Total success!' : "Time's up!";
    const titleTrail = useTrail(content.length, {
        config: {duration: 100},
        opacity: noticeOpen ? 1 : 0,
        from: {opacity: 0}
    });

    const scoreTrail = useTrail(10, {
        config: {duration: 100},
        scale: noticeOpen ? 1 : 0,
        from: {scale: 0}, delay: 800,
    });

    return (
        <>
            <div className="notice-title">
                <div className={`title-text title-text${notice}`}>
                    {titleTrail.map(({...styles}, i) => (
                        <animated.span
                            key={i}
                            style={{...styles}}
                        >
                            {content[i]}
                        </animated.span>
                    ))}
                </div>
            </div>
            <div className="notice-score">
                {stats.usedTime && stats.timer > 0 && <div className="score-stats">
                    {totSteps} Steps in {stats.usedTime !== -1 && stats.usedTime + ' seconds'}
                </div>}
                <div className="score-val">
                    Difficulty: <span>{stats.score}</span> out of 10
                </div>
                {/* <svg width="300" height="22" viewBox="0 0 68 5">
                    {clipRects}
                </svg> */}
                <div className="score-card-wrapper">
                    <div className="score-card-flex">
                        {scoreBgs}
                    </div>
                    <div className="score-card-flex">
                        {scoreTrail.map(({...styles}, i) => (
                            <animated.span
                                key={i}
                                className="score-card"
                                style={i < stats.score ? {...styles} : {}}
                            />
                        ))}
                    </div>
                </div>
            </div>
            <div className="notice-btns">
                <button
                    className="modal-btn btn--no-fill"
                    onClick={(e) => {
                        e.preventDefault();
                        setNoticeOpen(false);
                        document.body.classList.toggle("notice-mode");
                        document.body.classList.toggle("pref-mode");
                    }}
                >
                    Preferences
                </button>
                <button
                    className="modal-btn btn--fill"
                    onClick={(e) => {
                        e.preventDefault();
                        setNoticeOpen(false);
                        document.body.classList.toggle("notice-mode");
                        startGame();
                    }}
                >
                    Restart Game
                </button>
            </div>
        </>
    )
}