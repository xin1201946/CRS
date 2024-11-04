import {useState} from "react";
import {
    Banner,
    Button,
    Collapse,
    Input, Popover,
    Radio,
    RadioGroup,
    Space, Switch,
    Tag,
    Toast,
    Typography
} from "@douyinfe/semi-ui";
import {getSettings, setSettings} from "../../code/Settings.js";
import {IconInfoCircle} from "@douyinfe/semi-icons";
import {Title} from "@douyinfe/semi-ui/lib/es/skeleton/item.js";

export function  OldBaseSettingsPage() {
    const body = document.body;
    const { Text } = Typography;
    const [switchchecked, setswitchChecked] = useState(getSettings('new_settings_page') === 'true');
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
                stack: true,
            };
            Toast.success(opts)
        }else{
            let opts = {
                content: '保存失败',
                duration: 3,
                stack: true,
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
            <Banner
                fullMode={false}
                closeIcon={null}
                type="warning"
                description="当前设置页仍在使用兼容Hook模式，并未迁移至新的API，可能会在某些功能产生兼容性问题。"
            />
            <Collapse  accordion  defaultActiveKey="1">
                <Collapse.Panel header="服务器地址" itemKey="1">
                    <Space>
                        <Input id={'server_ip_inputbox'} style={{width:'70%'}} defaultValue={getSettings('server_ip')}
                               placeholder='一般是 IP:端口号 或者 域名' size='default'></Input>
                        <Button theme='outline' onClick={save_data} type='primary' style={{marginRight: 8}}>保存</Button>
                    </Space>
                </Collapse.Panel>
                <Collapse.Panel header="主题色" itemKey="2">
                    <Banner
                        fullMode={false}
                        closeIcon={null}
                        type="warning"
                        description="切换的主题色将会在刷新页面后重置"
                    />
                    <br/>
                    <Space>
                        <RadioGroup
                            type='pureCard'
                            defaultValue={color_int()}
                            direction='vertical'
                            aria-label="主题色"
                            name="demo-radio-group-pureCard"
                        >
                            <Radio value={1} extra='' style={{ width: 280 }}
                                   onChange={function () {
                                       set_light()
                                   }}
                            >
                                亮色模式
                            </Radio>
                            <Radio value={2} extra='' style={{ width: 280 }}
                                   onChange={function () {
                                       set_dark()
                                   }}
                            >
                                暗色模式
                            </Radio>
                        </RadioGroup>
                    </Space>
                </Collapse.Panel>

                <Collapse.Panel header="UI 设置" itemKey="4">
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Title heading={6} style={{margin: 8, backgroundColor: 'transparent', width: '90%'}}>
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
                </Collapse.Panel>
            </Collapse>
        </>
    )
}