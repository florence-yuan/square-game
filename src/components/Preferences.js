import { memo, useState } from "react";
import {ReactComponent as ThemeIcon} from "./../images/theme.svg"
import {ReactComponent as CloseIcon} from "./../images/close.svg"
import Themes from "./Themes";

function PrefUtils({val1, val2, minRange, maxRange} = {}) {
    return (
        <>
            <div
                className="track-highlight"
                style={{
                    left: `calc(${(!val1 ? 0 : (val1 - minRange)) / (maxRange - minRange) * 100}%)`,
                    width: `calc(${(val2 - (val1 ? val1 : minRange)) / (maxRange - minRange)} * 100%)`
                }}
            />
            <div className="range-label range-ext-label ext-min">{minRange}</div>
            <div className="range-label range-ext-label ext-max">{maxRange}</div>
            {val1 && <div className="range-handler-wrapper"
                style={{
                    left: `calc(${(val1 - minRange) / (maxRange - minRange)} * (100% - var(--square-side) * 0.9)`,
                }}
            >
                <div
                    className="range-label range-handler-label"
                >
                    {val1}
                </div>
            </div>}
            <div className="range-handler-wrapper"
                style={{
                    left: `calc(${(val2 - minRange) / (maxRange - minRange)} * (100% - var(--square-side) * 0.9)`,
                }}
            >
                <div
                    className="range-label range-handler-label"
                >
                    {val2}
                </div>
            </div>
        </>
    )
}

const timerOpts = [10, 15, 20, 30];

function secToMins(secs) {
    const newSecs = secs % 60 < 10 ? '0' + secs % 60 : secs % 60;
    return `${Math.floor(secs / 60)}:${newSecs}`;
}

function TimerPref({prefs, setPrefs, setRemTime}) {
    const [useTimer, setUseTimer] = useState(true);
    const [timer, setTimer] = useState(prefs.timer);

    return (
        <fieldset className="pref pref--timer">
            <div className="input-item">
                <input
                    id="useTimer"
                    type="checkbox"
                    checked={useTimer}
                    onChange={(e) => {
                        setUseTimer(!useTimer);
                        setPrefs({
                            ...prefs,
                            timer: useTimer ? -1 : timer,
                        });
                    }}
                />
                <label htmlFor="useTimer">Use Timer</label>
            </div>
            <div className={`timer-sect ${!useTimer && 'disabled'}`}>
                <legend>Choose Timer</legend>
                <div className="timer-opts">
                    {timerOpts.map((timeOpt, i) => {
                        return (
                            <div key={i} className="input-item">
                                <input
                                    id={`timer-opt-${i}`}
                                    type="radio"
                                    checked={timeOpt === timer}
                                    disabled={!useTimer}
                                    onChange={(e) => {
                                        setTimer(timeOpt);
                                        setPrefs({
                                            ...prefs,
                                            timer: timeOpt,
                                        });
                                        setRemTime(timeOpt);
                                    }}
                                />
                                <label htmlFor={`timer-opt-${i}`}>{secToMins(timeOpt)}</label>
                            </div>
                        )
                    })}
                </div>
            </div>
        </fieldset>
    )
};

const Preferences = memo(function Preferences({defaultPrefs, prefs, setPrefs, startGame, setRemTime}) {
    const [mode, setMode] = useState(0);

    return (
        <>
            <form className={`preferences ${mode === 0 ? 'game' : 'theme'}-pref`}>
                <fieldset className="pref">
                    <label>Select colored blocks distribution range (low-high)</label>
                    <div className="slider-wrapper dual-sliders">
                        <input
                            id="minGap"
                            type="range"
                            value={prefs.minGap}
                            min={1}
                            max={10}
                            onChange={(e) => {
                                if (parseInt(e.target.value) < prefs.maxGap) {
                                    setPrefs({
                                        ...prefs,
                                        minGap: parseInt(e.target.value),
                                    });
                                }
                            }}
                        />
                        <input
                            id="maxGap"
                            type="range"
                            value={prefs.maxGap}
                            min={1}
                            max={10}
                            onChange={(e) => {
                                if (parseInt(e.target.value) > prefs.minGap) {
                                    setPrefs({
                                        ...prefs,
                                        maxGap: parseInt(e.target.value),
                                    });
                                }
                            }}
                        />
                        <PrefUtils
                            val1={prefs.minGap}
                            val2={prefs.maxGap}
                            minRange={1}
                            maxRange={10}
                        />
                    </div>
                </fieldset>
                <fieldset className="pref">
                    <label htmlFor="dropTime">Select time between column drops (milliseconds)</label>
                    <div className="slider-wrapper single-range">
                        <input
                            id="dropTime"
                            type="range"
                            value={prefs.dropInter}
                            min={100}
                            max={2000}
                            step={100}
                            onChange={(e) => {
                                setPrefs({
                                    ...prefs,
                                    dropInter: parseInt(e.target.value),
                                });
                            }}
                        />
                        <PrefUtils
                            val2={prefs.dropInter}
                            minRange={100}
                            maxRange={2000}
                        />
                    </div>
                </fieldset>
                <fieldset className="pref">
                    <label htmlFor="dropNum">Select the number of columns that drop at once</label>
                    <div className="slider-wrapper single-range">
                        <input
                            id="dropNum"
                            type="range"
                            value={prefs.dropNum}
                            min={1}
                            max={6}
                            onChange={(e) => {
                                setPrefs({
                                    ...prefs,
                                    dropNum: parseInt(e.target.value),
                                });
                            }}
                        />
                        <PrefUtils
                            val2={prefs.dropNum}
                            minRange={1}
                            maxRange={6}
                        />
                    </div>
                </fieldset>
                <TimerPref
                    prefs={prefs}
                    setPrefs={setPrefs}
                    setRemTime={setRemTime}
                />
                <fieldset className="pref-btn-theme">
                    <button
                        className="btn-theme"
                        onClick={(e) => {
                            e.preventDefault();
                            setMode(1 - mode);
                        }}
                    >
                        {mode === 0 ? <ThemeIcon /> : <CloseIcon /> }
                        {mode === 0 ? 'Choose theme' : 'Close themes'}
                    </button>
                </fieldset>
                <fieldset className="pref-btn-flex">
                    <input
                        type="reset"
                        value="Reset all"
                        className="modal-btn btn--no-fill"
                        onClick={(e) => {
                            e.preventDefault();
                            setPrefs(defaultPrefs);
                        }}
                    />
                    <input
                        type="submit"
                        value="Start Game"
                        className="modal-btn btn--fill"
                        onClick={(e) => {
                            e.preventDefault();
                            document.body.classList.toggle("pref-mode");
                            startGame();
                        }}
                    />
                </fieldset>
                <Themes />
            </form>
            <div className="demo-area">

            </div>
        </>
    )
});

export default Preferences;