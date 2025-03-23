import './Settings.js'
import {getSettings, setSettings} from "./Settings.js";
import {add_log} from "./log.js";
import {api_map} from "./server_api_settings.js";
import {Notification} from '@douyinfe/semi-ui';
import {subscribeToServerNotifications} from '././server_information_subscription_service.js'
import {v4 as uuidv4} from 'uuid';
import {checkAPIAvailability} from "./chrome_gemini_support.js";

export default function initializeSettings(){
    const server_ip= "127.0.0.1:5000"
    const language= 2
    const use_https ='true'
    const use_gemini='false'
    const theme_color= "auto" // theme_color 仅有三个值 light dark auto
    const api_service = {
        "api_isHTTPS" : '/isHTTPS',
        "api_clear":'/clear',
        "api_getpicture":'/getpicture',
        "api_start":'/start',
        "api_upload":'/upload',
        "api_test":'/test',
        "api_info":'/info',
        "api_command":'/command',
    }
    const uuid = uuidv4()
    const notify_card=2
    const use_app_content_menu='true'
    subscribeToServerNotifications();
    Notification.config({top:30})
    checkAPIAvailability().then();
    getSettings('Language')===null ? setSettings("Language",language):"";
    getSettings('notify_card')===null ? setSettings("notify_card",notify_card):"";
    getSettings('use_gemini')===null ? setSettings("use_gemini",use_gemini):"";
    getSettings('use_app_content_menu')===null ? setSettings("use_app_content_menu",use_app_content_menu):"";
    getSettings('uuid')===null ? setSettings("uuid",uuid):"";
    getSettings('server_ip')===null ? setSettings("server_ip",server_ip):"";
    getSettings('theme_color')===null ? setSettings("theme_color",theme_color):"";
    getSettings('use_https')===null ? setSettings("use_https",use_https):"";
    getSettings('api_service')===null ? setSettings("api_service",api_service,true):"";
    add_log('QuickLoadingService:language Loading','successfully',getSettings('Language'));
    add_log('QuickLoadingService:Server_ip','successfully',getSettings('server_ip'));
    add_log('QuickLoadingService:api_service','successfully',api_map().toString());
    add_log('QuickLoadingService:use_https','successfully',getSettings('use_https'));
    add_log('QuickLoadingService:theme_color','successfully',getSettings('theme_color'));
    add_log('QuickLoadingService:尝试订阅服务器通知','successfully');
    return true
}