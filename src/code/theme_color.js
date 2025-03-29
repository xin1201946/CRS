// 从 Settings.js 文件导入 getSettings 和 setSettings 函数，用于获取和设置主题颜色
// Import the getSettings and setSettings functions from the Settings.js file to get and set the theme color
import {getSettings, setSettings} from "./Settings.js";
// 从 log.js 文件导入 add_log 函数，用于记录主题颜色设置的日志
// Import the add_log function from the log.js file to record logs of theme color settings
import {add_log} from "./log.js";
// 使用 matchMedia 检查用户是否偏好深色模式
// Use matchMedia to check if the user prefers the dark mode
const mql = window.matchMedia('(prefers-color-scheme: dark)');
// 获取文档的 body 元素，用于设置主题模式
// Get the body element of the document to set the theme mode
const body = document.body;

/**
 * 移除媒体查询监听器。
 * Removes the media query listener.
 */
function removeMqlListener() {
    try {
        // 移除媒体查询的 change 事件监听器
        // Remove the change event listener of the media query
        mql.removeEventListener('change', matchMode);
        // 记录移除监听器成功的日志
        // Record the log of successful removal of the listener
        add_log('removeThemeListener','successfully');
    } catch (e) {
        // 记录移除监听器失败的日志
        // Record the log of failed removal of the listener
        add_log('removeThemeListener','warning','Can`t remove Theme listener:'+e);
    }
}

/**
 * 设置主题模式。
 * Sets the theme mode.
 * @param {boolean} isDark - 是否为深色模式。
 * @param {boolean} isDark - Whether it is the dark mode.
 */
function setTheme(isDark) {
    if (isDark) {
        // 应用深色主题
        // Apply the dark theme
        body.setAttribute('theme-mode', 'dark');
        // 将主题颜色设置为 dark 并保存到设置中
        // Set the theme color to dark and save it to the settings
        setSettings('theme_color','dark');
        // 记录设置深色主题成功的日志
        // Record the log of successful setting of the dark theme
        add_log('setTheme:Dark','successfully');
    } else {
        // 应用浅色主题
        // Apply the light theme
        body.removeAttribute('theme-mode');
        // 将主题颜色设置为 light 并保存到设置中
        // Set the theme color to light and save it to the settings
        setSettings('theme_color','light');
        // 记录设置浅色主题成功的日志
        // Record the log of successful setting of the light theme
        add_log('setTheme:Light','successfully');
    }
}

/**
 * 根据用户的系统偏好匹配主题模式。
 * Matches the theme mode according to the user's system preference.
 */
function matchMode() {
    // 获取文档的 body 元素
    // Get the body element of the document
    const body = document.body;
    if (mql.matches) {
        // 如果用户偏好深色模式且 body 元素没有设置主题模式，则设置为深色模式
        // If the user prefers the dark mode and the body element does not have a theme mode set, set it to the dark mode
        if (!body.hasAttribute('theme-mode')) {
            body.setAttribute('theme-mode', 'dark');
        }
    } else {
        // 如果用户不偏好深色模式且 body 元素设置了主题模式，则移除主题模式
        // If the user does not prefer the dark mode and the body element has a theme mode set, remove the theme mode
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
        }
    }
}

/**
 * 设置深色主题。
 * Sets the dark theme.
 */
export function setDarkTheme() {
    // 记录尝试设置深色主题成功的日志
    // Record the log of successful attempt to set the dark theme
    add_log('TrySetTheme:Dark','successfully');
    // 移除媒体查询监听器
    // Remove the media query listener
    removeMqlListener();
    // 设置主题为深色模式
    // Set the theme to the dark mode
    setTheme(true);
    // 广播主题切换事件，通知其他部分主题已切换为深色
    // Broadcast the theme change event to notify other parts that the theme has been switched to the dark mode
    window.dispatchEvent(new CustomEvent('themeChange', { detail: 'dark' }));
}

/**
 * 设置浅色主题。
 * Sets the light theme.
 */
export function setLightTheme() {
    // 记录尝试设置浅色主题成功的日志
    // Record the log of successful attempt to set the light theme
    add_log('TrySetTheme:Light','successfully');
    // 移除媒体查询监听器
    // Remove the media query listener
    removeMqlListener();
    // 设置主题为浅色模式
    // Set the theme to the light mode
    setTheme(false);
    // 广播主题切换事件，通知其他部分主题已切换为浅色
    // Broadcast the theme change event to notify other parts that the theme has been switched to the light mode
    window.dispatchEvent(new CustomEvent('themeChange', { detail: 'light' }));
}

/**
 * 设置自动主题模式，根据系统偏好自动切换。
 * Sets the automatic theme mode, which switches automatically according to the system preference.
 */
export function setAutoTheme() {
    // 记录尝试设置自动主题模式成功的日志
    // Record the log of successful attempt to set the automatic theme mode
    add_log('TrySetTheme:Auto','successfully');
    // 根据用户的系统偏好匹配主题模式
    // Match the theme mode according to the user's system preference
    matchMode();
    // 将主题颜色设置为 auto 并保存到设置中
    // Set the theme color to auto and save it to the settings
    setSettings('theme_color','auto')
    // 添加媒体查询的 change 事件监听器，当系统偏好改变时自动更新主题
    // Add a change event listener to the media query to automatically update the theme when the system preference changes
    mql.addEventListener('change', matchMode);
    // 广播主题切换事件，通知其他部分主题已切换为自动模式
    // Broadcast the theme change event to notify other parts that the theme has been switched to the automatic mode
    window.dispatchEvent(new CustomEvent('themeChange', { detail: 'auto' }));
}

/**
 * 快速更改主题。
 * Quickly changes the theme.
 * @param {string} str - 主题模式，'light' 或 'dark'。
 * @param {string} str - The theme mode, 'light' or 'dark'.
 */
export function queck_change_theme(str){
    if (str === 'light'){
        // 调用 setLightTheme 函数设置为浅色主题
        // Call the setLightTheme function to set the light theme
        setLightTheme();
    } else if (str === 'dark'){
        // 调用 setDarkTheme 函数设置为深色主题
        // Call the setDarkTheme function to set the dark theme
        setDarkTheme();
    }
}

/**
 * 获取当前应用的主题。
 * Gets the currently applied theme.
 * @returns {string} - 当前主题，'light' 或 'dark'。
 * @returns {string} - The current theme, 'light' or 'dark'.
 */
export function getTheme() {
    if (!body.hasAttribute('theme-mode')) {
        // 如果 body 元素没有设置主题模式，则返回 light
        // If the body element does not have a theme mode set, return light
        return 'light';
    } else {
        // 如果 body 元素设置了主题模式，则返回 dark
        // If the body element has a theme mode set, return dark
        return 'dark';
    }
}

/**
 * 获取设置中保存的主题。
 * Gets the theme saved in the settings.
 * @returns {string} - 设置中保存的主题。
 * @returns {string} - The theme saved in the settings.
 */
export function getSetTheme() {
    // 从设置中获取主题颜色
    // Get the theme color from the settings
    return getSettings("theme_color");
}
