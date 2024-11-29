import {AutoComplete, Button, Input, InputGroup, Layout, Space, TextArea} from "@douyinfe/semi-ui";
import {getAPI} from "../../code/server_api_settings.js";
import {getServer} from "../../code/get_server.js";
import {useEffect, useState} from "react";

export function Console(){
    const {Content } = Layout;
    const [inputValue, setInputValue] = useState('');
    const [consoleValue, setConsoleValue] = useState('Server Console 1.0 \n');
    // 处理输入值变化的回调函数
    const handleInputChange = (value) => {
        setInputValue(value);
    };
    useEffect(() => {
        send_command('exit');
    }, []);
    function formatAndSetConsoleValue(data) {
        let newTextToAppend = '';

        if (Array.isArray(data)) {
            // 如果是列表或表格（二维数组）
            if (data.length > 0 && Array.isArray(data[0])) {
                // 处理表格数据（二维数组）
                data.forEach((row, rowIndex) => {
                    let rowText = row.map((cell) => {
                        if (typeof cell === 'object') {
                            return JSON.stringify(cell, null, 2);
                        } else {
                            return cell;
                        }
                    }).join('\t');
                    if (rowIndex > 0) {
                        setConsoleValue(consoleValue + '\n' + rowText);
                    } else {
                        newTextToAppend = rowText;
                    }
                });
            } else {
                // 处理普通列表数据
                data.forEach((item, index) => {
                    if (typeof item === 'object') {
                        item = JSON.stringify(item, null, 2);
                    }
                    if (index > 0) {
                        setConsoleValue(consoleValue + '\n' + item);
                    } else {
                        newTextToAppend = item;
                    }
                });
            }
        } else if (typeof data === 'object' && data!== null) {
            // 如果是JSON数据
            newTextToAppend = JSON.stringify(data, null, 2);
            // 将格式化后的JSON数据按行拆分并逐行设置到consoleValue
            const jsonLines = newTextToAppend.split('\n');
            jsonLines.forEach((line, lineIndex) => {
                if (lineIndex > 0) {
                    setConsoleValue(consoleValue + '\n' + line);
                } else {
                    newTextToAppend = line;
                }
            });
        } else {
            // 如果是普通字符串，直接使用
            newTextToAppend = data;
        }

        if (newTextToAppend) {
            setConsoleValue(consoleValue + '\n' + newTextToAppend);
        }
    }
    function send_command(command = ''){
        if (inputValue==='clear'){
            setConsoleValue('')
            setInputValue('')
            return
        }
        command= command===''?inputValue:command
        console.log(command);
        const api= getServer()+'/'+getAPI('command')+'?command='+command
        fetch(api)
            .then(response => response.json())
            .then(data => {
                console.log('请求成功，返回数据：', data);
                formatAndSetConsoleValue('>'+ data)
                setInputValue('')
            })
            .catch(error => {
                console.error('请求出错：', error);
                formatAndSetConsoleValue('>'+'请求出错：'+error)
            });
    }

    return (
        <>
            <Content className={"semi-always-dark"}
            >
                <TextArea value={consoleValue} autosize={{ maxRows: 25}} readonly rows={10}  style={{backgroundColor: 'var(--semi-color-bg-1)'}}/>
            </Content>
            <br/>
            <Space style={{width:'100%'}}>
                <InputGroup style={{ width: "100%"}} >
                    <AutoComplete
                        data={['help','blacklist','sql']}
                        style={{ width: "100%"}}
                        value={inputValue}
                        onChange={handleInputChange} // 当用户输入并触发搜索（比如按下回车键等）时调用这个函数来更新输入值
                    >
                        <Input  placeholder='Command: ' onChange={(e) => handleInputChange(e.target.value)} />
                    </AutoComplete>
                </InputGroup>
                <Button onClick={function (){send_command()}}>发送</Button>
            </Space>
        </>
    )
}