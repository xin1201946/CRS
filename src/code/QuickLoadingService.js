import './Settings.js'
import {getSettings, setSettings} from "./Settings.js";

const isHalloweenPeriod = () => {
        const now = new Date();
        const halloween = new Date(now.getFullYear(), 9, 31);  // 万圣节日期
        const halloweenStart = new Date(halloween.getTime() - 10 * 24 * 60 * 60 * 1000);  // 万圣节前10天
        return now >= halloweenStart && now <= halloween;
};
export default function initializeSettings(){
    let server_ip= "127.0.0.1:5000"
    let new_settings_page= "true"
    let is_wsj= "false"
    getSettings('server_ip')===null ? setSettings("server_ip",server_ip):"";
    getSettings('new_settings_page')===null ? setSettings("new_settings_page",new_settings_page):"";
    getSettings('is_wsj')===null || isHalloweenPeriod===false ? setSettings("is_wsj",is_wsj):"";
    return true
}