import {get_T_language} from "./language.js";

export function get_Time(){
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0'); // 获取小时，并确保是两位数
    const minutes = now.getMinutes().toString().padStart(2, '0'); // 获取分钟，并确保是两位数
    const seconds = now.getSeconds().toString().padStart(2, '0'); // 获取秒，并确保是两位数
    return `${hours}:${minutes}:${seconds}`;
}
export function get_Date(){
    const now = new Date();
    const year=now.getFullYear().toString()
    const month=now.getMonth().toString()
    const day=now.getDate().toString()
    return `${year}-${month}-${day}`
}

export function get_Greeting() {
    const now = new Date();
    const hours = now.getHours();
    const language = get_T_language();

    const greetings = {
        "en-US": ["Good morning,", "Good afternoon,", "Good evening,", "Good night,"],
        "zh-CN": ["早上好，", "下午好，", "晚上好，", "夜深了，"]
    };

    const lang = greetings[language] ? language : "en-US";

    if (hours >= 5 && hours < 12) {
        return greetings[lang][0];
    } else if (hours >= 12 && hours < 17) {
        return greetings[lang][1];
    } else if (hours >= 17 && hours < 21) {
        return greetings[lang][2];
    } else {
        return greetings[lang][3];
    }
}
