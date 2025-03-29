// 从 log.js 文件导入 add_log 函数，用于记录日志
// Import the add_log function from the log.js file to record logs
import { add_log } from "./log.js";

/**
 * 将 JSON 对象转换为字符串。
 * Converts a JSON object to a string.
 * @param {Object} json - 要转换的 JSON 对象。
 * @param {Object} json - The JSON object to be converted.
 * @returns {string|null} - 转换后的字符串，如果转换失败则返回 null。
 * @returns {string|null} - The converted string, or null if the conversion fails.
 */
function stringifyJson(json) {
    try {
        // 尝试将 JSON 对象转换为字符串
        // Try to convert the JSON object to a string
        return JSON.stringify(json);
    } catch (error) {
        // 记录转换失败的日志
        // Record the log of conversion failure
        add_log('Settings:stringifyJson', 'error', error.message);
        return null;
    }
}

/**
 * 将字符串转换为 JSON 对象。
 * Converts a string to a JSON object.
 * @param {string} jsonString - 要转换的字符串。
 * @param {string} jsonString - The string to be converted.
 * @returns {Object|null} - 转换后的 JSON 对象，如果转换失败则返回 null。
 * @returns {Object|null} - The converted JSON object, or null if the conversion fails.
 */
function parseJson(jsonString) {
    try {
        // 尝试将字符串解析为 JSON 对象
        // Try to parse the string as a JSON object
        return JSON.parse(jsonString);
    } catch (error) {
        // 记录解析失败的日志
        // Record the log of parsing failure
        add_log('Settings:parseJson', 'error', error.message);
        return null;
    }
}

/**
 * 设置本地存储或会话存储的值。
 * Sets the value in local storage or session storage.
 * @param {string} name - 存储项的名称。
 * @param {string} name - The name of the storage item.
 * @param {any} value - 要存储的值。
 * @param {any} value - The value to be stored.
 * @param {boolean} [isJson=false] - 是否将值作为 JSON 处理。
 * @param {boolean} [isJson=false] - Whether to treat the value as JSON.
 * @param {boolean} [isSession=false] - 是否使用会话存储。
 * @param {boolean} [isSession=false] - Whether to use session storage.
 * @returns {boolean} - 如果设置成功返回 true，否则返回 false。
 * @returns {boolean} - Returns true if the setting is successful, otherwise false.
 */
export function setSettings(name, value,isJson=false, isSession = false) {
    try {
        if (isJson){
            // 如果是 JSON 数据，将其转换为字符串
            // If it is JSON data, convert it to a string
            value=stringifyJson(value);
            // 记录设置成功的日志
            // Record the log of successful setting
            add_log('Settings:setSetting:' + name, 'successfully', value);
        }
        if (isSession) {
            // 使用会话存储设置值
            // Use session storage to set the value
            sessionStorage.setItem(name, value);
            // 记录设置成功的日志
            // Record the log of successful setting
            add_log('Settings:setSetting:' + name, 'successfully', value);
        } else {
            // 使用本地存储设置值
            // Use local storage to set the value
            localStorage.setItem(name, value);
            // 记录设置成功的日志
            // Record the log of successful setting
            add_log('Settings:setSetting:' + name, 'successfully', value);
        }
        return true;
    } catch (error) {
        // 记录设置失败的日志
        // Record the log of setting failure
        add_log('Settings:setSetting:' + name, 'error', error.message);
        return false;
    }
}

/**
 * 获取本地存储或会话存储的值。
 * Gets the value from local storage or session storage.
 * @param {string} name - 存储项的名称。
 * @param {string} name - The name of the storage item.
 * @param {boolean} [isJson=false] - 是否将值作为 JSON 处理。
 * @param {boolean} [isJson=false] - Whether to treat the value as JSON.
 * @returns {any|null} - 获取的值，如果获取失败则返回 null。
 * @returns {any|null} - The obtained value, or null if the retrieval fails.
 */
export function getSettings(name,isJson=false) {
    try {
        let value;
        // 优先从会话存储获取值，若不存在则从本地存储获取
        // Try to get the value from session storage first, if not found, get it from local storage
        value = sessionStorage.getItem(name) || localStorage.getItem(name);
        if (isJson){
            // 如果是 JSON 数据，将其解析为对象
            // If it is JSON data, parse it into an object
            value = parseJson(value);
        }
        // 记录获取成功或失败的日志
        // Record the log of successful or failed retrieval
        add_log('Settings:getSettings:' + name, Object.keys(value) ? 'successfully' : 'error', value);
        return value || null;
    } catch (error) {
        // 记录获取失败的日志
        // Record the log of retrieval failure
        add_log('Settings:getSettings:' + name, 'error', error.message);
        return null;
    }
}

/**
 * 获取所有本地存储的数据。
 * Gets all data from local storage.
 * @returns {string} - 包含所有本地存储数据的字符串。
 * @returns {string} - A string containing all local storage data.
 */
export function getAllLocalStorage() {
    // 如果本地存储为空，返回提示信息
    // If local storage is empty, return a prompt message
    if (localStorage.length === 0) return "No local storage data found";
    let result = "";
    // 遍历本地存储的所有项
    // Iterate through all items in local storage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const value = localStorage.getItem(key);
        // 拼接存储项的键值对
        // Concatenate the key - value pairs of storage items
        result += `${key}: ${value}\n`;
    }
    // 返回拼接后的字符串并去除首尾空格
    // Return the concatenated string and remove leading and trailing spaces
    return result.trim();
}

/**
 * 清空本地存储。
 * Clears local storage.
 * @returns {string} - 操作结果信息，固定返回 'Done'。
 * @returns {string} - The operation result message, always returns 'Done'.
 */
export function clearLocalStorage() {
    // 清空本地存储
    // Clear local storage
    localStorage.clear();
    return 'Done'
}
