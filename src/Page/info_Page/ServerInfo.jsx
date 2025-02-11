import {Card, Descriptions, Progress, Space, TabPane, Tabs} from "@douyinfe/semi-ui";
import {VChart} from "@visactor/react-vchart";
import {useEffect, useState} from "react";
import getServerInfoSnapshot from "../../code/get_server_info.js";
import {t} from "i18next";

export default function ServerInfo() {
    const [current_time,setCurrent_time] = useState([[0]]);
    const [Usercount,setUsercount] = useState(0);
    const [Cpucount,setCpucount] = useState(0);
    const [cpu_percent,setcpu_percent] = useState([[0]]);
    const [mem_percent,setmem_percent] = useState([[0]]);
    const [mem_total,setmem_total] = useState(0);
    const [external_ip,setexternal_ip] = useState("");
    const [gpu,setgpu] = useState([]);
    const [network,setnetwork] = useState([]);
    const [hostname,sethostname] = useState("");
    const [server_info,setserver_info] = useState("Waiting");
    const [platformR,setplatformR] = useState("");
    const [swaptotal,setswaptotal] = useState(0);
    const [swappercent,setswappercent] = useState(0);
    const [runTime,setrunTime] = useState("");
    const [python,setpython] = useState({});

    const [selectGpu,setselectGpu] = useState("");
    const [selectNetwork,setselectNetwork] = useState("");

    const set_info= (data) => {
        console.log(data)
        if (typeof data !== 'object' || data === null) {
            return;
        }
        for (const key in data) {
            switch (key) {
                case "currentTime":
                    setCurrent_time(data[key]);
                    break;
                case "userCount":
                    setUsercount(data[key]);
                    break;
                case "cpuCount":
                    setCpucount(data[key]);
                    break;
                case "cpuPercent":
                    setcpu_percent(data[key]);
                    break;
                case "memPercent":
                    setmem_percent(data[key]);
                    break;
                case "memTotal":
                    setmem_total(data[key]);
                    break;
                case "externalIp":
                    setexternal_ip(data[key]);
                    break;
                case "gpu":
                    setgpu(data[key]);
                    break;
                case "hostname":
                    sethostname(data[key]);
                    break;
                case "serverInfo":
                    setserver_info(data[key]);
                    break;
                case "platform":
                    setplatformR(data[key]);
                    break;
                case "swapTotal":
                    setswaptotal(data[key]);
                    break;
                case "swapPercent":
                    setswappercent(data[key]);
                    break;
                case "runTime":
                    setrunTime(data[key]);
                    break;
                case "python":
                    setpython(data[key]);
                    break;
                case "network":
                    // 假设 data[key] 是对象，且它的值是网卡信息
                    setnetwork(Object.values(data[key]).filter(network => network.is_up === true));
                    break;
            }
        }
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            // 模拟从服务器获取数据
            const newData = getServerInfoSnapshot();
            set_info(newData);
        }, 1000); // 每秒更新一次数据

        // 清除定时器
        return () => clearInterval(intervalId);
    }, []);

    const CPUcommonSpec = {
        type: 'area',
        stack: true,
        title: {
            visible: true,
            text: t('CPU usage')+cpu_percent[cpu_percent.length-1]+"%",
        },
        xField: 'type',
        yField: 'value',
        line: {
            style: {
                curveType: 'monotone'
            }
        },
        seriesField: 'country',
        legends: { visible: true },
        tooltip: {
            dimension: {
                updateContent: data => {
                    let sum = 0;
                    data.forEach(datum => {
                        sum += +datum.value;
                    });
                    data.push({
                        hasShape: 'false',
                        key: 'Total',
                        value: sum
                    });
                    return data;
                }
            }
        }
    };

    const memorycommonSpec = {
        type: 'area',
        stack: true,
        title: {
            visible: true,
            text: t('memory usage')+mem_percent[mem_percent.length-1]+"%",
        },
        xField: 'type',
        yField: 'value',
        line: {
            style: {
                curveType: 'monotone'
            }
        },
        seriesField: 'country',
        legends: { visible: true },
        tooltip: {
            dimension: {
                updateContent: data => {
                    let sum = 0;
                    data.forEach(datum => {
                        sum += +datum.value;
                    });
                    data.push({
                        hasShape: 'false',
                        key: 'Total',
                        value: sum
                    });
                    return data;
                }
            }
        }
    };

    const cpu_value=cpu_percent
    const mem_value=mem_percent
    const time=current_time
    // 确保两个数组的长度一致
    const cpu_datas = {
        values: cpu_value.map((arr, index) => ({
            type: time[index],  // 时间
            value: arr,        // cpu_percent 中的对应值
        }))
    };
    const mem_datas = {
        values: mem_value.map((arr, index) => ({
            type: time[index],  // 时间
            value: arr,        // cpu_percent 中的对应值
        }))
    };
    const Ddata = [
        {key: t('OS version'), value: platformR},
        {key: t('Computer_Name'), value: hostname},
        {key: t('Server_IP'), value: external_ip},
        {key: t('connected device'), value: Usercount, span: 3},
        {key: t('CPU core count'), value: Cpucount, span: 3},
        {key: t('Mem total'), value: mem_total, span: 3},
        {key: t('server runtime'), value: runTime, span: 3},
        {key: t('Swap total'), value: swaptotal, span: 3},
        {key: t('Server Info'), value: server_info, span: 3},
    ];
    const Pdata = [
        {key: t('Python Version'), value: python.version},
        {key: t('released'), value: python.released},
        {key: t('RepairNumber'), value: python.RepairNumber},
    ];

    const GPUMonitor = () => {
        if (!gpu || Object.keys(gpu).length === 0) {
            return <div>正在加载GPU信息...</div>;
        }
        return (
            <Tabs type={"line"} activeKey={selectGpu===''?"0":selectGpu} onChange={(key)=>{setselectGpu(key)}}>
                {Object.keys(gpu).map((gpuId) => {
                    const gpuData = gpu[gpuId];
                    return (
                        <TabPane tab={"GPU "+gpuData.id} itemKey={gpuId} key={gpuData.id}>
                            <Space align={'start'} style={{margin:'5px'}} className="scroll-auto">
                                <Progress
                                    percent={isNaN(Math.floor(gpuData.load))?0:Math.floor(gpuData.load)}
                                    strokeWidth={10}
                                    type="circle"
                                    style={{ margin: 5 }}
                                    format={per => per + '%'}
                                    aria-label="gpu usage"
                                    showInfo
                                />
                                <div >
                                    <p>{t('Name')}: {gpuData.name}</p>
                                    <p>{t('Driver version')}: {gpuData.driver}</p>
                                    <p>{t('Video RAM')}: {isNaN(Math.floor(gpuData.memory_total))?0:Math.floor(gpuData.memory_total)} GB</p>
                                    <p>{t('Video memory used')}: {isNaN(Math.floor(gpuData.memory_used))?0:Math.floor(gpuData.memory_used)} GB</p>
                                    <p>{t('Video memory available')}: {isNaN(Math.floor(gpuData.memory_free))?0:Math.floor(gpuData.memory_free)} GB</p>
                                    <p>{t('memory usage')}: {isNaN(Math.floor(gpuData.memory_percent))?0:Math.floor(gpuData.memory_percent)}%</p>
                                    <p>{t('Temperature')}: {gpuData.temperature} °C</p>
                                    <p>{t('Graphics load')}: {isNaN(Math.floor(gpuData.load))?0:Math.floor(gpuData.load)}%</p>
                                </div>
                            </Space>
                        </TabPane>
                    );
                })}
            </Tabs>
        );
    };

    function  NetworkMonitor (){
        const changeDW=(speed)=>{
            if (speed < 1024){
                return speed+"KB/s"
            }else if (speed < 1024*1024){
                return (speed/1024).toFixed(1)+"MB/s"
            }else{
                return ( speed/1024/1024).toFixed(2)+"GB/s"
            }
        }
        if (!network || Object.keys(network).length === 0) {
            return <div>正在加载网卡信息...</div>;
        }
        return (
            <Tabs type={"line"} tabPosition="left"  activeKey={selectNetwork===''?"0":selectNetwork} onChange={(key)=>{setselectNetwork(key)}}>
                {Object.keys(network).map((networkid) => {
                    const networkData = network[networkid];
                    return (
                        <TabPane tab={networkData.name} itemKey={networkid} key={networkid}>
                            <Space align={'start'}>
                                <p>
                                    <p>{t('Name')}: {networkData.name}</p>
                                    <p>{t('Upload Speed')}: {changeDW(networkData.speed.upload_speedKBps)}</p>
                                    <p>{t('Download Speed')}: {changeDW(networkData.speed.download_speedKBps)}</p>
                                    <p>{t('Total Speed')}: {changeDW(networkData.speed.total_speedKBps)}</p>
                                    <p>{t('Total rate')}: {networkData.speed.utilization} %</p>
                                    <p>ipv4: {networkData.ipv4}</p>
                                    <p>ipv6: {networkData.ipv6}</p>
                                </p>
                            </Space>
                        </TabPane>
                    );
                })}
            </Tabs>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
                {/* 左侧：CPU、内存、交换空间、网络、GPU */}
                <div className="col-span-2 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        {/* CPU、内存、交换空间、网络 */}
                        <Card className="col-span-2 lg:col-span-1" title="CPU">
                            <Progress
                                percent={cpu_percent[cpu_percent.length - 1]}
                                type="circle"
                                strokeWidth={10}
                                format={(per) => per + "%"}
                                style={{ margin: 5 }}
                                aria-label="cpu usage"
                                showInfo
                            />
                        </Card>
                        <Card className="col-span-2 lg:col-span-1" title="Memory">
                            <Progress
                                percent={mem_percent[mem_percent.length - 1]}
                                strokeWidth={10}
                                type="circle"
                                style={{ margin: 5 }}
                                format={(per) => per + "%"}
                                aria-label="mem usage"
                                showInfo
                            />
                        </Card>
                        <Card className="col-span-2 lg:col-span-1" title="Swap">
                            <Progress
                                percent={swappercent}
                                strokeWidth={10}
                                type="circle"
                                style={{ margin: 5 }}
                                format={(per) => per + "%"}
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
                        {/* CPU和Memory图表 */}
                        <div className="col-span-2 lg:col-span-1">
                            <VChart
                                spec={{ ...CPUcommonSpec, data: cpu_datas }}
                                option={{ mode: "desktop-browser" }}
                            />
                        </div>
                        <div className="col-span-2 lg:col-span-1">
                            <VChart
                                spec={{ ...memorycommonSpec, data: mem_datas }}
                                option={{ mode: "desktop-browser" }}
                            />
                        </div>
                    </div>
                </div>

                {/* 右侧：服务器详情 */}
                <div className="lg:col-span-1">
                    <Card className="w-full" title={t("Server detail")}>
                        <Descriptions layout="vertical" align="plain" data={Ddata} column={4} />
                    </Card>
                </div>
            </div>
        </>
    );

}