// 尝试获取权限，返回布尔值
import { add_log } from "./log.js";
import { Notification as SemiNotification } from '@douyinfe/semi-ui'; // 给 semi-ui 的 Notification 添加别名
import { get_Time } from "./times.js";

let message_list = [];
// 存储每种通知内容的上一次发送时间，用于限制发送频率
const lastSendTimeMap = {};
let id=1
const FIVE_MINUTES_IN_MS = 15 * 1000;
// message_list=[{id=id+1,time=get_Time(),title="",content:widget}]
function getSystemToastPermissions() {
    if (!("Notification" in window)) {
        add_log('getSystemToastPermissions', 'warning', '您的浏览器不支持系统通知');
        console.log("您的浏览器不支持系统通知。");
        return false;
    }

    if (Notification.permission === "granted") {
        // 用户已经授权
        add_log('getSystemToastPermissions', 'successfully', '用户已授权系统通知权限');
        return true;
    } else if (Notification.permission !== 'denied') {
        // 用户尚未授权，请求权限
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                console.log("通知权限已获得。");
                add_log('getSystemToastPermissions', 'successfully', '用户已授权系统通知权限');
            } else {
                console.log("通知权限被拒绝。");
                add_log('getSystemToastPermissions', 'warning', '通知权限被拒绝');
            }
        });
        return false; // 由于权限请求是异步的，这里返回false
    } else {
        console.log("通知权限已被拒绝。");
        add_log('getSystemToastPermissions', 'warning', '通知权限被拒绝');
        return false;
    }
}

// 发送系统通知的函数
export function sendSystemToast(title, message, icon = 'CCRS.png') {
    if (getSystemToastPermissions()) {
        new Notification(title, { body: message, icon: icon });
        return true;
    } else {
        console.log("没有权限发送通知。");
        return false;
    }
}

// 发送 Semi UI 通知，并加入消息队列限制
export function send_notify(
    title,
    content,
    customIcon = null,
    sendtime = 3,
    type = 'info',
    CountInHistory = true,
    theme = 'normal'
) {
    const now = Date.now();
    // 获取该内容上一次的发送时间
    const lastSendTime = lastSendTimeMap[content];

    // 检查是否距离上一次发送时间超过 5 分钟
    if (lastSendTime && now - lastSendTime < FIVE_MINUTES_IN_MS) {
        console.log(`内容为 "${content}" 的通知发送频率过快，需等待 ${Math.ceil((FIVE_MINUTES_IN_MS - (now - lastSendTime)) / 1000)} 秒后再试。`);
        return false;
    }
    id=id+1
    // 如果没有超过限制，继续发送通知
    const new_notify = {
        id: id,
        time: get_Time(),
        title: title,
        content: content,
        type: type === 'error' ? 'danger' : type
    };

    // 更新该内容的上一次发送时间
    lastSendTimeMap[content] = now;
    console.log(new_notify);

    let opts = {
        title: title,
        position: 'top',
        content: content,
        duration: sendtime,
        theme: theme,
    };

    switch (type) {
        case 'success':
            SemiNotification.success({ ...opts, icon: customIcon });
            break;
        case 'info':
            SemiNotification.info({ ...opts, icon: customIcon });
            break;
        case 'warning':
            SemiNotification.warning({ ...opts, icon: customIcon });
            break;
        case 'error':
            SemiNotification.error({ ...opts, icon: customIcon });
            break;
    }
    if (CountInHistory) {
        message_list.push(new_notify);
    }

    // 通知订阅者通知列表更新
    notifySubscribers();

    return true;
}

export function get_notify_list() {
    return message_list;
}

// 清除通知
export function clear_notify(id = 0) {
    if (id === 0) {
        // 清空所有通知
        message_list.length = 0;
    } else {
        message_list = message_list.filter(notify => notify.id !== id);
    }
    console.log(id)
    notifySubscribers(); // 清除后通知所有订阅者
    return true;
}

// 订阅者管理
const subscribers = [];

export function subscribeToNotifications(callback) {
    subscribers.push(callback);
}

export function unsubscribeFromNotifications(callback) {
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
        subscribers.splice(index, 1);
    }
}

// 通知更新时触发订阅者
function notifySubscribers() {
    subscribers.forEach(callback => callback(message_list));
}