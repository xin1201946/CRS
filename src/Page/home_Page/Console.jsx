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
    Table
} from "@douyinfe/semi-ui";
import {getServer} from "../../code/get_server.js";
import {useEffect, useMemo, useState} from "react";
import {get_Time} from "../../code/times.js";
import { useTranslation } from 'react-i18next';

export function Console(){
    const { t } = useTranslation();
    const {Content } = Layout;
    const [inputValue, setInputValue] = useState('');
    const [columns,setcolumns] = useState([]);
    const [datas,setdatas] = useState([]);
    const [isLocked, setIsLocked] = useState(false); // 锁机制
    const [queue, setQueue] = useState([]); // 队列
    const [buffer, setBuffer] = useState(''); // 缓冲区，用于缓存文本更新
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
    const handleInputChange = (value) => {
        setInputValue(value);
    };
    const [Table_Visible, setTable_Visible] = useState(false);
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
    const handleCancel = () => {
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
        send_command('exit');
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
    function send_command(command = ''){
        if (inputValue==='clear'){
            setConsoleValue('')
            setInputValue('')
            return
        }
        command = command===''?inputValue:command
        consol_insert_command(command);
        console.log(command);
        const api= getServer()+'/command'+'?command='+command
        fetch(api)
            .then(response => response.json())
            .then(data => {
                console.log('请求成功，返回数据：', data);
                consol_insert_result(data);
                setInputValue('');
            })
            .catch(error => {
                console.error('请求出错：', error);
                consol_insert_result('>'+'Failed：'+error);
            });
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Content className={"semi-always-dark"}
                >
                    <TextArea value={consoleValue} autosize={{ maxRows: 25}} readonly rows={10}  style={{backgroundColor: 'var(--semi-color-bg-1)'}}/>
                </Content>
                <br/>
                <Space
                    style={{
                        width: '40%',
                        display: 'flex',
                        position: 'fixed',
                        bottom: '10%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 99,
                        alignItems: 'center',
                    }}
                >
                    <InputGroup size='large' style={{ width: "100%", marginLeft: '1%' }}>
                        <AutoComplete
                            data={['help', 'blacklist', 'sql', 'clear']}
                            style={{ width: "100%" }}
                            position="top"
                            value={inputValue}
                            onChange={handleInputChange}
                        >
                            <Input
                                data-target="inputConsole"
                                placeholder={t('Run_command_shortcut')}
                            />
                        </AutoComplete>
                    </InputGroup>

                    <Button onClick={()=> {
                        send_command(inputValue)
                    }}>{t('Send')}</Button>

                    <HotKeys hotKeys={hotKeys} onHotKey={()=> {
                        send_command(inputValue)
                    }} render={newHotKeys} />
                </Space>

            </div>
            <Modal
                title="Table_Visible"
                visible={Table_Visible}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Table columns={columns} dataSource={datas} pagination={pagination} />
            </Modal>
        </>
    )
}