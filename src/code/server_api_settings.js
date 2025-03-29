// 为了让前端有更好的灵活性，CCRS允许用户自定义服务器的请求API，以应对不同的服务器
// To provide better flexibility for the front - end, CCRS allows users to customize server request APIs to handle different servers
// 默认的API分别是
// The default APIs are as follows
// isHTTPS[检测服务器是否支持HTTPS]
// isHTTPS [Check if the server supports HTTPS]
// clear[清空上传的文件]
// clear [Clear the uploaded files]
// getpicture[获取已上传的图片]
// getpicture [Get the uploaded pictures]
// start[发送 开始处理 请求]
// start [Send a "start processing" request]
// upload[上传文件]
// upload [Upload files]
// test[测试服务器是否可以联通]
// test [Test if the server can be connected]
// info[已上传所有图片的信息]
// info [Information of all uploaded pictures]

// 从 Settings.js 文件导入 getSettings 和 setSettings 函数
// Import the getSettings and setSettings functions from the Settings.js file
import {getSettings, setSettings} from "./Settings.js";
// 从 log.js 文件导入 add_log 函数
// Import the add_log function from the log.js file
import {add_log} from "./log.js";

/**
 * 获取指定名称的API路径。
 * Get the API path with the specified name.
 * @param {string} name - API名称。
 * @param {string} name - The name of the API.
 * @returns {string|undefined} - 对应的API路径，如果不存在则返回 undefined。
 * @returns {string|undefined} - The corresponding API path, or undefined if it does not exist.
 */
export function getAPI(name){
    // 从设置中获取 API 服务配置
    // Get the API service configuration from the settings
    let api_service=getSettings('api_service',true);
    // 返回指定名称的 API 路径
    // Return the API path with the specified name
    return api_service['api_'+name];
}

/**
 * 设置指定名称的API路径。
 * Set the API path with the specified name.
 * @param {string} name - API名称。
 * @param {string} name - The name of the API.
 * @param {string} value - 要设置的 API 路径。
 * @param {string} value - The API path to be set.
 */
export function setAPI(name, value){
    // 从设置中获取 API 服务配置
    // Get the API service configuration from the settings
    let api_service=getSettings('api_service',true);
    // 设置指定名称的 API 路径
    // Set the API path with the specified name
    api_service['api_'+name] = value;
    // 将更新后的 API 服务配置保存到设置中
    // Save the updated API service configuration to the settings
    setSettings('api_service',api_service,true);
    // 记录设置 API 路径成功的日志
    // Record the log of successful API path setting
    add_log('setAPI','successfully', name+" => "+value);
}

/**
 * 通过 JSON 对象设置 API 服务配置。
 * Set the API service configuration through a JSON object.
 * @param {Object} JsonValue - 包含 API 服务配置的 JSON 对象。
 * @param {Object} JsonValue - A JSON object containing the API service configuration.
 */
export function setAPIJ(JsonValue){
    // 将 JSON 对象保存到设置中作为 API 服务配置
    // Save the JSON object to the settings as the API service configuration
    setSettings('api_service',JsonValue,true);
    // 记录设置 API 配置成功的日志
    // Record the log of successful API configuration setting
    add_log('setAPIJson','successfully');
}

/**
 * 设置默认的 API 服务配置。
 * Set the default API service configuration.
 */
export function setDefaultAPI(){
    // 定义默认的 API 服务配置
    // Define the default API service configuration
    let api_service = {
        "api_isHTTPS" : '/isHTTPS',
        "api_clear":'/clear',
        "api_getpicture":'/getpicture',
        "api_start":'/start',
        "api_upload":'/upload',
        "api_test":'/test',
        "api_info":'/info',
        "api_command":'/command',
    }
    // 将默认的 API 服务配置保存到设置中
    // Save the default API service configuration to the settings
    setSettings('api_service',api_service,true);
}

/**
 * 获取 API 服务配置中的所有 API 名称。
 * Get all API names in the API service configuration.
 * @returns {Array<string>} - 包含所有 API 名称的数组。
 * @returns {Array<string>} - An array containing all API names.
 */
export function api_map(){
    // 从设置中获取 API 服务配置
    // Get the API service configuration from the settings
    let api_service=getSettings('api_service',true);
    // 初始化存储 API 名称的数组
    // Initialize an array to store API names
    let map=[]
    // 遍历 API 服务配置，将所有 API 名称添加到数组中
    // Iterate through the API service configuration and add all API names to the array
    for (let key in api_service){
        map.push(key)
    }
    // 返回包含所有 API 名称的数组
    // Return the array containing all API names
    return map
}
