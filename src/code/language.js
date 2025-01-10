//语言设置
//语言表：
//1. zh-CN
//2. en-US
import {getSettings, setSettings} from "./Settings.js";

export function get_language() {
    return getSettings('Language')==='1'?1:2;
}
export function get_T_language() {
    return getSettings('Language')==="1" ? "zh-CN" : "en-US";
}
export function set_language(language=1) {
    window.location.href = window.location.href
    setSettings('Language',language);
}