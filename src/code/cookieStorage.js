// 创建Cookie
export function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

// 获取指定Cookie的值
export function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// 查询所有Cookie
export function getAllCookies() {
    let cookies = document.cookie.split(';');
    let result = {};
    cookies.forEach(cookie => {
        let parts = cookie.split('=');
        let key = parts.shift().trim();
        let value = parts.join('=').trim();
        result[key] = value;
    });
    return result;
}

// 删除指定Cookie
export function deleteCookie(cname) {
    setCookie(cname, "", -1);
}

// 删除所有Cookie
export function deleteAllCookies() {
    let cookies = getAllCookies();
    for (let cookie in cookies) {
        deleteCookie(cookie);
    }
}