import { add_log } from "./log.js";

export function setSettings(name, value, isSession = false) {
    try {
        if (isSession) {
            sessionStorage.setItem(name, value);
        } else {
            localStorage.setItem(name, value);
        }
        add_log('Settings:setSetting:' + name, 'successfully', value);
        return true;
    } catch (error) {
        add_log('Settings:setSetting:' + name, 'error', error.message);
        return false;
    }
}

export function getSettings(name) {
    try {
        let value;
        value = sessionStorage.getItem(name) || localStorage.getItem(name);
        add_log('Settings:getSettings:' + name, value ? 'successfully' : 'error', value);
        return value || null;
    } catch (error) {
        add_log('Settings:getSettings:' + name, 'error', error.message);
        return null;
    }
}