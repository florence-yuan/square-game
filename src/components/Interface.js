import { useCallback, useEffect, useState } from "react"
import Game from "./Game"
import Preferences from "./Preferences";
import GameNotice from "./GameNotice";
import GameStartup from "./GameStartup";
import TopBar from "./TopBar";
import ToolBar from "./ToolBar";
import TogglePref from "./TogglePref";
import { GridSideContext, GridContext, GridSetContext, EmptyIndsContext, DecayNumsContext } from "./GameContexts";
import { useSpring } from "@react-spring/web";

function calcPos(line) {
    return line * 30;
}

const defaultPrefs = {
    minGap: 2,
    maxGap: 5,
    dropInter: 600,
    dropNum: 1,
    timer: 15,
};

const gridSide = 16;

let origRow = gridSide - 1, origCol = Math.floor(Math.random() * gridSide);

const origGrid = genGrid();

const lastEmptyInds = {};
for (let col = 0; col < gridSide; col++) {
    lastEmptyInds[col] = getLastEmptyInd(origGrid, col);
}

const origDecayNums = {};
for (let col = 0; col < gridSide; col++) {
    origDecayNums[col] = 0;
}

function genGrid(minGap = 2, maxGap = 5, rowNum = gridSide * 2, colNum = gridSide) {
    const grid = new Array(rowNum);
    for (let row = 0; row < rowNum; row++) {
        grid[row] = new Array(colNum);
    }
    
    // Each square: 1 for empty, 2 for color, 3 for user-square, 4 for decaying
    
    for (let col = 0; col < colNum; col++) {
        for (let row = rowNum - 1; row >= 0; row--) {
            if (grid[row][col] !== 2) {
                grid[row][col] = 1;
            }
            if (row === rowNum - 1 || grid[row + 1][col] === 2) {
                const gap = minGap + Math.floor(Math.random() * (maxGap - minGap));
                if (row - gap >= 0) {
                    grid[row - gap][col] = 2;
                }
            }
        }
    }

    grid[origRow + rowNum - gridSide][origCol] = 3;
    
    return grid;
}

function secToMins(secs) {
    const newSecs = secs % 60 < 10 ? '0' + secs % 60 : secs % 60;
    return `00:${newSecs}`;
}

export function getLastEmptyInd(grid, col, endRow = gridSide * 2) {
    let lastEmptyInd = 0;
    for (let row = endRow - 1; row >= 0; row--) {
        if (grid[row][col] !== 2 && grid[row][col] !== 5) {
            lastEmptyInd = row;
            break;
        }
    }

    return lastEmptyInd;
}

function lg(name) {
    return localStorage.getItem(name);
}

const defaultPlayerStats = {
    numGamesWon: 0,
    numGamesLost: 0,
    avgSpeed: 0.0,
    avgDifficulty: 0.0
};

const initPlayerStats = lg("playerStats") === null ? defaultPlayerStats : JSON.parse(lg("playerStats"));

