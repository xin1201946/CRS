/**
 * 创建一个新的 Cookie。
 * Creates a new cookie.
 * @param {string} cname - Cookie 的名称。
 * @param {string} cname - The name of the cookie.
 * @param {string} cvalue - Cookie 的值。
 * @param {string} cvalue - The value of the cookie.
 * @param {number} exdays - Cookie 的过期天数。
 * @param {number} exdays - The number of days until the cookie expires.
 */
export function setCookie(cname, cvalue, exdays) {
    // 创建一个新的 Date 对象
    // Create a new Date object
    const d = new Date();
    // 设置过期时间
    // Set the expiration time
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    // 格式化过期时间
    // Format the expiration time
    let expires = "expires=" + d.toUTCString();
    // 设置 Cookie
    // Set the cookie
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * 获取指定名称的 Cookie 的值。
 * Gets the value of a cookie with the specified name.
 * @param {string} cname - 要获取的 Cookie 的名称。
 * @param {string} cname - The name of the cookie to get.
 * @returns {string} - 如果找到则返回 Cookie 的值，否则返回空字符串。
 * @returns {string} - Returns the value of the cookie if found, otherwise an empty string.
 */
export function getCookie(cname) {
    // 拼接 Cookie 名称
    // Concatenate the cookie name
    let name = cname + "=";
    // 解码 Cookie 字符串
    // Decode the cookie string
    let decodedCookie = decodeURIComponent(document.cookie);
    // 分割 Cookie 字符串
    // Split the cookie string
    let ca = decodedCookie.split(';');
    // 遍历所有 Cookie
    // Iterate through all cookies
    for (let i = 0; i < ca.length; i++) {
        // 获取当前 Cookie
        // Get the current cookie
        let c = ca[i];
        // 去除开头的空格
        // Remove leading spaces
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        // 检查是否是要找的 Cookie
        // Check if it's the cookie we're looking for
        if (c.indexOf(name) == 0) {
            // 返回 Cookie 的值
            // Return the value of the cookie
            return c.substring(name.length, c.length);
        }
    }
    // 未找到，返回空字符串
    // Not found, return an empty string
    return "";
}

/**
 * 查询所有的 Cookie 并返回一个对象。
 * Queries all cookies and returns an object.
 * @returns {Object} - 包含所有 Cookie 的键值对的对象。
 * @returns {Object} - An object containing key-value pairs of all cookies.
 */
export function getAllCookies() {
    // 分割所有 Cookie
    // Split all cookies
    let cookies = document.cookie.split(';');
    // 初始化结果对象
    // Initialize the result object
    let result = {};
    // 遍历所有 Cookie
    // Iterate through all cookies
    cookies.forEach(cookie => {
        // 分割 Cookie 键值对
        // Split the cookie key-value pair
        let parts = cookie.split('=');
        // 获取键并去除空格
        // Get the key and remove spaces
        let key = parts.shift().trim();
        // 获取值并去除空格
        // Get the value and remove spaces
        let value = parts.join('=').trim();
        // 将键值对添加到结果对象中
        // Add the key-value pair to the result object
        result[key] = value;
    });
    // 返回结果对象
    // Return the result object
    return result;
}

/**
 * 删除指定名称的 Cookie。
 * Deletes a cookie with the specified name.
 * @param {string} cname - 要删除的 Cookie 的名称。
 * @param {string} cname - The name of the cookie to delete.
 */
export function deleteCookie(cname) {
    // 设置 Cookie 过期
    // Set the cookie to expire
    setCookie(cname, "", -1);
}

/**
 * 删除所有的 Cookie。
 * Deletes all cookies.
 */
export function deleteAllCookies() {
    // 获取所有 Cookie
    // Get all cookies
    let cookies = getAllCookies();
    // 遍历所有 Cookie
    // Iterate through all cookies
    for (let cookie in cookies) {
        // 删除当前 Cookie
        // Delete the current cookie
        deleteCookie(cookie);
    }
}
