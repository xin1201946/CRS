import './Settings.js'
import {getSettings, setSettings} from "./Settings.js";
import {add_log} from "./log.js";

const isHalloweenPeriod = () => {
        const now = new Date();
        const halloween = new Date(now.getFullYear(), 9, 31);  // 万圣节日期
        const halloweenStart = new Date(halloween.getTime() - 10 * 24 * 60 * 60 * 1000);  // 万圣节前10天
        add_log('Check is halloween','successfully',now >= halloweenStart && now <= halloween?'Is that day':'Not that day');
        return now >= halloweenStart && now <= halloween;
};
export default function initializeSettings(){
    let server_ip= "127.0.0.1:5000"
    let new_settings_page= "true"
    let is_wsj= "false"
    let theme_color= "auto" // theme_color 仅有三个值 light dark auto
    getSettings('server_ip')===null ? setSettings("server_ip",server_ip):"";
    getSettings('new_settings_page')===null ? setSettings("new_settings_page",new_settings_page):"";
    getSettings('is_wsj')===null || isHalloweenPeriod===false ? setSettings("is_wsj",is_wsj):"";
    getSettings('theme_color')===null || isHalloweenPeriod===false ? setSettings("theme_color",theme_color):"";
    add_log('QuickLoadingService:Server_ip','successfully',getSettings('server_ip'));
    add_log('QuickLoadingService:new_settings_page','successfully',getSettings('new_settings_page'));
    add_log('QuickLoadingService:is_wsj','successfully',getSettings('is_wsj'));
    add_log('QuickLoadingService:theme_color','successfully',getSettings('theme_color'));
    return true
}