// 尝试获取权限，返回布尔值
import {add_log} from "./log.js";
import {Notification as SemiNotification} from '@douyinfe/semi-ui'; // 给 semi-ui 的 Notification 添加别名
import {get_Time} from "./times.js";

let message_list = [];
// 存储每种通知内容的上一次发送时间，用于限制发送频率
const lastSendTimeMap = {};
let id=1
const FIVE_MINUTES_IN_MS = 15 * 1000;
// message_list=[{id=id+1,time=get_Time(),title="",content:widget}]
function getSystemToastPermissions() {
    if (!("Notification" in window)) {
        add_log('getSystemToastPermissions', 'warning', '您的浏览器不支持系统通知');
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
                add_log('getSystemToastPermissions', 'successfully', '用户已授权系统通知权限');
            } else {
                add_log('getSystemToastPermissions', 'warning', '通知权限被拒绝');
            }
        });
        return false; // 由于权限请求是异步的，这里返回false
    } else {
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
        return false;
    }
}

// 发送 Semi UI 通知，并加入消息队列限制
export function send_notify(
    title="title",
    content="",
    customIcon = null,
    sendtime = 3,
    type = 'info',
    CountInHistory = true,
    theme = 'normal',
    notify_id=null
) {
    const now = Date.now();
    // 获取该内容上一次的发送时间
    const lastSendTime = lastSendTimeMap[content];
    let Notify_id;
    // 检查是否距离上一次发送时间超过 5 分钟
    if (lastSendTime && now - lastSendTime < FIVE_MINUTES_IN_MS && notify_id===null) {
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

    let opts = {
        title: title,
        position: 'top',
        content: content,
        duration: sendtime,
        theme: theme,
        id:notify_id
    };

    switch (type) {
        case 'success':
            Notify_id=SemiNotification.success({ ...opts, icon: customIcon });
            break;
        case 'info':
            Notify_id=SemiNotification.info({ ...opts, icon: customIcon});
            break;
        case 'warning':
            Notify_id=SemiNotification.warning({ ...opts, icon: customIcon});
            break;
        case 'error':
            Notify_id=SemiNotification.error({ ...opts, icon: customIcon});
            break;
    }
    if (CountInHistory) {
        message_list.push(new_notify);
    }

    // 通知订阅者通知列表更新
    notifySubscribers();

    return Notify_id;
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