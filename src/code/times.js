// 从 language.js 文件导入 get_T_language 函数，用于获取当前语言
// Import the get_T_language function from the language.js file to get the current language
import {get_T_language} from "./language.js";

/**
 * 获取当前时间，格式为 HH:MM:SS。
 * Get the current time in the format of HH:MM:SS.
 * @returns {string} - 当前时间的字符串表示。
 * @returns {string} - A string representation of the current time.
 */
export function get_Time(){
    // 创建一个 Date 对象，表示当前时间
    // Create a Date object representing the current time
    const now = new Date();
    // 获取小时，并确保是两位数
    // Get the hours and ensure it is two digits
    const hours = now.getHours().toString().padStart(2, '0');
    // 获取分钟，并确保是两位数
    // Get the minutes and ensure it is two digits
    const minutes = now.getMinutes().toString().padStart(2, '0');
    // 获取秒，并确保是两位数
    // Get the seconds and ensure it is two digits
    const seconds = now.getSeconds().toString().padStart(2, '0');
    // 返回格式化后的时间字符串
    // Return the formatted time string
    return `${hours}:${minutes}:${seconds}`;
}

/**
 * 获取当前日期，格式为 YYYY-MM-DD。
 * Get the current date in the format of YYYY-MM-DD.
 * @returns {string} - 当前日期的字符串表示。
 * @returns {string} - A string representation of the current date.
 */
export function get_Date(){
    // 创建一个 Date 对象，表示当前时间
    // Create a Date object representing the current time
    const now = new Date();
    // 获取年份并转换为字符串
    // Get the year and convert it to a string
    const year=now.getFullYear().toString()
    // 获取月份并转换为字符串（注意：月份从 0 开始计数）
    // Get the month and convert it to a string (Note: Months are counted from 0)
    const month=now.getMonth().toString()
    // 获取日期并转换为字符串
    // Get the day of the month and convert it to a string
    const day=now.getDate().toString()
    // 返回格式化后的日期字符串
    // Return the formatted date string
    return `${year}-${month}-${day}`
}

/**
 * 根据当前时间和语言设置获取相应的问候语。
 * Get the corresponding greeting based on the current time and language setting.
 * @returns {string} - 相应的问候语。
 * @returns {string} - The corresponding greeting.
 */
export function get_Greeting() {
    // 创建一个 Date 对象，表示当前时间
    // Create a Date object representing the current time
    const now = new Date();
    // 获取当前小时数
    // Get the current hour
    const hours = now.getHours();
    // 获取当前语言设置
    // Get the current language setting
    const language = get_T_language();

    // 定义不同语言的问候语数组
    // Define arrays of greetings in different languages
    const greetings = {
        "en-US": ["Good morning,", "Good afternoon,", "Good evening,", "Good night,"],
        "zh-CN": ["早上好，", "下午好，", "晚上好，", "夜深了，"]
    };

    // 如果当前语言不在 greetings 对象中，默认使用英语
    // If the current language is not in the greetings object, default to English
    const lang = greetings[language] ? language : "en-US";

    // 根据当前小时数返回相应的问候语
    // Return the corresponding greeting based on the current hour
    if (hours >= 5 && hours < 12) {
        return greetings[lang][0];
    } else if (hours >= 12 && hours < 17) {
        return greetings[lang][1];
    } else if (hours >= 17 && hours < 21) {
        return greetings[lang][2];
    } else {
        return greetings[lang][3];
    }
}
