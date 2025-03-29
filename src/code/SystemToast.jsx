// 尝试获取权限，返回布尔值
// Try to get permission and return a boolean value
import {add_log} from "./log.js";
// 给 semi-ui 的 Notification 添加别名
// Add an alias to the Notification component of semi-ui
import {Notification as SemiNotification} from '@douyinfe/semi-ui';
import {get_Time} from "./times.js";

// 消息列表，用于存储通知信息
// Message list for storing notification information
let message_list = [];
// 存储每种通知内容的上一次发送时间，用于限制发送频率
// Store the last send time of each notification content to limit the sending frequency
const lastSendTimeMap = {};
// 通知 ID 计数器
// Notification ID counter
let id = 1;
// 通知发送频率限制，单位为毫秒
// Notification sending frequency limit, in milliseconds
const notification_rate_limit = 5 * 1000;
// message_list=[{id=id+1,time=get_Time(),title="",content:widget}]

/**
 * 获取系统通知权限。
 * Get system notification permissions.
 * @returns {boolean} - 如果用户已授权则返回 true，否则返回 false。
 * @returns {boolean} - Returns true if the user is authorized, otherwise false.
 */
function getSystemToastPermissions() {
    // 检查浏览器是否支持系统通知
    // Check if the browser supports system notifications
    if (!("Notification" in window)) {
        // 记录不支持的日志
        // Record the log of unsupported notifications
        add_log('getSystemToastPermissions', 'warning', 'Your browser does not support system notifications');
        return false;
    }

    // 检查用户是否已经授权
    // Check if the user has already authorized
    if (Notification.permission === "granted") {
        // 记录授权成功的日志
        // Record the log of successful authorization
        add_log('getSystemToastPermissions', 'successfully', 'The user has been authorized to be notified by the system');
        return true;
    } else if (Notification.permission !== 'denied') {
        // 用户尚未授权，请求权限
        // The user has not authorized yet, request permission
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                // 记录授权成功的日志
                // Record the log of successful authorization
                add_log('getSystemToastPermissions', 'successfully', 'The user has been authorized to be notified by the system');
            } else {
                // 记录权限被拒绝的日志
                // Record the log of permission denial
                add_log('getSystemToastPermissions', 'warning', 'Notification permission denied');
            }
        });
        // 由于权限请求是异步的，这里返回 false
        // Since the permission request is asynchronous, return false here
        return false;
    } else {
        // 记录权限被拒绝的日志
        // Record the log of permission denial
        add_log('getSystemToastPermissions', 'warning', 'Notification permission denied');
        return false;
    }
}

/**
 * 发送系统通知。
 * Send a system notification.
 * @param {string} title - 通知标题。
 * @param {string} message - 通知内容。
 * @param {string} [icon='logo.svg'] - 通知图标。
 * @returns {boolean} - 如果发送成功则返回 true，否则返回 false。
 * @returns {boolean} - Returns true if the notification is sent successfully, otherwise false.
 */
export function sendSystemToast(title, message, icon = 'logo.svg') {
    // 检查是否有系统通知权限
    // Check if there is system notification permission
    if (getSystemToastPermissions()) {
        // 创建并发送通知
        // Create and send a notification
        new Notification(title, { body: message, icon: icon });
        return true;
    } else {
        return false;
    }
}

/**
 * 发送 Semi UI 通知，并加入消息队列限制。
 * Send a Semi UI notification with message queue limit.
 * @param {string} [title="title"] - 通知标题。
 * @param {string} [content=""] - 通知内容。
 * @param {ReactNode} [customIcon = null] - 自定义图标。
 * @param {number} [sendtime = 3] - 通知显示时长。
 * @param {string} [type = 'info'] - 通知类型。
 * @param {boolean} [CountInHistory = true] - 是否计入历史记录。
 * @param {string} [theme = 'normal'] - 通知主题。
 * @param {string} [notify_id=null] - 通知 ID。
 * @returns {string|null} - 通知 ID，如果发送失败则返回 null。
 * @returns {string|null} - Notification ID, returns null if the sending fails.
 */
