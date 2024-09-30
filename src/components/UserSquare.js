import { useContext, useEffect } from "react"
import { GridSideContext, GridContext, DecayNumsContext } from "./GameContexts";
import { animated, easings } from "@react-spring/web";

function calcPos(line) {
    return line * 30;
}

const squish = [
    {
        scaleX: '85%',
        scaleY: '95%',
        borderRadius: '20% / 50%',
    },
    {
        scaleY: '85%',
        scaleX: '95%',
        borderRadius: '50% / 20%',
    },
];

export default function UserSquare({
    pos, setPos,
    isStuck, stuckTot,
    squareAnim, squareApi,
    handleSuccess,
    playing, setTotSteps
}) {
    const gridSide = useContext(GridSideContext);
    const grid = useContext(GridContext);
    const decayNums = useContext(DecayNumsContext);

    function inBound(row, col) {
        return row >= 0 && row < gridSide * 2 && col >= 0 && col < gridSide;
    }

    function handleKeyDown(e) {
        let newRow = pos.row, newCol = pos.col;
        let squishInd = 0;

        switch (e.key) {
            case 'a': case 'h': case 'ArrowLeft':
                newCol--;
                break;
            case 'd': case 'l': case 'ArrowRight':
                newCol++;
                break;
            case 'w': case 'k': case 'ArrowUp':
                newRow--;
                squishInd = 1;
                break;
            case 's': case 'j': case 'ArrowDown':
                newRow++;
                squishInd = 1;
                break;
            default:
                return;
        }

        if (newRow >= gridSide || newCol < 0 || newCol >= gridSide)
            return;
        
        const gridRow = newRow + gridSide - decayNums[newCol];

        if (!inBound(gridRow, newCol))
            return;
        
        if (grid[gridRow][newCol] !== 2) {
            const squishAudio = new Audio("https://florence-yuan.github.io/square-game/sounds/splat.mp3?raw=true");
            squishAudio.play();

            squareApi.start({
                to: [
                    {
                        x: (calcPos(pos.col) + calcPos(newCol)) / 2,
                        y: (calcPos(pos.row) + calcPos(newRow)) / 2,
                        ...squish[squishInd],
                    },
                    {
                        x: calcPos(newCol),
                        y: calcPos(newRow),
                        scaleX: '100%',
                        scaleY: '100%',
                        borderRadius: '0% / 0%',
                    }
                ],
                config: {
                    duration: 200,
                    easing: easings.easeInOutBounce,
                }
            });
    
            setPos({
                row: newRow,
                col: newCol,
            });

            if (newRow === 0) {
                handleSuccess();
            }

            setTotSteps(prev => prev + 1);
        }
    }

    useEffect(() => {
        if (isStuck || !playing) {
            return;
        }

        window.addEventListener("keydown", handleKeyDown);

        return function cleanup() {
            window.removeEventListener("keydown", handleKeyDown);
        }
    }, [pos, grid, decayNums, isStuck, stuckTot, playing]);

    return (
        <>
            <animated.div
                className="user-square"
                style={{
                    transformOrigin: origin,
                    ...squareAnim,
                }}
            />
        </>
    )
}