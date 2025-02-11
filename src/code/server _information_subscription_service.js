import { io } from 'socket.io-client';
import { getServer } from "./get_server.js";
import { add_log } from "./log.js";
import { getSettings } from "./Settings.js";
import { send_notify } from "./SystemToast.jsx";
import { set_server_info } from "./get_server_info.js";
import { v4 as uuidv4 } from "uuid";

const SOCKET_TIMEOUT = 5000;  // 设置超时阈值，单位为毫秒

// 用于创建并管理 socket 连接的函数
function createSocketConnection(uuid, onConnect, onMessage,onSysinfo, onRegister) {
    const socket = io(getServer(), { timeout: SOCKET_TIMEOUT });

    socket.emit('register', { uuid });

    socket.on('connect', () => {
        console.log('Connected to server');
        onConnect && onConnect(socket);  // 可传递自定义连接成功的回调
    });

    socket.on('new_message', (data) => {
        add_log('收到服务器消息', 'successfully', data.message);
        send_notify('Server', data.message);
        onMessage && onMessage(data);  // 可传递自定义消息处理回调
    });

    socket.on('sysinfo_update', (data) => {
        const parsedData = JSON.parse(data);
        onSysinfo && onSysinfo(parsedData);
    });

    socket.on('register', (data) => {
        if (data.message === '客户端注册成功') {
            add_log('已与服务器建立连接', 'successfully');
        } else {
            add_log('注册失败', 'error', data.message);
        }
        onRegister && onRegister(data);  // 可传递自定义注册事件回调
    });

    socket.on('connect_error', (error) => {
        console.log('Connection error:', error);
        add_log('连接服务器失败', 'error', error.message);
    });

    socket.on('connect_timeout', () => {
        console.log('Connection timed out');
        add_log('连接超时，请稍后重试', 'error');
    });

    socket.on('error', (err) => {
        console.error('Socket error:', err);
        add_log('网络错误', 'error', err.message);
    });

    // 页面卸载或组件销毁时取消订阅
    window.addEventListener('beforeunload', () => {
        socket.off();  // 取消所有事件监听器
        console.log('Disconnected from server');
    });

    return socket;  // 返回 socket 实例以供其他用途
}

export function reflash_sysInfo() {
    const uuid = uuidv4();
    createSocketConnection(
        uuid,
        null, // 连接成功后的回调
        null, // 消息回调
        null  // 注册回调
    );
}

// 订阅服务器通知
export function subscribeToServerNotifications() {
    const uuid = getSettings('uuid');

    createSocketConnection(
        uuid,
        (socket) => {
            add_log('已与服务器建立连接', 'successfully');
        },
        (data) => {
            // 处理服务器通知
            add_log('收到服务器消息', 'successfully', data.message);
            send_notify('Server Notify', data.message);
        },
        (data)=>{
            set_server_info(data);
        },
        (data) => {
            if (data.message === '客户端注册成功') {
                add_log('注册成功', 'successfully');
            } else {
                add_log('注册失败', 'error', data.message);
            }
        }
    );
}
