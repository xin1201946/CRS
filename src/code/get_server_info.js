
let current_time=[]
let Usercount=0
let Cpucount=0
let cpu_percent=[]
let mem_percent=[]
let mem_total=0
let external_ip=""
let gpu=[]
let cpu_name=""
let hostname=""
let server_info=""
let platformR=""
let swaptotal=0
let swappercent=0
let runTime=""
let network=""
let python=""

export function set_server_info(data) {
    Usercount=data['Usercount']
    Cpucount=data["cpu"]["count"]
    if (cpu_percent.length>10) {
        cpu_percent.shift()
    }
    if (current_time.length>10) {
        current_time.shift()
    }
    if (mem_percent.length>10) {
        mem_percent.shift()
    }
    cpu_name=data["cpu"]["name"]
    cpu_percent.push([data["cpu"]["percent"]])
    mem_percent.push([data["memory"]["percent"]])
    current_time.push([data["current_time"]])
    mem_total=data["memory"]["total"]
    external_ip=data["external_ip"]
    gpu = data["gpus"]
    python=data['python']
    network=data["network"]
    hostname=data["hostname"]
    server_info=data["info"]
    platformR=data["os"]["platform"]+data["os"]["release"]+"/"+data["os"]["version"]
    swaptotal=data["swap"]["total"]
    swappercent=data["swap"]["percent"]
    runTime=data["uptime"]
}

export default function getServerInfoSnapshot() {
    return {
        python:python? {...python}:{
            "version":"Unknown",
            "released":"",
            "RepairNumber":""
        },
        currentTime: [...current_time], // 使用扩展运算符创建副本，防止修改原始数组
        userCount: Usercount || 0, // 提供默认值，防止未定义
        cpu_name: cpu_name || "Unknown",
        cpuCount: Cpucount || 0,
        cpuPercent: [...cpu_percent],
        memPercent: [...mem_percent],
        memTotal: mem_total || 0,
        externalIp: external_ip || "",
        gpu: gpu ? {...gpu} : null, // 如果 gpu 存在，创建副本，否则返回 null
        network:network ?{...network}:[],
        hostname: hostname || "",
        serverInfo: server_info || "",
        platform: platformR || "",
        swapTotal: swaptotal || 0,
        swapPercent: swappercent || 0,
        runTime: runTime || "",
    };
}
