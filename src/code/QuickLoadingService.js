import './Settings.js'
import {getSettings, setSettings} from "./Settings.js";
import {add_log} from "./log.js";
import {api_map} from "./server_api_settings.js";
import {Notification} from '@douyinfe/semi-ui';
import {subscribeToServerNotifications} from '././server_information_subscription_service.js'
import {v4 as uuidv4} from 'uuid';
import {checkAPIAvailability} from "./chrome_gemini_support.js";

/**
 * 初始化应用程序的设置。
 * Initializes the application settings.
 * @returns {boolean} - 始终返回 true，表示初始化成功。
 * @returns {boolean} - Always returns true, indicating successful initialization.
 */
export default function initializeSettings(){
    // 设置服务器 IP 地址
    // Set the server IP address
    const server_ip= "127.0.0.1:5000"
    // 设置语言，2 可能代表英文
    // Set the language, 2 might represent English
    const language= 2
    // 设置是否使用 HTTPS
    // Set whether to use HTTPS
    const use_https ='true'
    // 设置是否使用 Gemini 服务
    // Set whether to use the Gemini service
    const use_gemini='false'
    // 设置主题颜色，可选值为 light、dark、auto
    // Set the theme color, available values are light, dark, auto
    const theme_color= "auto" 
    // 定义 API 服务路径映射
    // Define the API service path mapping
    const api_service = {
        "api_isHTTPS" : '/isHTTPS',
        "api_clear":'/clear',
        "api_getpicture":'/getpicture',
        "api_start":'/start',
        "api_upload":'/upload',
        "api_test":'/test',
        "api_info":'/info',
        "api_command":'/command',
        "api_status":'/status',
    }
    // 生成唯一标识符
    // Generate a unique identifier
    const uuid = uuidv4()
    // 设置通知卡片的显示方式
    // Set the display mode of notification cards
    const notify_card=2
    // 设置是否使用应用程序的上下文菜单
    // Set whether to use the application's context menu
    const use_app_content_menu='true'
    // 设置用户名
    // Set the user name
    const user_name = 'user'
    // 订阅服务器通知
    // Subscribe to server notifications
    subscribeToServerNotifications();
    // 配置通知组件的顶部间距
    // Configure the top margin of the notification component
    Notification.config({top:30})
    // 检查 API 可用性
    // Check API availability
    checkAPIAvailability().then();
    // 如果 Language 设置不存在，则设置默认语言
    // If the Language setting does not exist, set the default language
    getSettings('Language')===null ? setSettings("Language",language):"";
    // 如果 user_name 设置不存在，则设置默认用户名
    // If the user_name setting does not exist, set the default user name
    getSettings('user_name')===null ? setSettings("user_name",user_name):"";
    // 如果 notify_card 设置不存在，则设置默认通知卡片显示方式
    // If the notify_card setting does not exist, set the default display mode of notification cards
    getSettings('notify_card')===null ? setSettings("notify_card",notify_card):"";
    // 如果 use_gemini 设置不存在，则设置默认是否使用 Gemini 服务
    // If the use_gemini setting does not exist, set the default value for using the Gemini service
    getSettings('use_gemini')===null ? setSettings("use_gemini",use_gemini):"";
    // 如果 use_app_content_menu 设置不存在，则设置默认是否使用应用程序上下文菜单
    // If the use_app_content_menu setting does not exist, set the default value for using the application's context menu
    getSettings('use_app_content_menu')===null ? setSettings("use_app_content_menu",use_app_content_menu):"";
    // 如果 uuid 设置不存在，则设置默认唯一标识符
    // If the uuid setting does not exist, set the default unique identifier
    getSettings('uuid')===null ? setSettings("uuid",uuid):"";
    // 如果 server_ip 设置不存在，则设置默认服务器 IP 地址
    // If the server_ip setting does not exist, set the default server IP address
    getSettings('server_ip')===null ? setSettings("server_ip",server_ip):"";
    // 如果 theme_color 设置不存在，则设置默认主题颜色
    // If the theme_color setting does not exist, set the default theme color
    getSettings('theme_color')===null ? setSettings("theme_color",theme_color):"";
    // 如果 use_https 设置不存在，则设置默认是否使用 HTTPS
    // If the use_https setting does not exist, set the default value for using HTTPS
    getSettings('use_https')===null ? setSettings("use_https",use_https):"";
    // 如果 api_service 设置不存在，则设置默认 API 服务路径映射
    // If the api_service setting does not exist, set the default API service path mapping
    getSettings('api_service')===null ? setSettings("api_service",api_service,true):"";
    // 记录语言设置加载成功的日志
    // Record the log of successful language setting loading
    add_log('QuickLoadingService:language Loading','successfully',getSettings('Language'));
    // 记录服务器 IP 地址设置加载成功的日志
    // Record the log of successful server IP address setting loading
    add_log('QuickLoadingService:Server_ip','successfully',getSettings('server_ip'));
    // 记录 API 服务路径映射设置加载成功的日志
    // Record the log of successful API service path mapping setting loading
    add_log('QuickLoadingService:api_service','successfully',api_map().toString());
    // 记录是否使用 HTTPS 设置加载成功的日志
    // Record the log of successful use_https setting loading
    add_log('QuickLoadingService:use_https','successfully',getSettings('use_https'));
    // 记录主题颜色设置加载成功的日志
    // Record the log of successful theme_color setting loading
    add_log('QuickLoadingService:theme_color','successfully',getSettings('theme_color'));
    // 记录尝试订阅服务器通知成功的日志
    // Record the log of successful attempt to subscribe to server notifications
    add_log('QuickLoadingService:Try subscribing to the server notifications','successfully');
    // 返回 true 表示初始化成功
    // Return true to indicate successful initialization
    return true
}
