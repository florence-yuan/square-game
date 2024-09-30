import { memo, useContext } from "react";
import { GridSideContext, GridContext, GridSetContext } from "./GameContexts";

function Square({row, col, decaying}) {
    const grid = useContext(GridContext);
    // const squareType = gridInfo[row][col] === 2 ? 'block' : 'empty';
    let squareType;
    if (decaying) {
        squareType = 'decay';
    } else {
        switch(grid[row][col]) {
            case 1: case 3:
                squareType = 'empty';
                break;
            case 2:
                squareType = 'block';
                break;
            case 4:
                squareType = 'decay';
                break;
            case 5:
                squareType = 'dead';
                break;
        }
    }

    return (
        <div
            id={`square-${row}-${col}`}
            className={`square ${squareType}`}
            style={{
                borderTop: row === 0 ? 'none' : 'default'
            }}
        />
    )
}

const Column = memo(function Column({col, lastEmptyInd}) {
    const gridSide = useContext(GridSideContext);

    const rows = [];

    for (let i = 0; i < gridSide * 2; i++) {
        rows.push(
            <Square
                key={i}
                row={i}
                col={col}
                decaying={i === lastEmptyInd}
            />
        );
    }

    return (
        // <div className="column">
            <div className="column-flex">
                {rows}
            </div>
        // </div>
    )
});

export default Column;