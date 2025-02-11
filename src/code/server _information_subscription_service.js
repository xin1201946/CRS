import { io } from 'socket.io-client';
import { getServer } from "./get_server.js";
import { add_log } from "./log.js";
import {getSettings} from "./Settings.js";
import {send_notify} from "./SystemToast.jsx";
import {set_server_info} from "./get_server_info.js";
import {v4 as uuidv4} from "uuid";

export function reflash_sysInfo(){
    const socket = io(getServer());
    const uuid = uuidv4();
    socket.emit('register', { uuid });
    socket.on('sysinfo_update', (data) => {
        const parsedData = JSON.parse(data);  // 将 JSON 字符串解析为对象
        set_server_info(parsedData);  // 更新全局变量
    });
}
// 订阅服务器通知
export  function subscribeToServerNotifications(replay=false) {
    const uuid = getSettings('uuid')
    const socket = io(getServer());
    // 发送注册请求
    socket.emit('register', { uuid });
    // 监听服务器推送的通知消息
    socket.on('new_message', (data) => {
        add_log('收到服务器消息', 'successfully', data.message);
        if (!replay) {
            send_notify('Server Notify',data.message);
        }
    });

    socket.on('sysinfo_update', (data) => {
        const parsedData = JSON.parse(data);  // 将 JSON 字符串解析为对象
        set_server_info(parsedData);  // 更新全局变量
    });

    // 监听注册成功事件
    socket.on('register', (data) => {
        if (data.message === '客户端注册成功') {
            add_log('已与服务器建立连接', 'successfully');
        } else {
            add_log('注册失败', 'error', data.message);
        }
    });
// 页面卸载或组件销毁时取消订阅
    window.addEventListener('beforeunload', () => {
        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });
        socket.off('new_message');  // 取消订阅新消息事件
        socket.off('sysinfo_update');  // 取消订阅系统信息更新事件
        socket.off('register');  // 取消订阅注册事件
    });
}