export default function Interface() {
    const [playing, setPlaying] = useState(false);
    const [prefs, setPrefs] = useState(defaultPrefs);

    const [curEmptyInds, setCurEmptyInds] = useState(lastEmptyInds);
    const [decayNums, setDecayNums] = useState(origDecayNums);
    const [curGrid, setCurGrid] = useState(origGrid);

    const [pos, setPos] = useState({
        row: gridSide - 1,
        col: origCol,
    });
    const [isStuck, setIsStuck] = useState(false);
    const [stuckTimes, setStuckTimes] = useState(0);
    const [stuckTot, setStuckTot] = useState(3);

    const [squareAnim, squareApi] = useSpring(() => ({
        from: {
            x: calcPos(pos.col),
            y: calcPos(pos.row),
            borderRadius: '0% / 0%',
            scale: 1,
            scaleX: '100%',
            scaleY: '100%',
        }
    }));

    const [notice, setNotice] = useState(0);

    const startGame = useCallback(() => {
        const newCol = Math.floor(Math.random() * gridSide);

        setPos({
            row: gridSide - 1,
            col: newCol
        });

        squareApi.start({
            to: {
                x: calcPos(newCol),
                y: calcPos(gridSide - 1),
                scale: 1,
            },
            config: {
                duration: 200,
            }
        });

        setIsStuck(false);
        setStuckTimes(0);

        setStuckTot(3);
    
        setCurGrid(genGrid(prefs.minGap, prefs.maxGap));
    
        for (let col = 0; col < gridSide; col++) {
            lastEmptyInds[col] = 2 * gridSide - 1;
        }
        setCurEmptyInds(lastEmptyInds);
    
        setDecayNums(origDecayNums);

        if (prefs.timer > -1) {
            setRemTime(prefs.timer);
        }
        setPlaying(true);
        setTotSteps(0);
    }, [prefs]);

    const [remTime, setRemTime] = useState(prefs.timer);
    const [endAudio] = useState(new Audio("https://github.com/florence-yuan/square-game/blob/gh-pages/sounds/game-end.mp3?raw=true"));

    const [totSteps, setTotSteps] = useState(0);

    const [noticeOpen, setNoticeOpen] = useState(false);
    const [stats, setStats] = useState({});

    function calcScore() {
        let difficulty = (10 - (prefs.minGap + prefs.maxGap) / 2) / 9
            + 2 * (2000 - prefs.dropInter) / 1900
            + (prefs.dropNum - 1) / 5;
        difficulty = Math.round(difficulty / 4 * 10);

        return difficulty;
    }

    const [playerStats, setPlayerStats] = useState(initPlayerStats);

    const updateStats = useCallback((win) => {
        const usedTime = prefs.timer === -1 ? -1 : prefs.timer - remTime;
        const score = calcScore();
        setStats({
            ...prefs,
            usedTime: usedTime,
            score: score,
        });
        document.body.classList.add("notice-mode");

        setPlayerStats(prev => {
            const newPlayerStats = {
                numGamesLost: prev.numGamesLost + 1 - win,
                numGamesWon: prev.numGamesWon + win,
                avgSpeed: prefs.timer === -1 ? prev.avgSpeed
                    : Math.round(
                    ((prev.avgSpeed * prev.numGamesLost + parseFloat(totSteps / usedTime)) / (prev.numGamesLost + 1)) * 10
                ) / 10,
                avgDifficulty: Math.round(
                    (parseFloat(prev.avgDifficulty * prev.numGamesLost + score) / (prev.numGamesLost + 1)) * 10
                ) / 10
            };
            localStorage.setItem("playerStats", JSON.stringify(newPlayerStats));

            return newPlayerStats;
        });
    }, [prefs, remTime]);

    const handleTimeUp = useCallback(() => {
        setPlaying(false);
        endAudio.play();

        setNotice(0);
        setNoticeOpen(true);
        
        updateStats(0);
    }, [prefs, remTime]);

    const handleSuccess = useCallback(() => {
        setPlaying(false);
        endAudio.play();

        setNotice(1);
        setNoticeOpen(true);
        
        updateStats(1);
    }, [prefs, remTime]);

    useEffect(() => {
        if (!playing || prefs.timer < 0 || remTime < 0)
            return;

        let iters = remTime;
        let timer = setInterval(() => {
            if (iters === 0) {
                handleTimeUp();
                return;
            }
            setRemTime(prevTime => prevTime - 1);
            iters--;
        }, 1000);

        return function cleanup() {
            clearInterval(timer);
        }
    }, [playing, remTime]);

    return (
        <div className="interface">
            <TopBar
                playerStats={playerStats}
                setPlaying={setPlaying}
            />
            <article className="game-inter">
                <div className="timer" style={{
                    display: prefs.timer === -1 ? 'none' : 'block'
                }}>
                    {secToMins(remTime)}
                </div>
                <GridSideContext.Provider value={gridSide}>
                    <GridContext.Provider value={curGrid}>
                        <GridSetContext.Provider value={setCurGrid}>
                            <EmptyIndsContext.Provider value={curEmptyInds}>
                                <DecayNumsContext.Provider value={decayNums}>
                                    <Game
                                        playing={playing}

                                        squareAnim={squareAnim}
                                        squareApi={squareApi}

                                        pos={pos}
                                        setPos={setPos}
                                        isStuck={isStuck}
                                        setIsStuck={setIsStuck}
                                        stuckTimes={stuckTimes}
                                        setStuckTimes={setStuckTimes}
                                        stuckTot={stuckTot}

                                        dropInter={prefs.dropInter}
                                        dropNum={prefs.dropNum}

                                        setCurEmptyInds={setCurEmptyInds}
                                        setDecayNums={setDecayNums}

                                        handleSuccess={handleSuccess}
                                        setTotSteps={setTotSteps}
                                    />
                                </DecayNumsContext.Provider>
                            </EmptyIndsContext.Provider>
                        </GridSetContext.Provider>
                    </GridContext.Provider>
                </GridSideContext.Provider>
                <footer>
                    <ToolBar
                        playing={playing}
                        setPlaying={setPlaying}
                    />
                    <TogglePref
                        setPlaying={setPlaying}
                    />
                </footer>
            </article>
            <article className="fullscreen game-startup">
                <GameStartup
                    setPlaying={setPlaying}
                />
            </article>
            <article className="fullscreen game-notice">
                <GameNotice
                    startGame={startGame}
                    notice={notice}
                    noticeOpen={noticeOpen}
                    setNoticeOpen={setNoticeOpen}
                    stats={stats}
                    totSteps={totSteps}
                />
            </article>
            <article className="fullscreen pref-inter">
                <Preferences
                    defaultPrefs={defaultPrefs}
                    prefs={prefs}
                    setPrefs={setPrefs}
                    setRemTime={setRemTime}
                    startGame={startGame}
                />
            </article>
        </div>
    )
}