// 尝试获取权限，返回布尔值
import {add_log} from "./log.js";

function getSystemToastPermissions() {
    if (!("Notification" in window)) {
        add_log('getSystemToastPermissions','warning','您的浏览器不支持系统通知')
        console.log("您的浏览器不支持系统通知。");
        return false;
    }

    if (Notification.permission === "granted") {
        // 用户已经授权
        add_log('getSystemToastPermissions','successfully','用户已授权系统通知权限')
        return true;
    } else if (Notification.permission !== 'denied') {
        // 用户尚未授权，请求权限
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("通知权限已获得。");
                add_log('getSystemToastPermissions','successfully','用户已授权系统通知权限')
            } else {
                console.log("通知权限被拒绝。");
                add_log('getSystemToastPermissions','warning','通知权限被拒绝')
            }
        });
        return false; // 由于权限请求是异步的，这里返回false
    } else {
        console.log("通知权限已被拒绝。");
        add_log('getSystemToastPermissions','warning','通知权限被拒绝')
        return false;
    }
}

// 发送系统通知
export function sendSystemToast(title, message, icon = 'CCRS.png') {
    // 先调用getSystemToastPermissions
    if (getSystemToastPermissions()) {
        // 如果权限获取成功，发送通知
        var notification = new Notification(title, {
            body: message,
            icon: icon // 自定义图标路径
        });
        return true
    } else {
        console.log("没有权限发送通知。");
        return false
    }
}