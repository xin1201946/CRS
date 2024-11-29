import './Settings.js'
import {getSettings, setSettings} from "./Settings.js";
import {add_log} from "./log.js";
import {api_map} from "./server_api_settings.js";

export default function initializeSettings(){
    let server_ip= "120.0.0.1:5000"
    let new_settings_page= "true"
    let use_https ='true'
    let theme_color= "auto" // theme_color 仅有三个值 light dark auto
    let api_service = {
        "api_isHTTPS" : '/isHTTPS',
        "api_clear":'/clear',
        "api_getpicture":'/getpicture',
        "api_start":'/start',
        "api_upload":'/upload',
        "api_test":'/test',
        "api_info":'/info',
        "api_command":'/command'
    }
    getSettings('server_ip')===null ? setSettings("server_ip",server_ip):"";
    getSettings('new_settings_page')===null ? setSettings("new_settings_page",new_settings_page):"";
    getSettings('theme_color')===null ? setSettings("theme_color",theme_color):"";
    getSettings('use_https')===null ? setSettings("use_https",use_https):"";
    getSettings('api_service')===null ? setSettings("api_service",api_service,true):"";
    add_log('QuickLoadingService:Server_ip','successfully',getSettings('server_ip'));
    add_log('QuickLoadingService:api_service','successfully',api_map().toString());
    add_log('QuickLoadingService:new_settings_page','successfully',getSettings('new_settings_page'));
    add_log('QuickLoadingService:use_https','successfully',getSettings('use_https'));
    add_log('QuickLoadingService:theme_color','successfully',getSettings('theme_color'));
    return true
}