// 从 times.js 文件导入 get_Time 函数
// Import the get_Time function from the times.js file
import {get_Time} from "./times.js";
// 从 get_server.js 文件导入 getServer 函数
// Import the getServer function from the get_server.js file
import {getServer} from "./get_server.js";
// 从 browserCheck.js 文件导入 check_browser 函数
// Import the check_browser function from the browserCheck.js file
import {check_browser} from "./browserCheck.js";
// 从 check_platform.js 文件导入 detectDevice 函数
// Import the detectDevice function from the check_platform.js file
import {detectDevice} from "./check_platform.js";
// 从 cookieStorage.js 文件导入 getAllCookies 函数
// Import the getAllCookies function from the cookieStorage.js file
import {getAllCookies} from "./cookieStorage.js";
// 从 Settings.js 文件导入 getAllLocalStorage 函数
// Import the getAllLocalStorage function from the Settings.js file
import {getAllLocalStorage} from "./Settings.js";

// 日志数组，初始包含一条创建事件记录器的日志
// Log array, initially containing a log for creating an event recorder
let logs = [
    {"key":1,"time":get_Time(),'event':'Create event recorder','result':'successfully','comment':'' ,'color':'default'}
]; // successfully, warning , error
// 已展示事件数组，用于避免重复展示日志
// Array of displayed events, used to avoid duplicate log display
let displayedEvents=[];

/**
 * 添加本地日志记录。
 * Add a local log record.
 * @param {string} event - 日志事件名称。
 * @param {string} event - The name of the log event.
 * @param {string} [result='Null'] - 事件结果，默认为 'Null'。
 * @param {string} [result='Null'] - The result of the event, default is 'Null'.
 * @param {string} [Comment=''] - 事件备注，默认为空字符串。
 * @param {string} [Comment=''] - The remarks of the event, default is an empty string.
 */
export function add_log(event,result='Null',Comment=''){
    // 确保 logs 是数组
    // Ensure that logs is an array
    if (!Array.isArray(logs)) {
        logs = [];
    }
    // 创建新的日志对象
    // Create a new log object
    const newLog = {
        "key":logs.length+1,
        "time": get_Time(),
        "event": event.toLowerCase(),
        "result":result,
        "comment":Comment,
        // 根据结果设置日志颜色
        // Set the log color according to the result
        "color": result === "successfully" ? "green" : result === "warning" ?"yellow":"red"
    };
    // 将新日志添加到 logs 数组
    // Add the new log to the logs array
    logs.push(newLog);
}

/**
 * 添加服务器日志记录。
 * Add a server log record.
 * @param {string} timestamp - 日志时间戳。
 * @param {string} timestamp - The timestamp of the log.
 * @param {string} event - 日志事件名称。
 * @param {string} event - The name of the log event.
 * @param {string} [result='Null'] - 事件结果，默认为 'Null'。
 * @param {string} [result='Null'] - The result of the event, default is 'Null'.
 * @param {string} [remark=''] - 事件备注，默认为空字符串。
 * @param {string} [remark=''] - The remarks of the event, default is an empty string.
 */
function add_Server_log(timestamp,event,result='Null',remark=''){
    // 确保 logs 是数组
    // Ensure that logs is an array
    if (!Array.isArray(logs)) {
        logs = [];
    }
    // 创建新的日志对象
    // Create a new log object
    const newLog = {
        "key":logs.length+1,
        "time": timestamp,
        "event": event,
        "result":result,
        "comment":remark,
        // 根据结果设置日志颜色
        // Set the log color according to the result
        "color": result === "successfully" ? "green" : result === "warning" ?"yellow":"red"
    };
    // 将新日志添加到 logs 数组
    // Add the new log to the logs array
    logs.push(newLog);
}

/**
 * 清空日志记录。
 * Clear all log records.
 */
export function clear_log(){
    // 清空 logs 数组
    // Clear the logs array
    logs.length = 0;
    // 添加一条清空所有日志的成功记录
    // Add a successful record of clearing all logs
    add_Server_log(get_Time(),'Clear_ALL_Logs','successfully');
}

/**
 * 从服务器获取日志记录。
 * Get log records from the server.
 */
function get_server_logs() {
    // 发送请求获取服务器日志
    // Send a request to get server logs
    fetch(getServer() + '/getlogs')
        // 解析响应为 JSON 数据
        // Parse the response as JSON data
       .then(res => res.json())
       .then(logs => {
            // 遍历服务器返回的日志
            // Iterate through the logs returned by the server
            logs.forEach(log => {
                const { timestamp, event, result, remark } = log;
                // 判断事件是否已经展示过，避免重复
                // Check if the event has been displayed to avoid duplicates
                if (!displayedEvents.includes(event)) {
                    // 调用已有的日志展示方法
                    // Call the existing log display method
                    add_Server_log(timestamp, event, result, remark);
                    // 添加该事件到已展示事件列表
                    // Add the event to the list of displayed events
                    displayedEvents.push(event);
                }
            });
        })
       .catch(error => {
            // 添加获取服务器日志错误的记录
            // Add a record of the error in getting server logs
            add_log('Get Server Logs Error','error',error)
        });
}

