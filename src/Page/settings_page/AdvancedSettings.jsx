import {Banner, Button, Card, Input, Popconfirm, Popover, Space, Switch, Typography} from "@douyinfe/semi-ui";
import {getSettings, setSettings} from "../../code/Settings.js";
import {IconInfoCircle} from "@douyinfe/semi-icons";
import {useState} from "react";
import {getAPI,  setAPIJ, setDefaultAPI} from "../../code/server_api_settings.js";

export function AdvancedSettingsPage() {
    const [httpschecked, sethttpsChecked] = useState(getSettings('use_https')==='true');

    const { Text } = Typography;
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
                        title={<div style={{ fontWeight: 600, fontSize: '14px', lineHeight: '20px' }}>不知道服务器是否启用了HTTPS服务？</div>}
                        description={<div>你可以先关闭HTTPS服务，如果可以网站可以正常使用则代表服务器不支持HTTPS，否则请打开它。<br/> 请在切换完毕后<Text link={{href:window.location}}>刷新网页</Text>已更新连接状态</div>}
                />
                <br/>
                <Space>
                    使用HTTPS
                    <Popover
                        showArrow
                        position={'top'}
                        content={
                            <article>
                                {getSettings('use_https')==='true' ? '请确保链接指向的服务器支持HTTPS服务。如果不支持HTTPS，会导致无法与服务器通信' : '如果你提供的链接指向的服务器支持HTTPS，请开启该选项'}
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
                                {getSettings('use_https')==='true' ? '发送的信息将通过HTTPS服务发送' : '发送的信息将通过HTTP服务发送'}
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
                <Banner fullMode={false} type="danger" bordered  closeIcon={null}
                        title={<div style={{ fontWeight: 600, fontSize: '14px', lineHeight: '20px' }}>⚠ 注意</div>}
                        description={<div>请确保服务器的API与本页面提供的API端口不符，否则会导致无法连接服务器<br/> 请在切换完毕后<Text link={{href:window.location}}>刷新网页</Text>已更新连接状态</div>}
                >
                    <div className="semi-modal-footer">
                        <Popconfirm
                            title="确定是否要保存此修改？"
                            content="你可以随时恢复默认设置"
                            position={"bottomRight"}
                            onConfirm={onsave_api}
                        >
                            <Button className="semi-button semi-button-tertiary semi-button-light" type="button">保存</Button>
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
                <Space id={'api_input_box'} vertical style={{width: '100%'}}>
                    <Space style={{width: '100%'}} spacing={'medium'}>
                        <Text>检测是否支持HTTPS</Text>
                        <Input id={'isHTTPS'} defaultValue={getAPI("isHTTPS")} ></Input>
                    </Space>
                    <Space style={{width:'100%'}} spacing={'medium'}>
                        <Text>上传图片</Text>
                        <Input id={'upload'} defaultValue={getAPI("upload")}></Input>
                    </Space>
                    <Space style={{width:'100%'}} spacing={'medium'}>
                        <Text>清空图片</Text>
                        <Input id={'clear'} defaultValue={getAPI("clear")}></Input>
                    </Space>
                    <Space style={{width:'100%'}} spacing={'medium'}>
                        <Text>获取图片</Text>
                        <Input id={'getpicture'} defaultValue={getAPI("getpicture")}></Input>
                    </Space>
                    <Space style={{width:'100%'}} spacing={'medium'}>
                        <Text>已上传图片的信息</Text>
                        <Input id={'info'} defaultValue={getAPI("info")}></Input>
                    </Space>
                    <Space style={{width:'100%'}} spacing={'medium'}>
                        <Text>发送处理请求</Text>
                        <Input id={'start'} defaultValue={getAPI("start")}></Input>
                    </Space>
                    <Space style={{width:'100%'}} spacing={'medium'}>
                        <Text>测试是否连通</Text>
                        <Input id={'test'} defaultValue={getAPI("test")}></Input>
                    </Space>
                </Space>
            </Card>
        </>
    )
}