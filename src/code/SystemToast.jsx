// 尝试获取权限，返回布尔值
import {add_log} from "./log.js";
import {Notification as SemiNotification} from '@douyinfe/semi-ui'; // 给 semi-ui 的 Notification 添加别名
import {get_Time} from "./times.js";

let message_list=[]
// message_list=[{id=length+1,time=get_Time(),title="",content:widget}]
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
        new Notification(title, {
            body: message,
            icon: icon // 自定义图标路径
        });
        return true
    } else {
        console.log("没有权限发送通知。");
        return false
    }
}

export function send_notify(title, content,customIcon=null, sendtime = 3, type = 'info', theme = 'normal') {
    function check_widget(){
        let widget
        if (typeof content === 'string'){
            widget = <span>{content}</span>;
        }else{
            widget = content;
        }
        return widget;
    }
    content=check_widget()
    let opts = {
        title: title,
        position:'top',
        content: content,
        duration: sendtime,
        theme: theme,
    };
    // new_notify=[{id=length+1,time=get_Time(),title="",content:widget}]
    const new_notify={
        id:message_list.length+1,
        time:get_Time(),
        title:title,
        content:content,
    }
    console.log(new_notify);
    switch (type) {
        case 'success':
            SemiNotification.success({...opts, icon: customIcon});
            break;
        case 'info':
            SemiNotification.info({...opts, icon: customIcon});
            break;
        case 'warning':
            SemiNotification.warning({...opts, icon: customIcon});
            break;
        case 'error':
            SemiNotification.error({...opts, icon: customIcon});
            break;
    }
    message_list.push(new_notify);
    return true;
}
export function get_notify_list(){
    return message_list;
}
export function clear_notify(num = 0) {
    if (num === 0) {
        // 清空所有通知
        message_list.length = 0;
    } else {
        // 删除指定id的通知，id从1开始
        const index = num - 1;  // 转换为数组索引（从 0 开始）
        if (index >= 0 && index < message_list.length) {
            message_list.splice(index, 1);  // 删除对应索引的元素
        }
    }
    return true
}