/**
 * 获取所有日志记录。
 * Get all log records.
 * @returns {Array} 包含所有日志的数组。
 * @returns {Array} An array containing all logs.
 */
export function get_logs(){
    // 从服务器获取日志
    // Get logs from the server
    get_server_logs()
    // 返回所有日志
    // Return all logs
    return logs
}

/**
 * 获取所有错误日志记录。
 * Get all error log records.
 * @returns {Array} 包含所有错误日志的数组。
 * @returns {Array} An array containing all error logs.
 */
export function get_error_logs() {
    // 过滤出结果为 'error' 的日志
    // Filter out logs with the result of 'error'
    return logs.filter(log => log.result === 'error');
}

/**
 * 获取所有警告日志记录。
 * Get all warning log records.
 * @returns {Array} 包含所有警告日志的数组。
 * @returns {Array} An array containing all warning logs.
 */
export function get_warning_logs() {
    // 过滤出结果为 'warning' 的日志
    // Filter out logs with the result of 'warning'
    return logs.filter(log => log.result === 'warning');
}

/**
 * 获取所有成功日志记录。
 * Get all successful log records.
 * @returns {Array} 包含所有成功日志的数组。
 * @returns {Array} An array containing all successful logs.
 */
export function get_successfully_logs() {
    // 过滤出结果为 'successfully' 的日志
    // Filter out logs with the result of 'successfully'
    return logs.filter(log => log.result === 'successfully');
}

/**
 * 将日志保存为 TXT 文件并下载。
 * Save logs as a TXT file and download it.
 */
export function saveLogsToTxt() {
    /**
     * 格式化 cookies 信息。
     * Format cookie information.
     * @returns {string} 格式化后的 cookies 信息。
     * @returns {string} Formatted cookie information.
     */
    function formatCookies() {
        // 获取所有 cookies
        // Get all cookies
        let cookies = getAllCookies();
        // 如果没有 cookies，返回提示信息
        // If there are no cookies, return a prompt message
        if (Object.keys(cookies).length === 0) return "No cookies found";
        // 初始化格式化后的字符串
        // Initialize the formatted string
        let formatted = "";
        // 遍历 cookies 并格式化
        // Iterate through cookies and format them
        for (const [key, value] of Object.entries(cookies)) {
            formatted += `${key}: ${value}\n`;
        }
        // 返回格式化后的字符串
        // Return the formatted string
        return formatted.trim();
    }
    // 构建日志文件内容
    // Build the content of the log file
    let content = "CCRS LOG\n";
    content += "======Base Information=====\n";
    content += "Tips:Basic information Lists the user's browser, UA, and device type information\n";
    content += `Create Time: ${get_Time()}\n`;
    content += `Browser: ${check_browser()}\n`;
    content += `Device Type: ${detectDevice()}\n`;
    content += `UA: ${navigator.userAgent}\n\n`;

    content += "========Cookies=========\n";
    content += "Tips:\n";
    content += "The Cookies section records snapshots of cookies  information when users download logs\n";
    content += `Cookies:\n${formatCookies()}\n\n`;

    content += "========Storage=========\n";
    content += "Tips:\n";
    content += "The Storage section records snapshots of  application storage information when users download logs\n";
    // 获取所有本地存储数据
    // Get all local storage data
    const localStorageData = getAllLocalStorage();
    content += `Storages:\n${localStorageData}\n\n`;

    content += "=========LOGS==========\n";
    content += "Tips:Logs lists all logs generated by the user from the start of the program to the user's download log\n";
    content += "Log:\n";
    content += "Time\tEvent\tResult\tComment\n";

    // 遍历日志并添加到文件内容
    // Iterate through logs and add them to the file content
    logs.forEach(log => {
        content += `${log.time}\t${log.event}\t${log.result}\t${log.comment}\n`;
    });

    // 生成并下载日志文件
    // Generate and download the log file
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "CCRS_LOG.txt";
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

/**
 * 获取系统状态信息。
 * Get system status information.
 * @returns {string} 系统状态信息。
 * @returns {string} System status information.
 */
export function get_SystemStatus(){
    // 检查是否有错误日志
    // Check if there are any error logs
    if (get_error_logs().length === 0) {
        return 'The system is running normally';
    } else {
        return 'Detected ' + get_error_logs().length + ' error messages';
    }
}
