import {getSettings} from "./Settings.js";
export function getServer() {
    const serverip=getSettings('server_ip')
    const use_https=getSettings('use_https')
    return use_https === 'true'? 'https://' + serverip : serverip
}