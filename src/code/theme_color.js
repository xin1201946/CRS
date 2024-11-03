import {getSettings, setSettings} from "./Settings.js";
import {add_log} from "./log.js";
import { initVChartSemiTheme } from '@visactor/vchart-semi-theme';

// initialization
initVChartSemiTheme();
const mql = window.matchMedia('(prefers-color-scheme: dark)');
const body = document.body;

function removeMqlListener() {
    try {
        mql.removeEventListener('change', matchMode);
        add_log('removeThemeListener','successfully');
    } catch (e) {
        console.error('Error removing MQL listener:', e);
        add_log('removeThemeListener','warning','Can`t remove Theme listener');
    }
}

function setTheme(isDark) {
    if (isDark) {
        // apply a theme
        body.setAttribute('theme-mode', 'dark');
        setSettings('theme_color','dark')
        add_log('setTheme:Dark','successfully');
    } else {
        // apply a theme
        body.removeAttribute('theme-mode');
        setSettings('theme_color','light')
        add_log('setTheme:Light','successfully');
    }
}

function matchMode() {
    if (mql.matches) {
        if (!body.hasAttribute('theme-mode')) {
            body.setAttribute('theme-mode', 'dark');
            add_log('AutoTheme:Dark','successfully');
        }
    } else {
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
            add_log('AutoTheme:Light','successfully');
        }
    }
}

export function setDarkTheme() {
    add_log('TrySetTheme:Dark','successfully');
    removeMqlListener();
    setTheme(true);
}

export function setLightTheme() {
    add_log('TrySetTheme:Light','successfully');
    removeMqlListener();
    setTheme(false);
}

export function setAutoTheme() {
    add_log('TrySetTheme:Auto','successfully');
    matchMode();
    setSettings('theme_color','auto')
    mql.addEventListener('change', matchMode);
}
export function queck_change_theme(str){
    if (str === 'light'){
        setLightTheme(true);
    } else if (str === 'dark'){
        setDarkTheme(false);
    }
}
export function getTheme() {
    return mql.matches;
}

export function getSetTheme() {
    return getSettings("theme_color");
}