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