import {Card, Col, Descriptions, Progress, Row, Space} from "@douyinfe/semi-ui";
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
    const [gpu,setgpu] = useState(0);
    const [hostname,sethostname] = useState("");
    const [server_info,setserver_info] = useState("Waiting");
    const [platformR,setplatformR] = useState("");
    const [swaptotal,setswaptotal] = useState(0);
    const [swappercent,setswappercent] = useState(0);
    const [runTime,setrunTime] = useState("");

    const set_info= (data) => {
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

    return <>
        <div className="grid">
            <Row>
                <Col span={18}>
                    <Row>
                        <Col>
                            <Space style={{ width: '90%' }}>
                                <Card title={"CPU"} style={{ width: '100%' }}>
                                    <Space>
                                        <Progress
                                            percent={cpu_percent[cpu_percent.length-1]}
                                            type="circle"
                                            strokeWidth={10}
                                            format={per => per + '%'}
                                            style={{ margin: 5 }}
                                            aria-label="disk usage"
                                            showInfo
                                        />
                                    </Space>
                                </Card>
                                <Card title={"GPU"} style={{ width: '100%' }}>
                                    <Progress
                                        percent={isNaN(Math.floor(gpu["load"]))?0:Math.floor(gpu["load"])}
                                        strokeWidth={10}
                                        type="circle"
                                        style={{ margin: 5 }}
                                        format={per => per + '%'}
                                        aria-label="disk usage"
                                        showInfo
                                    />
                                </Card>
                                <Card title={"Memory"} style={{ width: '100%' }}>
                                    <Progress
                                        percent={mem_percent[mem_percent.length-1]}
                                        strokeWidth={10}
                                        type="circle"
                                        style={{ margin: 5 }}
                                        format={per => per + '%'}
                                        aria-label="disk usage"
                                        showInfo
                                    />
                                </Card>
                                <Card title={"Swap"} style={{ width: '100%' }}>
                                    <Progress
                                        percent={swappercent}
                                        strokeWidth={10}
                                        type="circle"
                                        style={{ margin: 5 }}
                                        format={per => per + '%'}
                                        aria-label="disk usage"
                                        showInfo
                                    />
                                </Card>
                            </Space>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={11}><VChart
                            spec={{ ...CPUcommonSpec,  data: cpu_datas }}
                            option={{ mode: "desktop-browser"}}
                        /></Col>
                        <Col  span={11}><VChart
                            spec={{ ...memorycommonSpec,  data: mem_datas }}
                            option={{ mode: "desktop-browser"}}
                        /></Col>
                    </Row>
                </Col>
                <Col span={6}>
                    <Card title={t('Server detail')}>
                        <Descriptions layout='vertical' align='plain' data={Ddata} column={4} />
                    </Card>
                </Col>
            </Row>
        </div>

    </>
}