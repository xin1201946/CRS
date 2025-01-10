import {get_Time} from "./times.js";
import {getServer} from "./get_server.js";

let logs = [
    {"key":1,"time":get_Time(),'event':'Create event recorder','result':'successfully','comment':'' ,'color':'default'}
]; // successfully, warning , error
let displayedEvents=[];
export function add_log(event,result='Null',Comment=''){
    if (!Array.isArray(logs)) {
        logs = [];
    }
    const newLog = {
        "key":logs.length+1,
        "time": get_Time(),
        "event": event.toLowerCase(),
        "result":result,
        "comment":Comment,
        "color": result === "successfully" ? "green" : result === "warning" ?"yellow":"red"
    };
    logs.push(newLog);
}
function add_Server_log(timestamp,event,result='Null',remark=''){
    if (!Array.isArray(logs)) {
        logs = [];
    }
    const newLog = {
        "key":logs.length+1,
        "time": timestamp,
        "event": event,
        "result":result,
        "comment":remark,
        "color": result === "successfully" ? "green" : result === "warning" ?"yellow":"red"
    };
    logs.push(newLog);
}
function get_server_logs() {
    fetch(getServer() + '/get_logs')
        .then(res => res.json())  // 解析响应为 JSON 数据
        .then(logs => {
            logs.forEach(log => {
                const { timestamp, event, result, remark } = log;
                // 判断事件是否已经展示过，避免重复
                if (!displayedEvents.includes(event)) {
                    add_Server_log(timestamp, event, result, remark);  // 调用已有的日志展示方法
                    displayedEvents.push(event);  // 添加该事件到已展示事件列表
                }
            });
        })
        .catch(error => {
            console.error("获取日志时出错：", error);  // 错误处理
        });
}

export function get_logs(){
    get_server_logs()
    return logs
}
export function get_error_logs() {
    return logs.filter(log => log.result === 'error');
}

export function get_warning_logs() {
    return logs.filter(log => log.result === 'warning');
}

export function get_successfully_logs() {
    return logs.filter(log => log.result === 'successfully');
}