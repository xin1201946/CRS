import { Card, Descriptions, Progress, Space, TabPane, Tabs } from "@douyinfe/semi-ui";
import { VChart } from "@visactor/react-vchart";
import React, { useEffect, useState } from "react";
import getServerInfoSnapshot from "../../code/get_server_info.js";
import { t } from "i18next";
import ProcessorStats from "../widget/ProcessorStats.jsx";
import ErrorPage from "../error_page/ErrorPage.jsx";

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
        };
    }

    static getDerivedStateFromError(error) {
        // 更新状态以便下次渲染显示错误页面
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // 捕获错误并记录详细信息
        this.setState({ errorInfo });
        console.error("Error caught by ErrorBoundary:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            const { error } = this.state;

            // 默认错误信息
            let code = 500;
            let title = "Something Went Wrong";
            let description = "An unexpected error occurred. Please try again later.";

            // 动态分析错误原因
            if (error) {
                if (error.message.includes('Network') || error.message.includes('fetch')) {
                    code = 200;
                    title = "Network Error";
                    description = "Failed to connect to the server. Check your network.";
                } else if (error.message.includes('undefined') || error.message.includes('null')) {
                    code = 102;
                    title = "Data Binding Error";
                    description = "Invalid data encountered. Please refresh the page.";
                } else if (error instanceof TypeError) {
                    code = 101;
                    title = "Component Failure";
                    description = "A component failed to load properly.";
                } else if (error.message.includes('timeout')) {
                    code = 200;
                    title = "Request Timeout";
                    description = "The request took too long. Please try again.";
                }
            }

            return (
                <ErrorPage
                    code={code}
                    title={title}
                    description={description}
                    homeUrl={"/settings/about"}
                    stackTrace={error.message}
                />
            );
        }

        // 如果没有错误，渲染子组件
        // eslint-disable-next-line react/prop-types
        return this.props.children;
    }
}

