// 存储当前时间的数组
// Array to store current time
let current_time = [];
// 用户数量
// Number of users
let Usercount = 0;
// CPU 核心数量
// Number of CPU cores
let Cpucount = 0;
// CPU 使用率数组
// Array of CPU usage percentages
let cpu_percent = [];
// 内存使用率数组
// Array of memory usage percentages
let mem_percent = [];
// 总内存大小
// Total memory size
let mem_total = 0;
// 外部 IP 地址
// External IP address
let external_ip = "";
// GPU 信息数组
// Array of GPU information
let gpu = [];
// CPU 名称
// CPU name
let cpu_name = "";
// 主机名
// Hostname
let hostname = "";
// 服务器信息
// Server information
let server_info = "";
// 操作系统平台和版本信息
// Operating system platform and version information
let platformR = "";
// 交换空间总大小
// Total swap space size
let swaptotal = 0;
// 交换空间使用率
// Swap space usage percentage
let swappercent = 0;
// 服务器运行时间
// Server uptime
let runTime = "";
// 网络信息
// Network information
let network = "";
// Python 信息
// Python information
let python = "";

/**
 * 设置服务器信息，更新全局变量。
 * Set server information and update global variables.
 * @param {Object} data - 包含服务器信息的对象。
 * @param {Object} data - An object containing server information.
 */
export function set_server_info(data) {
    // 更新用户数量
    // Update the number of users
    Usercount = data['Usercount'];
    // 更新 CPU 核心数量
    // Update the number of CPU cores
    Cpucount = data["cpu"]["count"];
    // 若 CPU 使用率数组元素超过 10 个，移除最早的数据
    // If the cpu_percent array has more than 10 elements, remove the oldest data
    if (cpu_percent.length > 10) {
        cpu_percent.shift();
    }
    // 若当前时间数组元素超过 10 个，移除最早的数据
    // If the current_time array has more than 10 elements, remove the oldest data
    if (current_time.length > 10) {
        current_time.shift();
    }
    // 若内存使用率数组元素超过 10 个，移除最早的数据
    // If the mem_percent array has more than 10 elements, remove the oldest data
    if (mem_percent.length > 10) {
        mem_percent.shift();
    }
    // 更新 CPU 名称
    // Update the CPU name
    cpu_name = data["cpu"]["name"];
    // 添加新的 CPU 使用率数据
    // Add new CPU usage percentage data
    cpu_percent.push([data["cpu"]["percent"]]);
    // 添加新的内存使用率数据
    // Add new memory usage percentage data
    mem_percent.push([data["memory"]["percent"]]);
    // 添加新的当前时间数据
    // Add new current time data
    current_time.push([data["current_time"]]);
    // 更新总内存大小
    // Update the total memory size
    mem_total = data["memory"]["total"];
    // 更新外部 IP 地址
    // Update the external IP address
    external_ip = data["external_ip"];
    // 更新 GPU 信息
    // Update the GPU information
    gpu = data["gpus"];
    // 更新 Python 信息
    // Update the Python information
    python = data['python'];
    // 更新网络信息
    // Update the network information
    network = data["network"];
    // 更新主机名
    // Update the hostname
    hostname = data["hostname"];
    // 更新服务器信息
    // Update the server information
    server_info = data["info"];
    // 拼接操作系统平台和版本信息
    // Concatenate the operating system platform and version information
    platformR = data["os"]["platform"] + data["os"]["release"] + "/" + data["os"]["version"];
    // 更新交换空间总大小
    // Update the total swap space size
    swaptotal = data["swap"]["total"];
    // 更新交换空间使用率
    // Update the swap space usage percentage
    swappercent = data["swap"]["percent"];
    // 更新服务器运行时间
    // Update the server uptime
    runTime = data["uptime"];
}

/**
 * 获取服务器信息的快照。
 * Get a snapshot of the server information.
 * @returns {Object} - 包含服务器信息的对象。
 * @returns {Object} - An object containing server information.
 */
export default function getServerInfoSnapshot() {
    return {
        // Python 信息，若不存在则提供默认值
        // Python information, provide default values if it does not exist
        python: python? { ...python } : {
            "version": "Unknown",
            "released": "",
            "RepairNumber": ""
        },
        // 当前时间数组副本，避免修改原始数据
        // A copy of the current_time array to avoid modifying the original data
        currentTime: [...current_time],
        // 用户数量，若未定义则提供默认值 0
        // Number of users, provide a default value of 0 if undefined
        userCount: Usercount || 0,
        // CPU 名称，若未定义则提供默认值 "Unknown"
        // CPU name, provide a default value of "Unknown" if undefined
        cpu_name: cpu_name || "Unknown",
        // CPU 核心数量，若未定义则提供默认值 0
        // Number of CPU cores, provide a default value of 0 if undefined
        cpuCount: Cpucount || 0,
        // CPU 使用率数组副本，避免修改原始数据
        // A copy of the cpu_percent array to avoid modifying the original data
        cpuPercent: [...cpu_percent],
        // 内存使用率数组副本，避免修改原始数据
        // A copy of the mem_percent array to avoid modifying the original data
        memPercent: [...mem_percent],
        // 总内存大小，若未定义则提供默认值 0
        // Total memory size, provide a default value of 0 if undefined
        memTotal: mem_total || 0,
        // 外部 IP 地址，若未定义则提供默认值 ""
        // External IP address, provide a default value of "" if undefined
        externalIp: external_ip || "",
        // GPU 信息，若存在则创建副本，否则返回 null
        // GPU information, create a copy if it exists, otherwise return null
        gpu: gpu? { ...gpu } : null,
        // 网络信息，若存在则创建副本，否则返回空数组
        // Network information, create a copy if it exists, otherwise return an empty array
        network: network? { ...network } : [],
        // 主机名，若未定义则提供默认值 ""
        // Hostname, provide a default value of "" if undefined
        hostname: hostname || "",
        // 服务器信息，若未定义则提供默认值 ""
        // Server information, provide a default value of "" if undefined
        serverInfo: server_info || "",
        // 操作系统平台和版本信息，若未定义则提供默认值 ""
        // Operating system platform and version information, provide a default value of "" if undefined
        platform: platformR || "",
        // 交换空间总大小，若未定义则提供默认值 0
        // Total swap space size, provide a default value of 0 if undefined
        swapTotal: swaptotal || 0,
        // 交换空间使用率，若未定义则提供默认值 0
        // Swap space usage percentage, provide a default value of 0 if undefined
        swapPercent: swappercent || 0,
        // 服务器运行时间，若未定义则提供默认值 ""
        // Server uptime, provide a default value of "" if undefined
        runTime: runTime || ""
    };
}
