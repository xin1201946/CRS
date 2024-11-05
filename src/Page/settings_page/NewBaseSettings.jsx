import {
    Button,
    Card,
    Input, Popover,
    Radio,
    RadioGroup, SideSheet,
    Space,
    Switch,
    Tag,
    Toast,
    Typography
} from "@douyinfe/semi-ui";
import {getSettings, setSettings} from "../../code/Settings.js";
import {useState} from "react";
import {Title} from "@douyinfe/semi-ui/lib/es/skeleton/item.js";
import {IconInfoCircle} from "@douyinfe/semi-icons";
import {setDarkTheme,setLightTheme,setAutoTheme} from "../../code/theme_color.js";
import {AdvancedSettingsPage} from "./AdvancedSettings.jsx";

export function NewBaseSettingsPage() {
    const { Text } = Typography;
    const [switchchecked, setswitchChecked] = useState(true);
    const [advanSvisible, setadvanSVisible] = useState(false);
    const advanSchange = () => {
        setadvanSVisible(!advanSvisible);
    };
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

    function set_autocolor(){
        setAutoTheme();
        setSettings('theme_color','auto')
    }
    function set_light(){
        setLightTheme();
        setSettings('theme_color','light')
    }
    function set_dark(){
        setDarkTheme();
        setSettings('theme_color','dark')
    }
    function save_data(){
        let server_ip=document.getElementById("server_ip_inputbox").value;
        // 去掉前缀
        if (server_ip.startsWith("https://")) {
            server_ip = server_ip.substring(8); // 去掉 https://
            setSettings('use_https','true')
        } else if (server_ip.startsWith("http://")) {
            server_ip = server_ip.substring(7); // 去掉 http://
            setSettings('use_https','false')
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
        if (getSettings('theme_color')!=='auto') {
            if (body.hasAttribute('theme-mode')) {
                return 2
            }else{
                return 1
            }
        } else {
            return 0
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
                        <Radio value={0} extra='' style={{width: 280}}
                               onChange={function () {
                                   set_autocolor()
                               }}
                        >
                            <Space>
                                自动切换
                                <Tag size="small" shape='circle' color='blue'> New </Tag>
                            </Space>
                        </Radio>

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
            <Card  style={{backgroundColor:'var( --semi-color-fill-0)'}}>
                <Space spacing={'medium'} vertical align='left'>
                    <Text style={{
                        fontSize: 'medium',
                        fontWeight: "bold",
                        color: "var( --semi-color-text-2)"
                    }}>在查找其他设置吗？</Text>
                    <Text onClick={advanSchange} style={{color: 'var( --semi-color-link)',cursor:'pointer'}}>HTTPS服务</Text>
                    <Text onClick={advanSchange} style={{color: 'var( --semi-color-link)',cursor:'pointer'}}>API设置</Text>
                </Space>
            </Card>
            <br/>
            <SideSheet style={{maxWidth:"100%"}}  closeOnEsc={true} title="高级设置" visible={advanSvisible} onCancel={advanSchange}>
                <AdvancedSettingsPage></AdvancedSettingsPage>
            </SideSheet>
        </>
    )
}