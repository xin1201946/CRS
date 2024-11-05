import {Button, Modal, Input, Card, Descriptions, Tag, Space, Popover, Typography} from "@douyinfe/semi-ui";
import {useEffect, useMemo, useRef, useState} from 'react';
import { Table } from '@douyinfe/semi-ui';
import {get_error_logs, get_logs, get_successfully_logs, get_warning_logs} from "../../code/log.js";
import { VChart } from "@visactor/react-vchart";
import {  Row } from '@douyinfe/semi-ui';
import {IconInfoCircle} from "@douyinfe/semi-icons";
import {detectDevice} from "../../code/check_platform.js";
export  function Logs_Viewer(){
    const { Text } = Typography;
    const [filteredValue, setFilteredValue] = useState([]);
    const compositionRef = useRef({ isComposition: false });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [dataSource, setData] = useState([]);
    useEffect(() => {
        const data = get_logs();
        setData(data);
    }, []);
    useEffect(() => {
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    function showDialog(message){
        Modal.info({
            title: '详细信息',
            content: <><Text>{message}</Text></>,
            cancelButtonProps: { theme: 'borderless' },
            okButtonProps: { theme: 'solid' },
        });
    }
    function get_logs_pie(){
        const commonSpec = {
            type: 'pie',
            data: [
                {
                    id: 'id0',
                    values: [
                        { type: 'Success', value: get_successfully_logs().length},
                        { type: 'Warning', value: get_warning_logs().length},
                        { type: 'Error', value: get_error_logs().length},
                    ]
                }
            ],
            valueField: 'value',
            categoryField: 'type',
            label: {
                visible: true
            },
            tooltip: {
                mark: {
                    content: [
                        {
                            key: datum => datum['type'],
                            value: datum => datum['value'] + '%'
                        }
                    ]
                }
            }
        };
        const donutChart = {
            title: {
                visible: true,
                text: '',
                subtext: '',
            },
            legends: {
                visible: true,
                orient: 'right'
            },
        }


        return(
            <>
                <div>
                    <VChart
                        spec={{
                            ...commonSpec,
                            ...(donutChart),
                        }}
                        option={{ mode: "desktop-browser" }}
                    />
                </div>
            </>
        )
    }
    function statistics_info(){
        const data = [
            { key: '日志数量', value: <Button theme={"borderless"} size={"small"}>{get_logs().length}</Button> },
            { key: 'Info级别数量', value: <Button  type={"primary"} theme={"borderless"} size={"small"}>{get_successfully_logs().length}</Button> },
            { key: 'Warning数量', value: <Button type={"warning"} theme={"borderless"} size={"small"}>{get_warning_logs().length}</Button>},
            { key: 'Error数量', value: <Button type={"danger"} theme={"borderless"} size={"small"}>{get_error_logs().length}</Button> },
        ];
        return (
            <>
                <Card shadows='hover'>
                    <Descriptions data={data} />
                </Card>
            </>
        );
    }
    function show_logs() {
        const renderevent = (text) => {
            return (
                <div>
                    {text}
                </div>
            );
        };

        const renderResult = (text) => {
            return (
                <div>
                    <Tag color={text === "successfully" ? "green" : text === "warning" ? "yellow" : "red"}>{text}</Tag>
                </div>
            );
        };

        const rendertime = (text) => {
            return (
                <div>
                    {text}
                </div>
            );
        };

        const rendercomment = (text) => {
            return (
                <Button onClick={() => showDialog(text)}>查看</Button>
            );
        };
        let pagination

        if (detectDevice()==='Phone'){
            // eslint-disable-next-line react-hooks/rules-of-hooks
            pagination = useMemo(
                () => ({
                    pageSize: 5,
                    formatPageText:false ,
                    position: 'top',
                }),
                []
            );
        }else{
            // eslint-disable-next-line react-hooks/rules-of-hooks
            pagination = useMemo(
                () => ({
                    pageSize: 7,
                    position: 'top',
                }),
                []
            );
        }

        const handleChange = (value) => {
            if (compositionRef.current.isComposition) {
                return;
            }
            const newFilteredValue = value ? [value] : [];
            setFilteredValue(newFilteredValue);
        };
        const handleCompositionStart = () => {
            compositionRef.current.isComposition = true;
        };

        const handleCompositionEnd = (event) => {
            compositionRef.current.isComposition = false;
            const value = event.target.value;
            const newFilteredValue = value ? [value] : [];
            setFilteredValue(newFilteredValue);
        };


        const columns = [
            {
                title: (
                    <Space>
                        <span>事件</span>
                        <Input
                            placeholder="请输入筛选值"
                            style={{ width: 200 }}
                            onCompositionStart={handleCompositionStart}
                            onCompositionEnd={handleCompositionEnd}
                            onChange={handleChange}
                            showClear
                        />
                    </Space>
                ),
                dataIndex: "event",
                key: "event",
                width: 400,
                render: renderevent,
                onFilter: (value, record) => record.event.includes(value),
                filteredValue: filteredValue,
            },
            {
                title: "结果",
                dataIndex: "result",
                key: "result",
                render: renderResult,
                sorter: (recordA, recordB) => {
                    const priority = {
                        error: 0,
                        warning: 1,
                        successfully: 2,
                    };
                    if (priority[recordA.result] === priority[recordB.result]) {
                        return 0;
                    }
                    return priority[recordA.result] - priority[recordB.result];
                },
            },
            {
                title: "时间",
                dataIndex: "time",
                key: "time",
                sorter: (a, b) => (new Date(a.time) - new Date(b.time) > 0 ? 1 : -1),
                render: rendertime,
            },
            {
                title: "备注",
                dataIndex: "comment",
                key: "comment",
                render: rendercomment,
            },
        ];

        return (
            <>
                <h3>
                    <Space>
                        事件列表
                        <Popover
                            showArrow
                            arrowPointAtCenter
                            content={
                                <article>
                                    通过筛选定位出错位置
                                </article>
                            }
                            position={'right'}
                        >
                            <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
                        </Popover>
                    </Space>
                </h3>

                <Table
                    style={{width:'100%'}}
                    pagination={pagination}
                    dataSource={dataSource}
                    columns={columns}
                    filteredValue={filteredValue}
                />
            </>
        );
    }
    return (
        <>
            <h3>
                <Space >
                    信息总览
                    <Popover
                        showArrow
                        arrowPointAtCenter
                        content={
                            <article>
                                快速查看UI在浏览器的运行情况
                            </article>
                        }
                        position={'right'}
                    >
                        <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }}/>
                    </Popover>
                </Space>
            </h3>
            <div className={'grid'}>
                <Row type={'flex'} justify={'center'}>
                    <Space spacing={[100,20]} align={'center'} wrap={true}>
                        {windowWidth >= 940 && get_logs_pie()}
                        {statistics_info()}
                    </Space>
                </Row>
            </div>
            {show_logs()}
        </>
    )
}