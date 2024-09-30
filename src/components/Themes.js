import { memo, useState } from "react";
import placeholder from './../images/placeholder.jpg';

const themes = ['classic', 'alien'];

const themeImages = [];
for (let i = 0; i < 2; i++) {
    themeImages.push(require(`./../images/theme${i + 1}.png`));
}

const Themes = memo(function Themes() {
    const [theme, setTheme] = useState(0);

    return (
        <fieldset className="pref-theme">
            <div className="theme-grid">
                {themes.map((themeOpt, i) => {
                    return (
                        <div key={i} className={`theme-item ${theme === i && 'selected'}`}>
                            <label
                                htmlFor={`theme-opt${i}`}
                            >
                                <img
                                    src={i < themeImages.length ? themeImages[i] : placeholder}
                                    className="theme-img"
                                    alt={themeOpt + " theme image"}
                                />
                                <span>{themeOpt} theme</span>
                            </label>
                            <input
                                id={`theme-opt${i}`}
                                name="theme"
                                type="radio"
                                checked={theme === i}
                                onChange={() => {
                                    setTheme(i);
                                    document.body.classList.remove(`${themes[theme]}-theme`);
                                    document.body.classList.add(`${themes[i]}-theme`);
                                }}
                            />
                        </div>
                    )
                })}
            </div>
        </fieldset>
    )
});

export default Themes;