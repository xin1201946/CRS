// 从 log.js 文件导入 add_log 函数，用于记录日志
// Import the add_log function from the log.js file to record logs
import {add_log} from "./log.js";
// 从 server_api_settings.js 文件导入 getAPI 函数，用于获取 API 路径
// Import the getAPI function from the server_api_settings.js file to get the API path
import {getAPI} from "./server_api_settings.js";
// 从 Settings.js 文件导入 getSettings 函数，用于获取设置信息
// Import the getSettings function from the Settings.js file to get the settings information
import {getSettings} from "./Settings.js";

/**
 * 检查与服务器的网络连接。
 * Checks the network connection to the server.
 * @param {string} [serverIP=getSettings('server_ip')] - 服务器的 IP 地址，默认为从设置中获取。
 * @param {string} [serverIP=getSettings('server_ip')] - The IP address of the server, defaulting to the value obtained from the settings.
 * @returns {boolean} - 如果连接成功返回 true，否则返回 false。
 * @returns {boolean} - Returns true if the connection is successful, otherwise false.
 */
export default async function checkNetwork(serverIP = getSettings('server_ip')) {
    // 存储检查结果的变量
    // Variable to store the check result
    let result;
    try {
        // 发送一个测试请求到服务器
        // Send a test request to the server
        const response = await fetch(serverIP + getAPI('test'));
        // 判断响应状态是否为 200，将结果赋值给 result
        // Determine if the response status is 200 and assign the result to result
        result = (response.status === 200);
        // 记录检查服务器连接的日志，结果为成功
        // Record the log of checking the server connection, with the result being successful
        add_log('checkServerConnect', 'successfully', (response.status === 200).toString());
        // eslint-disable-next-line no-unused-vars
    } catch (error) {
        // 记录检查服务器连接的日志，结果为错误
        // Record the log of checking the server connection, with the result being an error
        add_log('checkServerConnect', 'error', 'Server not found');
        // 连接失败，将 result 设为 false
        // Connection failed, set result to false
        result = false;
    }
    // 返回检查结果
    // Return the check result
    return result;
}
