import {io} from 'socket.io-client';
import {getServer} from "./get_server.js";
import {add_log} from "./log.js";
import {getSettings} from "./Settings.js";
import {send_notify} from "./SystemToast.jsx";
import {set_server_info} from "./get_server_info.js";
import {v4 as uuidv4} from "uuid";

const SOCKET_TIMEOUT = 5000;  // 设置超时阈值，单位为毫秒

// 用于创建并管理 socket 连接的函数
function createSocketConnection(uuid, onConnect, onMessage, onSysinfo, onRegister) {
    // 配置 Socket.IO 选项
    const socketOptions = {
        timeout: SOCKET_TIMEOUT,
        transports: ['websocket'],
        secure: getServer().startsWith('https'),
        rejectUnauthorized: false, // 允许自签名证书
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000
    };

    const socket = io(getServer(), socketOptions);

    // 重连事件处理
    socket.on('reconnect_attempt', (attemptNumber) => {
        add_log('正在尝试重新连接', 'warning', `第 ${attemptNumber} 次重试`);
    });

    socket.on('reconnect', (attemptNumber) => {
        add_log('重新连接成功', 'successfully', `在第 ${attemptNumber} 次尝试后`);
        // 重新注册
        socket.emit('register', { uuid });
    });

    // 原有的事件处理
    socket.emit('register', { uuid });

    socket.on('connect', () => {
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

    // 优化错误处理
    socket.on('connect_error', (error) => {
        const protocol = getServer().startsWith('https') ? 'HTTPS' : 'HTTP';
        add_log(`${protocol}连接失败`, 'error', `${error.message}`);
        
        // 如果是SSL相关错误，给出更明确的提示
        if (error.message.includes('SSL') || error.message.includes('certificate')) {
            send_notify('连接错误', '服务器SSL证书验证失败，请检查证书配置');
        }
    });

    // 优化清理逻辑
    const cleanup = () => {
        socket.off();
        socket.close();
    };

    window.addEventListener('beforeunload', cleanup);

    // 返回清理函数，方便在组件卸载时调用
    return {
        socket,
        cleanup
    };
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
        () => {
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