export function send_notify(
    title = "title",
    content = "",
    customIcon = null,
    sendtime = 3,
    type = 'info',
    CountInHistory = true,
    theme = 'normal',
    notify_id = null
) {
    // 获取当前时间
    // Get the current time
    const now = Date.now();
    // 获取该内容上一次的发送时间
    // Get the last send time of this content
    const lastSendTime = lastSendTimeMap[content];
    let Notify_id;
    // 检查是否距离上一次发送时间超过 5 分钟
    // Check if it has been more than 5 minutes since the last send
    if (lastSendTime && now - lastSendTime < notification_rate_limit && notify_id === null) {
        return false;
    }
    // 通知 ID 自增
    // Increment the notification ID
    id = id + 1;
    // 创建新的通知对象
    // Create a new notification object
    const new_notify = {
        id: id,
        time: get_Time(),
        title: title,
        content: content,
        type: type === 'error' ? 'danger' : type
    };

    // 更新该内容的上一次发送时间
    // Update the last send time of this content
    lastSendTimeMap[content] = now;

    // 配置通知选项
    // Configure notification options
    let opts = {
        title: title,
        position: 'top',
        content: content,
        duration: sendtime,
        theme: theme,
        id: notify_id
    };

    // 根据通知类型调用相应的方法
    // Call the corresponding method according to the notification type
    switch (type) {
        case 'success':
            Notify_id = SemiNotification.success({ ...opts, icon: customIcon });
            break;
        case 'info':
            Notify_id = SemiNotification.info({ ...opts, icon: customIcon });
            break;
        case 'warning':
            Notify_id = SemiNotification.warning({ ...opts, icon: customIcon });
            break;
        case 'error':
            Notify_id = SemiNotification.error({ ...opts, icon: customIcon });
            break;
    }
    // 如果需要计入历史记录，则添加到消息列表
    // If it needs to be counted in the history, add it to the message list
    if (CountInHistory) {
        message_list.push(new_notify);
    }

    // 通知订阅者通知列表更新
    // Notify subscribers that the notification list has been updated
    notifySubscribers();

    return Notify_id;
}

/**
 * 获取通知列表。
 * Get the notification list.
 * @returns {Array} - 通知列表。
 * @returns {Array} - Notification list.
 */
export function get_notify_list() {
    return message_list;
}

/**
 * 清除通知。
 * Clear notifications.
 * @param {number} [id = 0] - 要清除的通知 ID，0 表示清除所有通知。
 * @returns {boolean} - 清除成功返回 true。
 * @returns {boolean} - Returns true if the clearing is successful.
 */
export function clear_notify(id = 0) {
    if (id === 0) {
        // 清空所有通知
        // Clear all notifications
        message_list.length = 0;
    } else {
        // 过滤掉指定 ID 的通知
        // Filter out the notification with the specified ID
        message_list = message_list.filter(notify => notify.id !== id);
    }
    // 清除后通知所有订阅者
    // Notify all subscribers after clearing
    notifySubscribers();
    return true;
}

// 订阅者列表
// Subscriber list
const subscribers = [];

/**
 * 订阅通知更新。
 * Subscribe to notification updates.
 * @param {function} callback - 回调函数。
 */
export function subscribeToNotifications(callback) {
    // 将回调函数添加到订阅者列表
    // Add the callback function to the subscriber list
    subscribers.push(callback);
}

/**
 * 取消订阅通知更新。
 * Unsubscribe from notification updates.
 * @param {function} callback - 要取消的回调函数。
 */
export function unsubscribeFromNotifications(callback) {
    // 查找回调函数在订阅者列表中的索引
    // Find the index of the callback function in the subscriber list
    const index = subscribers.indexOf(callback);
    if (index !== -1) {
        // 从订阅者列表中移除该回调函数
        // Remove the callback function from the subscriber list
        subscribers.splice(index, 1);
    }
}

/**
 * 通知订阅者通知列表更新。
 * Notify subscribers that the notification list has been updated.
 */
function notifySubscribers() {
    // 遍历订阅者列表，调用每个回调函数
    // Iterate through the subscriber list and call each callback function
    subscribers.forEach(callback => callback(message_list));
}
