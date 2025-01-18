import { io } from 'socket.io-client';
import { getServer } from "./get_server.js";
import { add_log } from "./log.js";
import { getSettings } from "./Settings.js";
import {send_notify} from "./SystemToast.jsx";

// 订阅服务器通知
export  function subscribeToServerNotifications() {
    const uuid = getSettings('uuid')
    const socket = io(getServer());

    // 监听服务器推送的通知消息
    socket.on('new_message', (data) => {
        add_log('收到服务器消息', 'successfully', data.message);
        send_notify('Server Notify',data.message);
    });

    // 监听注册成功事件
    socket.on('register', (data) => {
        if (data.message === '客户端注册成功') {
            add_log('已与服务器建立连接', 'successfully');
        } else {
            add_log('注册失败', 'error', data.message);
        }
    });

    // 发送注册请求
    socket.emit('register', { uuid });
}