import {
    Banner,
    Button,
    Card,
    Input,
    Popconfirm,
    Popover,
    SideSheet,
    Space,
    Switch,
    Typography
} from "@douyinfe/semi-ui";
import {getSettings, setSettings} from "../../code/Settings.js";
import {IconInfoCircle} from "@douyinfe/semi-icons";
import {useState} from "react";
import {getAPI,  setAPIJ, setDefaultAPI} from "../../code/server_api_settings.js";
import BaseSPage from "./BaseS.jsx";
import {Logs_Viewer} from "./Logs_Viewer.jsx";

export function AdvancedSettingsPage() {
    const [httpschecked, sethttpsChecked] = useState(getSettings('use_https')==='true');

    const { Text } = Typography;
    const [advanSvisible, setadvanSVisible] = useState(false);
    const advanSchange = () => {
        setadvanSVisible(!advanSvisible);
    };
    const [LogsPvisible, setLogsPVisible] = useState(false);
    const LogsPchange = () => {
        setLogsPVisible(!LogsPvisible);
    };
    const onhttpschange = (e) =>{
        sethttpsChecked(e)
        setSettings('use_https',e);
    }
    const onsave_api=()=>{
        const resultJson={
            "api_isHTTPS":document.getElementById('isHTTPS').value,
            "api_upload":document.getElementById('upload').value,
            "api_clear":document.getElementById('clear').value,
            "api_getpicture":document.getElementById('getpicture').value,
            "api_info":document.getElementById('info').value,
            "api_start":document.getElementById('start').value,
            "api_test":document.getElementById('test').value,
        }
        setAPIJ(resultJson);
        // eslint-disable-next-line no-self-assign
        window.location.href = window.location.href
    }
    const changeDefaultapi=()=>{
        setDefaultAPI()
        // eslint-disable-next-line no-self-assign
        window.location.href = window.location.href
    }
    return (
        <>
            <Card
                header={<Text>HTTPS服务设置</Text>}
            >
                <Banner fullMode={false} type="info" bordered icon={null} closeIcon={null}
                        title={<div style={{
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '20px'
                        }}>不知道服务器是否启用了HTTPS服务？</div>}
                        description={<div>你可以先关闭HTTPS服务，如果可以网站可以正常使用则代表服务器不支持HTTPS，否则请打开它。<br/> 请在切换完毕后<Text
                            link={{href: window.location}}>刷新网页</Text>已更新连接状态</div>}
                />
                <br/>
                <Space>
                    使用HTTPS
                    <Popover
                        showArrow
                        position={'top'}
                        content={
                            <article>
                                {getSettings('use_https') === 'true' ? '请确保链接指向的服务器支持HTTPS服务。如果不支持HTTPS，会导致无法与服务器通信' : '如果你提供的链接指向的服务器支持HTTPS，请开启该选项'}
                            </article>
                        }
                    >
                        <IconInfoCircle style={{color: 'var(--semi-color-primary)'}}></IconInfoCircle>
                    </Popover>
                    <Switch checked={httpschecked} onChange={onhttpschange} aria-label="a switch for demo"></Switch>
                </Space>
                <br/>
                <br/>
                <Space>
                    HTTPS状态 {getSettings('use_https')}
                    <Popover
                        showArrow
                        position={'top'}
                        content={
                            <article>
                                {getSettings('use_https') === 'true' ? '发送的信息将通过HTTPS服务发送' : '发送的信息将通过HTTP服务发送'}
                            </article>
                        }
                    >
                        <IconInfoCircle style={{color: 'var(--semi-color-primary)'}}></IconInfoCircle>
                    </Popover>
                </Space>
            </Card>
            <br/>
            <Card
                header={<Text>API 设置</Text>}
            >
                <Banner fullMode={false} icon={null} type="danger" bordered closeIcon={null}
                        title={<div style={{fontWeight: 600, fontSize: '14px', lineHeight: '20px'}}>⚠ 注意</div>}
                        description={
                            <div>请确保服务器的API与本页面填写的API相同，否则会导致无法连接服务器<br/> 请在切换完毕后<Text
                                link={{href: window.location}}>刷新网页</Text>已更新连接状态</div>}
                >
                    <div className="semi-modal-footer">
                        <Popconfirm
                            title="确定是否要保存此修改？"
                            content="你可以随时恢复默认设置"
                            position={"bottomRight"}
                            onConfirm={onsave_api}
                        >
                            <Button className="semi-button semi-button-tertiary semi-button-light"
                                    type="button">保存</Button>
                        </Popconfirm>
                        <Popconfirm
                            title="确定是否要保存此修改？"
                            content="你将丢失所保存的设置"
                            position={"bottomRight"}
                            onConfirm={changeDefaultapi}
                        >
                            <Button className="semi-button semi-button-warning" type="button">恢复默认设置</Button>
                        </Popconfirm>
                    </div>
                </Banner>
                <br/>
                <Space id={'api_input_box'} vertical align={'left'}>
                    <Space  spacing={'medium'} align={'baseline'}>
                        <Text style={{width:'50%'}}>检测是否支持HTTPS</Text>
                        <Input id={'isHTTPS'} style={{width:'50%'}} defaultValue={getAPI("isHTTPS")}></Input>
                    </Space>
                    <Space  spacing={'medium'}>
                        <Text style={{width:'50%'}}>上传图片</Text>
                        <Input id={'upload'} style={{width:'50%'}} defaultValue={getAPI("upload")}></Input>
                    </Space>
                    <Space  spacing={'medium'}>
                        <Text style={{width:'50%'}}>清空图片</Text>
                        <Input id={'clear'} style={{width:'50%'}} defaultValue={getAPI("clear")}></Input>
                    </Space>
                    <Space  spacing={'medium'}>
                        <Text style={{width:'50%'}}>获取图片</Text>
                        <Input id={'getpicture'} style={{width:'50%'}} defaultValue={getAPI("getpicture")}></Input>
                    </Space>
                    <Space  spacing={'medium'}>
                        <Text style={{width:'50%'}}>已上传图片的信息</Text>
                        <Input id={'info'} style={{width:'50%'}} defaultValue={getAPI("info")}></Input>
                    </Space>
                    <Space  spacing={'medium'}>
                        <Text style={{width:'50%'}}>发送处理请求</Text>
                        <Input id={'start'} style={{width:'50%'}} defaultValue={getAPI("start")}></Input>
                    </Space>
                    <Space  spacing={'medium'}>
                        <Text style={{width:'50%'}}>测试是否连通</Text>
                        <Input id={'test'} style={{width:'50%'}} defaultValue={getAPI("test")}></Input>
                    </Space>
                </Space>
            </Card>
            <br/>
            <Card style={{backgroundColor: 'var( --semi-color-fill-0)'}}>
                <Space spacing={'medium'} vertical align='left'>
                    <Text style={{
                        fontSize: 'medium',
                        fontWeight: "bold",
                        color: "var( --semi-color-text-2)"
                    }}>在查找其他设置吗？</Text>
                    <Text onClick={advanSchange}
                          style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>服务器IP</Text>
                    <Text onClick={advanSchange}
                          style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>主题色</Text>
                    <Text onClick={advanSchange}
                          style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>UI 设置</Text>
                    <Text onClick={LogsPchange}
                          style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>日志查看器</Text>
                </Space>
            </Card>
            <br/>
            <SideSheet style={{maxWidth: "100%"}} closeOnEsc={true} title="基本设置" visible={advanSvisible}
                       onCancel={advanSchange}>
                <BaseSPage></BaseSPage>
            </SideSheet>
            <SideSheet style={{width: "100%"}} closeOnEsc={true} title="日志查看器" visible={LogsPvisible}
                       onCancel={LogsPchange}>
                <Logs_Viewer></Logs_Viewer>
            </SideSheet>
            <br/>
        </>
    )
}