export function setSettings(name, value, isSession=false) {
    if (isSession){
        sessionStorage.setItem(name,value)
    }else{
        localStorage.setItem(name,value)
    }
    return true
}

export function getSettings(name){
    let value
    value = sessionStorage.getItem(name) ? sessionStorage.getItem(name):localStorage.getItem(name)
    return value ? value : null
}