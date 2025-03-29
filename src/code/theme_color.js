import {getSettings, setSettings} from "./Settings.js";
import {add_log} from "./log.js";
const mql = window.matchMedia('(prefers-color-scheme: dark)');
const body = document.body;

function removeMqlListener() {
    try {
        mql.removeEventListener('change', matchMode);
        add_log('removeThemeListener','successfully');
    } catch (e) {
        add_log('removeThemeListener','warning','Can`t remove Theme listener:'+e);
    }
}

function setTheme(isDark) {
    if (isDark) {
        // apply a theme
        body.setAttribute('theme-mode', 'dark');
        setSettings('theme_color','dark');
        add_log('setTheme:Dark','successfully');

    } else {
        // apply a theme
        body.removeAttribute('theme-mode');
        setSettings('theme_color','light');
        add_log('setTheme:Light','successfully');
    }
}


function matchMode() {
    const body = document.body;
    if (mql.matches) {
        if (!body.hasAttribute('theme-mode')) {
            body.setAttribute('theme-mode', 'dark');
        }
    } else {
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
        }
    }
}

export function setDarkTheme() {
    add_log('TrySetTheme:Dark','successfully');
    removeMqlListener();
    setTheme(true);
    // 广播主题切换事件
    window.dispatchEvent(new CustomEvent('themeChange', { detail: 'dark' }));
}

export function setLightTheme() {
    add_log('TrySetTheme:Light','successfully');
    removeMqlListener();
    setTheme(false);
    // 广播主题切换事件
    window.dispatchEvent(new CustomEvent('themeChange', { detail: 'light' }));
}

export function setAutoTheme() {
    add_log('TrySetTheme:Auto','successfully');
    matchMode();
    setSettings('theme_color','auto')
    mql.addEventListener('change', matchMode);
    // 广播主题切换事件
    window.dispatchEvent(new CustomEvent('themeChange', { detail: 'auto' }));
}
export function queck_change_theme(str){
    if (str === 'light'){
        setLightTheme(true);
    } else if (str === 'dark'){
        setDarkTheme(false);
    }
}
export function getTheme() {
    if (!body.hasAttribute('theme-mode')) {
        return 'light';
    }else{
        return 'dark';
    }
}

export function getSetTheme() {
    return getSettings("theme_color");
}