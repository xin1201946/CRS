import {
    Banner,
    Button,
    Card,
    Input, Popover,
    Radio,
    RadioGroup,
    Space,
    Switch,
    Tag,
    Toast,
    Typography
} from "@douyinfe/semi-ui";
import {getSettings, setSettings} from "../../code/Settings.js";
import React, {useState} from "react";
import {isHalloweenPeriod} from "../../code/is_wsj.js";
import {Title} from "@douyinfe/semi-ui/lib/es/skeleton/item.js";
import {IconInfoCircle} from "@douyinfe/semi-icons";

export function NewBaseSettingsPage() {
    const body = document.body;
    const [showWSJTheme, setWSJTheme] = useState(getSettings('new_settings_page') === 'true');
    const { Text } = Typography;
    const [switchchecked, setswitchChecked] = useState(true);
    const onswitchChange = checked => {
        setswitchChecked(checked);
        let opts = {
            content: (
                <Space>
                    <Text>UI 更改成功</Text>
                    <Text link={{ href: window.location.href }}>
                        刷新页面
                    </Text>
                </Space>
            ),
            duration: 3,
            stack: true,
        };
        Toast.info(opts);
        setSettings('new_settings_page',checked.toString());
    };
    React.useEffect(() => {
        const isHalloween = isHalloweenPeriod();
        if(isHalloween){
            setWSJTheme(false)
        }
    }, []);
    function theme_int() {
        const isHalloween = isHalloweenPeriod();
        if(isHalloween && (getSettings('is_wsj') ==='true')){
            return 2
        }else{
            return 1
        }
    }
    function showToast(message) {
        let opts = {
            content: (
                <Space>
                    <Text>{message}</Text>
                    <Text link={{ href: window.location.href }}>
                        刷新主题
                    </Text>
                </Space>
            ),
            duration: 3,
            stack: true,
        };
        Toast.info(opts);
    }
    function set_light(){
        body.removeAttribute('theme-mode');
    }
    function set_dark(){
        body.setAttribute('theme-mode', 'dark');
    }
    function save_data(){
        let server_ip=document.getElementById("server_ip_inputbox").value;
        // 去掉前缀
        if (server_ip.startsWith("https://")) {
            server_ip = server_ip.substring(8); // 去掉 https://
        } else if (server_ip.startsWith("http://")) {
            server_ip = server_ip.substring(7); // 去掉 http://
        }
        if (server_ip.endsWith("/")) {
            server_ip = server_ip.slice(0, -1);
        }
        if (setSettings('server_ip',server_ip)){
            let opts = {
                content: (
                    <Space>
                        <Text>保存成功,刷新网页后生效</Text>
                        <Text link={{ href: window.location.href }}>
                            刷新
                        </Text>
                    </Space>
                ),
                duration: 3,
            };
            Toast.success(opts)
        }else{
            let opts = {
                content: '保存失败',
                duration: 3,
            };
            Toast.error(opts)
        }
    }
    function color_int(){
        const body = document.body;
        if (body.hasAttribute('theme-mode')) {
            return 2
        } else {
            return 1
        }
    }
    return(
        <>
            <Card
                title='服务器地址'
            >
                <Space>
                    <Input id={'server_ip_inputbox'} style={{width: '70%'}} defaultValue={getSettings('server_ip')}
                           placeholder='一般是 IP:端口号 或者 域名' size='default'></Input>
                    <Button theme='outline' onClick={save_data} type='primary' style={{marginRight: 8}}>保存</Button>
                </Space>
            </Card>
            <br/>
            <Card title='主题色'>

                <Space>
                    <RadioGroup
                        type='pureCard'
                        defaultValue={color_int()}
                        direction='vertical'
                        aria-label="主题色"
                        name="demo-radio-group-pureCard"
                    >
                        <Radio value={1} extra='' style={{width: 280}}
                               onChange={function () {
                                   set_light()
                               }}
                        >
                            亮色模式
                        </Radio>
                        <Radio value={2} extra='' style={{width: 280}}
                               onChange={function () {
                                   set_dark()
                               }}
                        >
                            暗色模式
                        </Radio>
                    </RadioGroup>
                </Space>
            </Card>
            <br/>
            <Card title='主题'>
                <Banner type={'warning'} fullMode={false}
                        description="部分主题可能影响设备流畅度。如遇卡顿，请切换至默认主题"
                />
                <br/>
                <Space>

                    <RadioGroup
                        type='pureCard'
                        defaultValue={theme_int()}
                        direction='vertical'
                        aria-label="主题"
                        name="demo-radio-group-pureCard"
                    >

                        <Radio value={1} extra='UI 默认配色主题' style={{width: 280}}
                               onChange={function () {
                                   setSettings('is_wsj', 'false');
                                   showToast('加载成功')
                               }}
                        >
                            默认主题
                        </Radio>
                        <Radio value={2} disabled={showWSJTheme} extra='限时在万圣节先后15天内开放'
                               style={{width: 280, fontFamily: "HalloweenEN,HalloweenCN"}}
                               onChange={function () {
                                   setSettings('is_wsj', 'true');
                                   showToast('加载成功')
                               }}
                        >
                            万圣节主题 &nbsp;
                            <Tag size="small" shape='circle' color='blue'> Beta </Tag>
                        </Radio>
                    </RadioGroup>
                </Space>
            </Card>
            <br/>
            <Card title={'UI 设置'}>
                <div style={{display: 'flex', alignItems: 'center'}}>
                    <Title heading={6} style={{margin: 8,backgroundColor:'transparent',width:'90%'}}>
                        <Space>
                            新的设置页面
                            <Tag size="small" shape='circle' color='blue'> New </Tag>
                            <Popover
                                showArrow
                                arrowPointAtCenter
                                content={
                                    <article>
                                        默认开启，打开后使用美化后的设置页.刷新网页后生效
                                    </article>
                                }
                                position={'top'}
                            >
                                <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }}/>
                            </Popover>
                        </Space>
                    </Title>
                    <Switch checked={switchchecked} aria-label="a switch for demo" onChange={onswitchChange}/>
                </div>
            </Card>
            <br/>
        </>
    )
}