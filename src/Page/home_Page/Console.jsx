/* eslint-disable no-unused-vars */
import {Button, ButtonGroup, Card, Input, Layout, Modal,Table} from "@douyinfe/semi-ui";
import {getServer} from "../../code/get_server.js";
import {useMemo, useState} from "react";
import {useTranslation} from 'react-i18next';
import {IconSearch} from "@douyinfe/semi-icons";
import WebTerminal from "../widget/WebTerminal";

function Console(){
    const { t } = useTranslation();
    const {Content } = Layout;
    const [columns,setcolumns] = useState([]);
    const [datas,setdatas] = useState([]);
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
    }

    function consol_insert_result(result){
        formatAndSetConsoleValue(result);
    }
    function view_table(){
        send_command('sql').then(result => {
            send_command('--query_all_hub_info').then(result => {
                send_command('exit').then();
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
                        send_command('exit').then();
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
                        send_command('exit').then();
                    });
                });
            },
        });

    }
    async function send_command(command = '') {

        const api = getServer() + '/command' + '?command=' + command;

        try {
            // 使用 await 处理 fetch 请求
            const response = await fetch(api);

            // 如果响应状态不是 2xx，抛出错误
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();  // 解析 JSON 数据
            consol_insert_result(data);
            return data
        } catch (error) {
            return ("Server seems cannot connect:"+error.message)
        }
    }

    return (
        <>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
                <Content >
                    <WebTerminal sendCommand={send_command} />

                </Content>
                <Card
                    bordered={false}
                    style={{
                        width: '100%',
                        display: 'flex',
                        position: 'fixed',
                        bottom: '7%',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 99,
                        alignItems: 'center',
                    }}>
                    <ButtonGroup>
                        <Button onClick={Search_history_Lungu}>{t('Search_history_Lungu')}</Button>
                        <Button onClick={Search_moju_Lungu}>{t('Search_moju_lungu')}</Button>
                        <Button onClick={()=>{view_table()}}>{t('History')}</Button>
                    </ButtonGroup>
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
export default Console