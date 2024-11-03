import {get_Time} from "./times.js";

let logs = [
    {"key":1,"time":get_Time(),'event':'Create event recorder','result':'successfully','comment':'' ,'color':'default'}
]; // successfully, warning , error
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
export function get_logs(){
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