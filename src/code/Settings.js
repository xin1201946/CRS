import { add_log } from "./log.js";
function stringifyJson(json) {
    try {
        return JSON.stringify(json);
    } catch (error) {
        add_log('Settings:stringifyJson', 'error', error.message);
        return null;
    }
}

// 将字符串转换为 JSON 对象
function parseJson(jsonString) {
    try {
        return JSON.parse(jsonString);
    } catch (error) {
        add_log('Settings:parseJson', 'error', error.message);
        return null;
    }
}
export function setSettings(name, value,isJson=false, isSession = false) {
    try {
        if (isJson){
            value=stringifyJson(value);
            add_log('Settings:setSetting:' + name, 'successfully', value);
        }
        if (isSession) {
            sessionStorage.setItem(name, value);
            add_log('Settings:setSetting:' + name, 'successfully', value);
        } else {
            localStorage.setItem(name, value);
            add_log('Settings:setSetting:' + name, 'successfully', value);
        }
        return true;
    } catch (error) {
        add_log('Settings:setSetting:' + name, 'error', error.message);
        return false;
    }
}

export function getSettings(name,isJson=false) {
    try {
        let value;
        value = sessionStorage.getItem(name) || localStorage.getItem(name);
        if (isJson){
            value = parseJson(value);
        }
        add_log('Settings:getSettings:' + name, Object.keys(value) ? 'successfully' : 'error', value);
        return value || null;
    } catch (error) {
        add_log('Settings:getSettings:' + name, 'error', error.message);
        return null;
    }
}