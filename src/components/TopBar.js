import {ReactComponent as StatsIcon} from "../images/analytics.svg"
import {ReactComponent as GithubIcon} from "../images/github.svg"

const ICONS = [
    {
        label: 'Player Stats',
        icon: <StatsIcon />,
        handleClick: () => {
            document.body.classList.toggle("stats-on");
        }
    },
    {
        label: 'Code at Github',
        icon: <GithubIcon />,
        handleClick: () => {
            const link = document.createElement("a");
            link.href = "https://github.com/florence-yuan/square-game";
            link.click();
        }
    }
];

function DialogStats({playerStats, handleClick}) {
    return (
        <div className="dialog dialog--stats">
            <div
                className="dialog__bg"
                onClick={handleClick}
            />
            <div className="dialog__inner">
                <h1 className="dialog__heading">Player stats</h1>
                <div className="stats__line">
                    <div className="stats__attr">Success rate</div>
                    <div className="stats__val">
                        {
                            playerStats.numGamesWon + playerStats.numGamesLost === 0
                            ? '--'
                            : Math.round(playerStats.numGamesWon / (playerStats.numGamesWon + playerStats.numGamesLost) * 100)
                        }%
                    </div>
                </div>
                <div className="stats__line">
                    <div className="stats__attr">Avg. speed</div>
                    <div className="stats__val">
                        {playerStats.avgSpeed} moves per second
                    </div>
                </div>
                <div className="stats__line">
                    <div className="stats__attr">Avg. difficulty</div>
                    <div className="stats__val">
                        {playerStats.avgDifficulty} out of 10
                    </div>
                </div>
                <div
                    className="dialog__close"
                    onClick={handleClick}
                >
                    🗙
                </div>
            </div>
        </div>
    );
}

export default function TopBar({playerStats, setPlaying}) {
    return (
        <>
            <div className="top-bar">
                {ICONS.map(({label, icon, handleClick}) => (
                    <div
                        key={label}
                        className="top__btn"
                        onClick={() => {
                            setPlaying(false);
                            handleClick();
                        }}
                    >
                        <div
                            className="top__icon"
                            // title={label}
                        >
                            {icon}
                        </div>
                        <div className="top__label">
                            {label}
                        </div>
                    </div>
                ))}
            </div>
            <DialogStats playerStats={playerStats} handleClick={ICONS[0].handleClick} />
        </>
    )
}