// 为了让前端有更好的灵活性，我将允许用户自定义服务器的请求API，以应对不同的服务器
// 默认的API分别是
// isHTTPS[检测服务器是否支持HTTPS]
// clear[清空上传的文件]
// getpicture[获取已上传的图片]
// start[发送 开始处理 请求]
// upload[上传文件]
// test[测试服务器是否可以联通]
// info[已上传所有图片的信息]

import {getSettings, setSettings} from "./Settings.js";


export function getAPI(name){
    let api_service=getSettings('api_service',true);
    return api_service['api_'+name];
}
export function setAPI(name, value){
    let api_service=getSettings('api_service',true);
    api_service['api_'+name] = value;
    setSettings('api_service',api_service,true);
}
export function setAPIJ(JsonValue){
    console.log(JsonValue);
    setSettings('api_service',JsonValue,true);
}
export function setDefaultAPI(){
    let api_service = {
        "api_isHTTPS" : '/isHTTPS',
        "api_clear":'/clear',
        "api_getpicture":'/getpicture',
        "api_start":'/start',
        "api_upload":'/upload',
        "api_test":'/test',
        "api_info":'/info'
    }
    setSettings('api_service',api_service,true);
}
export function api_map(){
    let api_service=getSettings('api_service',true);
    let map=[]
    for (let key in api_service){
        map.push(key)
    }
    return map
}