import {add_log} from "./log.js";

export function detectDevice() {
    const userAgent = navigator.userAgent;
    add_log('Get User Agent','successfully',userAgent);
    // 转换为小写以便于匹配
    const ua = userAgent.toLowerCase();

    // 检测移动设备
    const mobileKeywords = [
        'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'windows phone'
    ];

    const isMobile = mobileKeywords.some(keyword => ua.includes(keyword));
    add_log('Get User Device','successfully',isMobile ? 'Phone' : 'PC/Tablet');
    return isMobile ? 'Phone' : 'PC';
}