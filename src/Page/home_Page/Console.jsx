/* eslint-disable no-unused-vars */
import {
    AutoComplete,
    HotKeys,
    Button,
    Input,
    InputGroup,
    Layout,
    Space,
    TextArea,
    Modal,
    Table, Card, Divider
} from "@douyinfe/semi-ui";
import {getServer} from "../../code/get_server.js";
import {useEffect, useMemo, useRef, useState} from "react";
import {get_Time} from "../../code/times.js";
import { useTranslation } from 'react-i18next';
import {IconSearch} from "@douyinfe/semi-icons";

export function Console(){
    const { t } = useTranslation();
    const {Content } = Layout;
    const [inputValue, setInputValue] = useState('');
    const [columns,setcolumns] = useState([]);
    const [datas,setdatas] = useState([]);
    const [isLocked, setIsLocked] = useState(false); // 锁机制
    const [queue, setQueue] = useState([]); // 队列
    const [buffer, setBuffer] = useState(''); // 缓冲区，用于缓存文本更新
    const [Table_Visible, setTable_Visible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [consoleValue, setConsoleValue] = useState('Server Console 1.0 \n');
    const hotKeys = [HotKeys.Keys.Control,"Enter"];
    const newHotKeys = <p></p>;
    // 处理输入值变化的回调函数
    // 设置批量更新延迟（可以调整这个时间来平衡流畅度与性能）
    const batchUpdateDelay = 10; // 100ms 以内的多次调用会合并为一次更新
    function processQueue() {
        if (queue.length === 0 || isLocked) {
            return; // 如果没有待处理的任务或锁被占用，退出
        }

        // 获取队列中的第一个命令
        const nextCommand = queue[0];
        setQueue(queue.slice(1)); // 移除队列中的第一个命令

        // 执行命令
        setIsLocked(true); // 设置锁
        formatAndSetConsoleValue(nextCommand.data);
        setIsLocked(false); // 释放锁
        processQueue(); // 处理下一个命令
    }

    const showDialog = (data) => {
        // 第一行数据作为列名
        const columns_cahce = data[0].map((col, index) => ({
            title: col,  // 标题就是字段名（即第一行的数据）
            dataIndex: col,  // dataIndex也使用字段名
        }));

        // 动态生成da
        const datas_cache = data.slice(1).map((row, index) => {
            const rowData = {};
            row.forEach((value, colIndex) => {
                const colName = data[0][colIndex];  // 获取列名（第一行的内容）
                rowData[colName] = value;  // 将列名作为key，值为当前行的值
            });

            return {
                key: (index + 1).toString(),  // key值从1开始
                ...rowData,  // 展开当前行的内容
            };
        });
        setcolumns(columns_cahce)
        setdatas(datas_cache)
        console.log("Columns:", columns);
        console.log("Data:", datas);
        setTable_Visible(true);
    };
    const handleOk = () => {
        setTable_Visible(false);
    };
    let pagination = useMemo(
        () => ({
            pageSize: 5,
            formatPageText:false ,
            position: 'top',
        }),
        []
    );
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // 监听窗口大小变化事件
        window.addEventListener('resize', handleResize);

        send_command('exit').then();
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
    function formatAndSetConsoleValue(data) {
        let newTextToAppend = '';

        // 尝试将传入的字符串解析为 JSON 对象
        let parsedData;
        try {
            parsedData = JSON.parse(data); // 尝试解析为 JSON 对象
        } catch (e) {
            parsedData = data; // 如果解析失败，data 就是普通字符串
        }

        // 如果是数组
        if (Array.isArray(parsedData)) {
            // 检查是否为二维数组（例如表格数据）
            if (parsedData.length > 0 && Array.isArray(parsedData[0])) {
                // 处理表格数据（二维数组）
                showDialog(parsedData); // 如果有需要的对话框
                parsedData.forEach((row, rowIndex) => {
                    const rowText = row.map(cell => {
                        // 如果是对象，格式化为 JSON 字符串
                        if (typeof cell === 'object') {
                            return JSON.stringify(cell, null, 2);
                        }
                        return cell;
                    }).join('\t'); // 使用 tab 键连接每一列的数据

                    // 第一行是表头，后续行是数据
                    if (rowIndex > 0) {
                        newTextToAppend += '\n' + rowText;
                    } else {
                        newTextToAppend = rowText; // 第一行（表头）
                    }
                });
            } else {
                // 处理普通的一维数组数据
                parsedData.forEach((item, index) => {
                    if (typeof item === 'object') {
                        item = JSON.stringify(item, null, 2);
                    }
                    if (index > 0) {
                        newTextToAppend += '\n' + item;
                    } else {
                        newTextToAppend = item; // 第一项
                    }
                });
            }
        }
        // 如果是 JSON 对象
        else if (typeof parsedData === 'object' && parsedData !== null) {
            newTextToAppend = JSON.stringify(parsedData, null, 2); // 格式化 JSON 对象
        } else {
            // 如果是普通字符串，直接使用
            newTextToAppend = parsedData;
        }

        // 如果有新文本，更新控制台内容
        if (newTextToAppend) {
            // 将更新放入缓存中，而不是立即更新控制台
            setBuffer(prevBuffer => prevBuffer + '\n' + newTextToAppend);

            // 设置延迟更新（批量更新）
            clearTimeout(window.batchUpdateTimeout);
            window.batchUpdateTimeout = setTimeout(() => {
                setConsoleValue(prev => prev + buffer + '\n' + newTextToAppend);
                setBuffer(''); // 清空缓冲区
            }, batchUpdateDelay);
            // setConsoleValue(consoleValue + '\n' + newTextToAppend);
        }
    }
    function consol_insert_result(result){
        let code =result;
        if (!isLocked) {
            formatAndSetConsoleValue(code);
        } else {
            setQueue(prevQueue => [...prevQueue, { type: 'result', data: code }]);
        }
    }
    function consol_insert_command(command){
        let code = "┌──(㉿)-["+get_Time()+"]\n"+"└─#\t" +command+"\n";
        if (!isLocked) {
            formatAndSetConsoleValue(code);
        } else {
            setQueue(prevQueue => [...prevQueue, { type: 'command', data: code }]);
        }
    }
    function view_table(){
        send_command('sql').then(result => {
            send_command('--query_all_hub_info').then(result => {
                send_command('exit');
            })
        })
    }

    const Search_history_Lungu =()=>{
        let value=""
        Modal.info({
            title: 'Quick Search',
            content: (
                <Input
                    onChange={(e) => {
                        value = e; // 更新局部状态
                    }}
                />
            ),
            icon: <IconSearch />,
            cancelButtonProps: { theme: 'borderless' },
            okButtonProps: { theme: 'solid' },
            onOk: () => {
                // 在这里使用局部状态的值
                send_command('sql').then((result) => {
                    send_command('--lun-gu-info-model ' + value).then((result) => {
                        send_command('exit');
                    });
                });
            },
        });
    }

    const Search_moju_Lungu = () =>{
        let value=""
        Modal.info({
            title: 'Quick Search',
            content: (
                <Input
                    onChange={(e) => {
                        value = e; // 更新局部状态
                    }}
                />
            ),
            icon: <IconSearch />,
            cancelButtonProps: { theme: 'borderless' },
            okButtonProps: { theme: 'solid' },
            onOk: () => {
                // 在这里使用局部状态的值

                send_command('sql').then((result) => {
                    send_command('--mo-ju-jinfo-model ' + value).then((result) => {
                        send_command('exit');
                    });
                });
            },
        });

    }

    async function send_command(command = '') {
        if (inputValue === 'clear' || command === 'clear') {
            setConsoleValue('');
            setInputValue('');
            return;
        }

        // 如果没有传递command参数，使用inputValue
        command = command === '' ? inputValue : command;
        consol_insert_command(command);
        console.log(command);

        const api = getServer() + '/command' + '?command=' + command;

        try {
            // 使用 await 处理 fetch 请求
            const response = await fetch(api);

            // 如果响应状态不是 2xx，抛出错误
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();  // 解析 JSON 数据
            console.log('请求成功，返回数据：', data);
            consol_insert_result(data);
            setInputValue('');  // 清空输入框
        } catch (error) {
            console.error('请求出错：', error);
            consol_insert_result('>' + 'Failed：' + error);
        }
    }


    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Content className={"semi-always-dark"}
                >
                    <TextArea value={consoleValue} autosize={{ maxRows: 25}} readonly rows={10}  style={{backgroundColor: 'var(--semi-color-bg-1)'}}/>
                </Content>
                <Card
                    bordered={false}
                    style={{
                        width: '100%',
                        display: 'flex',
                        position: 'fixed',
                        bottom: '5%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 99,
                        alignItems: 'center',
                    }}>
                    <Space wrap={true}>
                        <Input
                            onChange={(e)=>{setInputValue(e)}}
                            value={inputValue}
                            style={{width:windowWidth*0.3   }}
                            data-target="inputConsole"
                            placeholder={t('Run_command_shortcut')}
                            onEnterPress={()=>{send_command(inputValue)}}
                        />

                        <Button onClick={()=> {
                            send_command(inputValue)
                        }}>{t('Send')}</Button>
                        <Button onClick={()=>{send_command('help')}}>{t('Help')}</Button>

                        <Button onClick={()=>{send_command('clear')}}>{t('Clear Console')}</Button>

                        <Divider layout="vertical" margin='12px'/>
                        <Button onClick={Search_history_Lungu}>{t('Search_history_Lungu')}</Button>
                        <Button onClick={Search_moju_Lungu}>{t('Search_moju_lungu')}</Button>

                        <Button onClick={()=>{view_table()}}>{t('History')}</Button>
                        <HotKeys hotKeys={hotKeys} onHotKey={()=> {
                            send_command(inputValue)
                        }} render={newHotKeys} />
                    </Space>
                </Card>

            </div>
            <Modal
                title="Table"
                visible={Table_Visible}
                onOk={handleOk}
                onCancel={handleOk}
            >
                <Table columns={columns} dataSource={datas} pagination={pagination} />
            </Modal>
        </>
    )
}