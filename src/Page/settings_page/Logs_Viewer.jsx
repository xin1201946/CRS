import {
    Button,
    Modal,
    Input,
    Card,
    Descriptions,
    Tag,
    Space,
    Popover,
    Typography,
    Collapse
} from "@douyinfe/semi-ui";
import {useEffect, useMemo, useRef, useState} from 'react';
import { Table } from '@douyinfe/semi-ui';
import {get_error_logs, get_logs, get_successfully_logs, get_warning_logs, saveLogsToTxt} from "../../code/log.js";
import { VChart } from "@visactor/react-vchart";
import {  Row } from '@douyinfe/semi-ui';
import {IconInfoCircle,IconHelpCircle} from "@douyinfe/semi-icons";
import {detectDevice} from "../../code/check_platform.js";
import {useTranslation} from "react-i18next";
import {send_notify} from "../../code/SystemToast.jsx";

export  function Logs_Viewer(){
    const { Text } = Typography;
    const { t } = useTranslation();
    const [filteredValue, setFilteredValue] = useState([]);
    const compositionRef = useRef({ isComposition: false });
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [dataSource, setData] = useState([]);
    let Notify_id='';
    useEffect(() => {
        const data = get_logs();
        setData(data);
        function handleResize() {
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    function showInfoDialog(){
        if(detectDevice() === 'Phone'){
            send_notify(t('Warning'),t('Tip_cannot_support_your_device'),null,5,'warning')
        }else{
            Modal.info({
                title: t('More_info'),
                content: <>
                    <Card bordered={false} style={{backgroundColor:'var( --semi-color-bg-2)'}}>
                        <Text style={{color:'var(--semi-color-info)'}}>{t('Logs_count')}</Text>： {t('Logs_count_text')}
                    </Card>
                    <Card bordered={false} style={{backgroundColor:'var( --semi-color-bg-2)'}}>
                        <Text style={{color:'var(--semi-color-success)'}}>{t('Logs_success_count')}</Text>：{t('Logs_success_count_text')}
                    </Card>
                    <Card bordered={false} style={{backgroundColor:'var( --semi-color-bg-2)'}}>
                        <Text style={{color:'var( --semi-color-warning)'}}>{t('Logs_warning_count')}</Text>：{t('Logs_warning_count_text')}
                    </Card>
                    <Card bordered={false} style={{backgroundColor:'var( --semi-color-bg-2)'}}>
                        <Text style={{color:'var(--semi-color-danger)'}}>{t('Logs_error_count')}</Text>：{t('Logs_error_count_text')}
                    </Card>
                </>,
                cancelButtonProps: { theme: 'borderless' },
                okButtonProps: { theme: 'solid' },
            });
        }
    }
    function showDialog(message){
        if(detectDevice() === 'Phone'){
            console.log(Notify_id)
            if (Notify_id === ''){
                Notify_id = send_notify(t('Remarks'),message,null,0,'info',false,'light');
            }else{
                send_notify(t('Remarks'),message,null,0,'info',false,'light',Notify_id);
            }
        }else{
            Modal.info({
                title: t('More_info'),
                content: <><Text>{message}</Text></>,
                cancelButtonProps: { theme: 'borderless' },
                okButtonProps: { theme: 'solid' },
            });
        }
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
            { key: t('Logs_count'), value: <Button theme={"borderless"} size={"small"}>{get_logs().length}</Button> },
            { key: t('Logs_success_count'), value: <Button  type={"primary"} theme={"borderless"} size={"small"}>{get_successfully_logs().length}</Button> },
            { key: t('Logs_warning_count'), value: <Button type={"warning"} theme={"borderless"} size={"small"}>{get_warning_logs().length}</Button>},
            { key: t('Logs_error_count'), value: <Button type={"danger"} theme={"borderless"} size={"small"}>{get_error_logs().length}</Button> },
        ];
        return (
            <>
                <Card
                    shadows='hover'
                    title={t('Roughly_browse')}
                    onClick={showInfoDialog}
                    headerExtraContent={
                        <IconHelpCircle style={{ color: 'var(--semi-color-primary)' }} />
                    }
                >
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
                <Button onClick={() => showDialog(text)}>{t('View')}</Button>
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
                        <span>{t('Event')}</span>
                        <Input
                            placeholder={t('Enter_filter_value')}
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
                title: t('Result'),
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
                title: t('Time'),
                dataIndex: "time",
                key: "time",
                sorter: (a, b) => (new Date(a.time) - new Date(b.time) > 0 ? 1 : -1),
                render: rendertime,
            },
            {
                title: t('Comment'),
                dataIndex: "comment",
                key: "comment",
                render: rendercomment,
            },
        ];

        return (
            <>
                <h3>
                    <Space>
                        {t('Event_list')}
                        <Popover
                            showArrow
                            arrowPointAtCenter
                            content={
                                <article>
                                    {t('Find_E_by_filter')}
                                </article>
                            }
                            position={'right'}
                        >
                            <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }} />
                        </Popover>
                    </Space>
                </h3>
                <Collapse>
                    <Collapse.Panel header={t('Log_control')} itemKey="1" >
                        <Space>
                            <Button theme='outline' type='primary' style={{ marginRight: 8 }} onClick={saveLogsToTxt}>{t('Log_download')}</Button>
                        </Space>
                    </Collapse.Panel>
                </Collapse>
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
                    {t('View_all_info')}
                    <Popover
                        showArrow
                        arrowPointAtCenter
                        content={
                            <article>
                                {t('Tip_Log_View_info')}
                            </article>
                        }
                        position={"right"}
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