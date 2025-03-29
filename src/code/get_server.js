import {getSettings} from "./Settings.js";

/**
 * 获取服务器地址，根据配置决定使用 HTTP 还是 HTTPS。
 * Get the server address, determining whether to use HTTP or HTTPS based on the configuration.
 * @returns {string} 服务器的完整地址，包含协议和 IP 地址。
 * @returns {string} The full address of the server, including the protocol and IP address.
 */
export function getServer() {
    // 从设置中获取服务器 IP 地址
    // Get the server IP address from the settings
    const serverip = getSettings('server_ip');
    // 从设置中获取是否使用 HTTPS 的标志
    // Get the flag indicating whether to use HTTPS from the settings
    const use_https = getSettings('use_https');
    // 根据是否使用 HTTPS 标志返回相应的服务器地址
    // Return the corresponding server address based on the use_https flag
    return use_https === 'true'? 'https://' + serverip : 'http://' + serverip;
}
