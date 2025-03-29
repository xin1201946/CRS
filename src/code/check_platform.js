// 从 log.js 文件导入 add_log 函数
// Import the add_log function from the log.js file
import {add_log} from "./log.js";

/**
 * 检测当前设备是移动设备还是桌面设备。
 * Detects whether the current device is a mobile device or a desktop device.
 * @returns {string} 返回设备类型，'Phone' 表示移动设备，'PC' 表示桌面设备。
 * @returns {string} Returns the device type, 'Phone' for mobile devices and 'PC' for desktop devices.
 */
export function detectDevice() {
    // 获取浏览器的用户代理字符串
    // Get the browser's user agent string
    const userAgent = navigator.userAgent;
    // 记录成功获取用户代理字符串
    // Record the successful retrieval of the user agent string
    add_log('Get User Agent','successfully',userAgent);
    // 将用户代理字符串转换为小写，方便后续匹配
    // Convert the user agent string to lowercase for easier matching later
    const ua = userAgent.toLowerCase();

    // 定义用于检测移动设备的关键字列表
    // Define a list of keywords used to detect mobile devices
    const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'
    ];

    // 检查用户代理字符串中是否包含任何移动设备关键字
    // Check if the user agent string contains any of the mobile device keywords
    const isMobile = mobileKeywords.some(keyword => ua.includes(keyword));
    // 记录成功获取用户设备类型
    // Record the successful retrieval of the user device type
    add_log('Get User Device','successfully',isMobile ? 'Phone' : 'PC/Tablet');
    // 根据检测结果返回设备类型
    // Return the device type based on the detection result
    return isMobile ? 'Phone' : 'PC';
}