function ServerInfo() {
    const [current_time, setCurrent_time] = useState([]);
    const [Usercount, setUsercount] = useState(0);
    const [cpuName, setcpuname] = useState("");
    const [Cpucount, setCpucount] = useState(0);
    const [cpu_percent, setcpu_percent] = useState([]);
    const [mem_percent, setmem_percent] = useState([]);
    const [mem_total, setmem_total] = useState(0);
    const [external_ip, setexternal_ip] = useState("");
    const [gpu, setgpu] = useState({});
    const [network, setnetwork] = useState([]);
    const [hostname, sethostname] = useState("");
    const [server_info, setserver_info] = useState("Waiting");
    const [platformR, setplatformR] = useState("");
    const [swaptotal, setswaptotal] = useState(0);
    const [swappercent, setswappercent] = useState(0);
    const [runTime, setrunTime] = useState("");
    const [python, setpython] = useState({ version: "Unknown", released: "", RepairNumber: "" });
    const [selectGpu, setselectGpu] = useState("");
    const [selectNetwork, setselectNetwork] = useState("");

    const set_info = (data) => {
        try {
            if (typeof data !== "object" || data === null) {
                console.warn("Invalid data received:", data);
                return;
            }
            setcpuname(typeof data.cpu_name === "string" ? data.cpu_name : "");
            setCurrent_time(Array.isArray(data.currentTime) ? data.currentTime : []);
            setUsercount(typeof data.userCount === "number" ? data.userCount : 0);
            setCpucount(typeof data.cpuCount === "number" ? data.cpuCount : 0);
            setcpu_percent(Array.isArray(data.cpuPercent) ? data.cpuPercent : []);
            setmem_percent(Array.isArray(data.memPercent) ? data.memPercent : []);
            setmem_total(typeof data.memTotal === "number" ? data.memTotal : 0);
            setexternal_ip(typeof data.externalIp === "string" ? data.externalIp : "");
            setgpu(typeof data.gpu === "object" && data.gpu !== null ? data.gpu : {});
            sethostname(typeof data.hostname === "string" ? data.hostname : "");
            setserver_info(typeof data.serverInfo === "string" ? data.serverInfo : "Invalid data");
            setplatformR(typeof data.platform === "string" ? data.platform : "");
            setswaptotal(typeof data.swapTotal === "number" ? data.swapTotal : 0);
            setswappercent(typeof data.swapPercent === "number" ? data.swapPercent : 0);
            setrunTime(typeof data.runTime === "string" ? data.runTime : "");
            setpython(
                typeof data.python === "object" && data.python !== null
                    ? data.python
                    : { version: "Unknown", released: "", RepairNumber: "" }
            );
            if (typeof data.network === "object" && data.network !== null) {
                const networkArray = Object.values(data.network).filter((n) => n.is_up === true);
                setnetwork(networkArray);
            } else {
                setnetwork([]);
            }
        } catch (error) {
            console.error("Error in set_info:", error);
        }
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            const newData = getServerInfoSnapshot();
            set_info(newData);
        }, 2000);
        return () => clearInterval(intervalId);
    }, []);

    const CPUcommonSpec = {
        type: "area",
        stack: true,
        title: {
            visible: true,
            text: `${t("CPU usage")} ${cpu_percent.length > 0 ? cpu_percent[cpu_percent.length - 1] : 0}%`,
        },
        xField: "type",
        yField: "value",
        line: { style: { curveType: "monotone" } },
        seriesField: "total",
        legends: { visible: true },
        point: { visible: false }, // 隐藏顶点的蓝色点
        tooltip: {
            dimension: {
                updateContent: (data) => {
                    let sum = 0;
                    data.forEach((datum) => (sum += +datum.value || 0));
                    data.push({ hasShape: "false", key: "Total", value: sum });
                    return data;
                },
            },
        },
    };

    const memorycommonSpec = {
        type: "area",
        stack: true,
        title: {
            visible: true,
            text: `${t("memory usage")} ${mem_percent.length > 0 ? mem_percent[mem_percent.length - 1] : 0}%`,
        },
        xField: "type",
        yField: "value",
        line: { style: { curveType: "monotone" } },
        seriesField: "total",
        legends: { visible: true },
        point: { visible: false }, // 隐藏顶点的蓝色点
        tooltip: {
            dimension: {
                updateContent: (data) => {
                    let sum = 0;
                    data.forEach((datum) => (sum += +datum.value || 0));
                    data.push({ hasShape: "false", key: "Total", value: sum });
                    return data;
                },
            },
        },
    };

    const cpu_value = cpu_percent.length > 0 ? cpu_percent : [0];
    const mem_value = mem_percent.length > 0 ? mem_percent : [0];
    const time = current_time.length > 0 ? current_time : ["00:00:00"];

    const cpu_datas = {
        values: time.map((t, index) => ({
            type: [t],
            value: Array.isArray(cpu_value[index]) ? cpu_value[index] : [0],
        })),
    };
    const mem_datas = {
        values: time.map((t, index) => ({
            type:[t],
            value: Array.isArray(mem_value[index]) ? mem_value[index] : [0],
        })),
    };

    const Ddata = [
        { key: t("OS version"), value: platformR || "Unknown" },
        { key: t("Computer_Name"), value: hostname || "Unknown" },
        { key: t("Server_IP"), value: external_ip || "Unknown" },
        { key: t("connected device"), value: Usercount || 0, span: 3 },
        { key: t("CPU core count"), value: Cpucount || 0, span: 3 },
        { key: t("Mem total"), value: mem_total || 0, span: 3 },
        { key: t("server runtime"), value: runTime || "Unknown", span: 3 },
        { key: t("Swap total"), value: swaptotal || 0, span: 3 },
        { key: t("Server Info"), value: server_info || "Invalid data", span: 3 },
    ];
    const Pdata = [
        { key: t("Python Version"), value: python.version || "Unknown" },
        { key: t("released"), value: python.released || "" },
        { key: t("RepairNumber"), value: python.RepairNumber || "" },
    ];

    const GPUMonitor = () => {
        if (!gpu || typeof gpu !== "object" || Object.keys(gpu).length === 0) {
            return <div>Loading GPU info...</div>;
        }
        return (
            <Tabs type="line" activeKey={selectGpu || "0"} onChange={setselectGpu}>
                {Object.entries(gpu).map(([gpuId, gpuData]) => (
                    <TabPane tab={`GPU ${gpuData.id || gpuId}`} itemKey={gpuId} key={gpuId}>
                        <Space align="start" style={{ margin: "5px" }} className="scroll-auto">
                            <Progress
                                percent={isNaN(Math.floor(gpuData.load)) ? 0 : Math.floor(gpuData.load)}
                                strokeWidth={10}
                                type="circle"
                                style={{ margin: 5 }}
                                format={(per) => `${per}%`}
                                aria-label="gpu usage"
                                showInfo
                            />
                            <div>
                                <p>{t("Name")}: {gpuData.name || "Unknown"}</p>
                                <p>{t("Driver version")}: {gpuData.driver || "Unknown"}</p>
                                <p>{t("Video RAM")}: {isNaN(Math.floor(gpuData.memory_total)) ? 0 : Math.floor(gpuData.memory_total)} GB</p>
                                <p>{t("Video memory used")}: {isNaN(Math.floor(gpuData.memory_used)) ? 0 : Math.floor(gpuData.memory_used)} GB</p>
                                <p>{t("Video memory available")}: {isNaN(Math.floor(gpuData.memory_free)) ? 0 : Math.floor(gpuData.memory_free)} GB</p>
                                <p>{t("memory usage")}: {isNaN(Math.floor(gpuData.memory_percent)) ? 0 : Math.floor(gpuData.memory_percent)}%</p>
                                <p>{t("Temperature")}: {gpuData.temperature || 0} °C</p>
                                <p>{t("Graphics load")}: {isNaN(Math.floor(gpuData.load)) ? 0 : Math.floor(gpuData.load)}%</p>
                            </div>
                        </Space>
                    </TabPane>
                ))}
            </Tabs>
        );
    };

    const NetworkMonitor = () => {
        const changeDW = (speed) => {
            if (speed < 1024) return `${speed}KB/s`;
            if (speed < 1024 * 1024) return `${(speed / 1024).toFixed(1)}MB/s`;
            return `${(speed / 1024 / 1024).toFixed(2)}GB/s`;
        };

        if (!network || !Array.isArray(network) || network.length === 0) {
            return <div>Loading Network info...</div>;
        }
        return (
            <Tabs type="line" tabPosition="left" activeKey={selectNetwork || "0"} onChange={setselectNetwork}>
                {network.map((networkData, index) => (
                    <TabPane tab={networkData.name || `Network ${index}`} itemKey={String(index)} key={index}>
                        <Space align="start">
                            <p>
                                <p>{t("Name")}: {networkData.name || "Unknown"}</p>
                                <p>{t("Upload Speed")}: {changeDW(networkData.speed?.upload_speedKBps || 0)}</p>
                                <p>{t("Download Speed")}: {changeDW(networkData.speed?.download_speedKBps || 0)}</p>
                                <p>{t("Total Speed")}: {changeDW(networkData.speed?.total_speedKBps || 0)}</p>
                                <p>{t("Total rate")}: {networkData.speed?.utilization || 0} %</p>
                                <p>ipv4: {networkData.ipv4 || "N/A"}</p>
                                <p>ipv6: {networkData.ipv6 || "N/A"}</p>
                            </p>
                        </Space>
                    </TabPane>
                ))}
            </Tabs>
        );
    };

    return (
        <ErrorBoundary>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                <div className="col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <ProcessorStats
                            mainColor="rgba(50,149,251,1)"
                            content={cpuName || "Unknown"}
                            icon={"/processor.webp"}
                            backgroundColors="var(--semi-color-bg-3)"
                            chart_color="#3295fb"
                            percentage={parseInt(cpu_percent[cpu_percent.length - 1] || 0)}
                            bottomStats={{
                                left: `${Cpucount || 0} Cores`,
                                center: `${Usercount || 0} Devices`,
                                right: "64-bit",
                            }}
                            chart_data={cpu_datas}
                        />
                        <ProcessorStats
                            mainColor="var(--semi-color-warning)"
                            backgroundColors="var(--semi-color-bg-3)"
                            icon="/memory.webp"
                            title="Memory"
                            content={platformR || "Unknown"}
                            chart_color="#FF6B00"
                            percentage={parseInt(mem_percent[mem_percent.length - 1] || 0)}
                            bottomStats={{
                                left: `${(mem_total / 1024).toFixed(1) || 0} GiB RAM`,
                                center: "64-bit",
                                right: runTime || "Unknown",
                            }}
                            chart_data={mem_datas}
                        />
                        <Card className="col-span-2 lg:col-span-1" title="Swap">
                            <Progress
                                percent={swappercent || 0}
                                strokeWidth={10}
                                type="circle"
                                style={{ margin: 5 }}
                                format={(per) => `${per}%`}
                                aria-label="swap usage"
                                showInfo
                            />
                        </Card>
                        <Card className="col-span-2 lg:col-span-1" title="Python">
                            <Descriptions layout="vertical" align="plain" data={Pdata} column={4} />
                        </Card>
                        <Card className="col-span-2 lg:col-span-1" title="Network">
                            <NetworkMonitor />
                        </Card>
                        <Card className="col-span-2 lg:col-span-1">
                            <GPUMonitor />
                        </Card>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2 lg:col-span-1">
                            <VChart spec={{ ...CPUcommonSpec, data: cpu_datas }} option={{ mode: "desktop-browser" }} />
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                            <VChart spec={{ ...memorycommonSpec, data: mem_datas }} option={{ mode: "desktop-browser" }} />
                        </div>
                    </div>
                </div>
                <div className="lg:col-span-1">
                    <Card className="w-full" title={t("Server detail")}>
                        <Descriptions layout="vertical" align="plain" data={Ddata} column={4} />
                    </Card>
                </div>
            </div>
        </ErrorBoundary>
    );
}

export default ServerInfo;