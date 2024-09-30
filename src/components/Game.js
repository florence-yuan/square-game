import { useCallback, useContext, useEffect, useState } from "react";
import { GridSideContext, GridContext, GridSetContext, EmptyIndsContext, DecayNumsContext } from "./GameContexts";
import Column from "./Column";
import UserSquare from "./UserSquare";
import { getLastEmptyInd } from "./Interface";

function calcPos(line) {
    return line * 30;
}

export default function Game(props) {
    const gridSide = useContext(GridSideContext);
    const curGrid = useContext(GridContext);
    const setCurGrid = useContext(GridSetContext);
    const curEmptyInds = useContext(EmptyIndsContext);
    const decayNums = useContext(DecayNumsContext);

    const [whooshAudio] = useState(new Audio("https://github.com/florence-yuan/square-game/blob/gh-pages/sounds/fast-whoosh.mp3?raw=true"))
    const [ouchAudio] = useState(new Audio("https://github.com/florence-yuan/square-game/blob/gh-pages/sounds/ouch.mp3?raw=true"))

    const columns = [];
    
    for (let i = 0; i < gridSide; i++) {
        columns.push(
            <Column
                key={i}
                col={i}
                lastEmptyInd={curEmptyInds[i]}
            />
        )
    }

    const [curCol, setCurCol] = useState((props.pos.col - 3 + gridSide) % gridSide);

    const gridDrop = useCallback(() => {
        let timeout = setTimeout(() => {
            const dropAudio = new Audio("https://github.com/florence-yuan/square-game/blob/gh-pages/sounds/thud.mp3?raw=true")
            dropAudio.play();

            let newCurGrid = curGrid, col = curCol;
            const newEmptyInds = {};
            const newDecayNums = {};
            for (let i = 0; i < props.dropNum; i++) {
                // col = (curCol + i) % gridSide;
                const curRow = curEmptyInds[col];
                newCurGrid[curRow][col] = 5;

                let newEmptyInd = getLastEmptyInd(newCurGrid, col, curRow);
                newEmptyInds[col] = newEmptyInd;
                newDecayNums[col] = decayNums[col] + 1;

                if (props.stuckTimes && col === props.pos.col && curRow > props.pos.row + gridSide - decayNums[col]) {
                    props.squareApi.start({
                        to: {
                            y: calcPos(props.pos.row + 1),
                        },
                        config: {
                            duration: 200,
                        }
                    });
                    props.setPos(prevPos => {
                        return {
                            ...prevPos,
                            row: prevPos.row + 1,
                        }                        
                    });
                }
                
                col = (col + 1) % gridSide;
            }

            if (props.isStuck) {
                if (props.stuckTimes > 0) {
                    props.squareApi.start({
                        to: {
                            scale: (props.stuckTot - props.stuckTimes + 2) / (props.stuckTot + 1),
                        },
                        config: {
                            duration: 200,
                        }
                    });
                    props.setStuckTimes(prevTimes => prevTimes - 1);
                } else {
                    whooshAudio.play();
                    props.setIsStuck(false);

                    let upInd = getLastEmptyInd(newCurGrid, curCol, props.pos.row - newDecayNums[curCol] + gridSide);
                    const newRow = upInd + newDecayNums[curCol] - gridSide;
                    props.squareApi.start({
                        to: {
                            scale: 1,
                            x: calcPos(props.pos.col),
                            y: calcPos(newRow),
                        },
                        config: {
                            duration: 200,
                        }
                    });

                    props.setPos(prevPos => {
                        return {
                            ...prevPos,
                            row: newRow
                        }                        
                    });
                }
            }

            setCurCol((curCol + props.dropNum) % gridSide);
            setCurGrid(newCurGrid);
            props.setCurEmptyInds(prevEmptyInds => {
                return {
                    ...prevEmptyInds,
                    ...newEmptyInds,
                }
            });
            props.setDecayNums(prevDecayNums => {
                return {
                    ...prevDecayNums,
                    ...newDecayNums,
                }
            });

            if (!props.isStuck) {
                let gridRow = newDecayNums[props.pos.col] !== undefined
                    ? newDecayNums[props.pos.col] : decayNums[props.pos.col];
                if (newCurGrid[props.pos.row + gridSide - gridRow][props.pos.col] === 2 && props.stuckTot >= 0) {
                    ouchAudio.play();
                    props.squareApi.start({
                        to: {
                            scale: 0.25
                        },
                        config: {
                            duration: 200,
                        }
                    });
                    props.setIsStuck(true);
                    props.setStuckTimes(props.stuckTot);
                }
            }
        }, props.dropInter);

        return timeout;

    }, [props.pos, props.isStuck, props.stuckTimes, props.stuckTot, curGrid, curEmptyInds, decayNums, props.dropInter, props.dropNum])

    useEffect(() => {
        if (!props.playing) {
            return;
        }

        let timeout = gridDrop();

        return function cleanup() {
            clearTimeout(timeout);
        }
    }, [props.playing, curCol]);

    return (
        <div className="game-wrapper">
            <div className="finish-line">
                finish line
            </div>
            <div className="game__inner">
                {columns}
                <UserSquare
                    pos={props.pos}
                    setPos={props.setPos}
                    isStuck={props.isStuck}
                    setIsStuck={props.setIsStuck}
                    setStuckTimes={props.setStuckTimes}
                    stuckTot={props.stuckTot}
                    squareAnim={props.squareAnim}
                    squareApi={props.squareApi}
                    handleSuccess={props.handleSuccess}
                    setTotSteps={props.setTotSteps}
                    playing={props.playing}
                />
            </div>
        </div>
    )
}