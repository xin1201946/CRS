// 语言设置
// Language settings
// 语言表：
// Language table:
// 1. zh-CN
// 2. en-US
import {getSettings, setSettings} from "./Settings.js";

/**
 * 获取当前语言的编号。
 * Get the current language number.
 * @returns {number} 语言编号，1 代表 zh-CN，2 代表 en-US。
 * @returns {number} Language number, 1 represents zh-CN, 2 represents en-US.
 */
export function get_language() {
    // 根据设置中的 'Language' 值返回对应的语言编号
    // Return the corresponding language number based on the 'Language' value in settings
    return getSettings('Language') === '1' ? 1 : 2;
}

/**
 * 获取当前语言的字符串标识。
 * Get the string identifier of the current language.
 * @returns {string} 语言字符串，如 'zh-CN' 或 'en-US'。
 * @returns {string} Language string, such as 'zh-CN' or 'en-US'.
 */
export function get_T_language() {
    // 根据设置中的 'Language' 值返回对应的语言字符串
    // Return the corresponding language string based on the 'Language' value in settings
    return getSettings('Language') === "1" ? "zh-CN" : "en-US";
}

/**
 * 设置当前语言。
 * Set the current language.
 * @param {number} [language = 1] 语言编号，默认为 1（zh-CN）。
 * @param {number} [language = 1] Language number, default is 1 (zh-CN).
 */
export function set_language(language = 1) {
    // 将语言编号存入设置中
    // Save the language number to the settings
    setSettings('Language', language);
    // 重新加载页面使语言设置生效
    // Reload the page to apply the language settings
    window.location.reload();
}

/**
 * 设置当前语言（字符串标识）。
 * Set the current language (string identifier).
 * @param {string} [language = 'en-US'] 语言字符串，默认为 'en-US'。
 * @param {string} [language = 'en-US'] Language string, default is 'en-US'.
 * @returns {string} 操作结果信息，固定返回 'Done'。
 * @returns {string} Operation result message, always returns 'Done'.
 */
export function set_languageT(language = 'en-US') {
    // 根据传入的语言字符串设置对应的语言编号
    // Set the corresponding language number according to the incoming language string
    setSettings('Language', language === 'en-US' ? '2' : '1');
    // 重新加载页面使语言设置生效
    // Reload the page to apply the language settings
    window.location.reload();
    // 返回操作结果信息
    // Return the operation result message
    return "Done";
}
