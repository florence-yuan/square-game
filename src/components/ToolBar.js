import { useState } from "react"
import { ReactComponent as PlayingBtn } from "./../images/playing.svg";
import { ReactComponent as PauseBtn } from "./../images/pause.svg";

function Tool({front, back, state, method}) {
    return (
        <div
            className="tool-wrapper"
            onClick={() => method()}
        >
            <div id="pause-btn" className={`tool tool-${state ? 'front' : 'back'}`}>
                {front}
            </div>
            <div id="playing-btn" className={`tool tool-${state ? 'back' : 'front'}`}>
                {back}
            </div>
        </div>
    )
}

export default function ToolBar(props) {
    const toolAttrs = [
        {
            front: <PauseBtn />,
            back: <PlayingBtn />,
            state: !props.playing,
            method: () => {
                props.setPlaying(!props.playing);
            }
        }
    ];

    return (
        <div className="tool-bar">
            {toolAttrs.map((toolAttr, i) => {
                return (
                    <Tool
                        key={i}
                        {...toolAttr}
                    />
                )
            })}
        </div>
    );
}