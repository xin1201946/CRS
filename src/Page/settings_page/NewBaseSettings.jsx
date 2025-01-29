import {
    Banner,
    Button,
    Card,
    Input, Popover,
    Radio,
    RadioGroup, SideSheet,
    Space,
    Switch,
    Tag,
    Typography
} from "@douyinfe/semi-ui";
import {getSettings, setSettings} from "../../code/Settings.js";
import {useState} from "react";
import {Title} from "@douyinfe/semi-ui/lib/es/skeleton/item.js";
import {IconInfoCircle} from "@douyinfe/semi-icons";
import {setDarkTheme,setLightTheme,setAutoTheme} from "../../code/theme_color.js";
import {AdvancedSettingsPage} from "./AdvancedSettings.jsx";
import {Logs_Viewer} from "./Logs_Viewer.jsx";
import {useTranslation} from "react-i18next";
import {send_notify} from "../../code/SystemToast.jsx";

export function NewBaseSettingsPage() {
    const { t } = useTranslation();
    const { Text } = Typography;
    const [switchSetPchecked, setswitchSetPchecked] = useState('true'===getSettings('new_settings_page'));
    const [switchMenuPchecked, setswitchMenuPchecked] = useState('true'===getSettings('use_app_content_menu'));
    const [use_ai_page_checked, set_use_ai_pagechecked] = useState('true'===getSettings('use_ai_page'));
    const [advanSvisible, setadvanSVisible] = useState(false);
    const advanSchange = () => {
        setadvanSVisible(!advanSvisible);
    };
    const [LogsPvisible, setLogsPVisible] = useState(false);
    const LogsPchange = () => {
        setLogsPVisible(!LogsPvisible);
    };
    const onswitchChange = checked => {
        setswitchSetPchecked(checked);
        let opts = {
            content: (
                <Space>
                    <Text>{t('Success_change_UI')}</Text>
                    <Text link={{ href: window.location.href }}>
                        {t('Refresh')}
                    </Text>
                </Space>
            ),
            duration: 3,
            stack: true,
        };
        send_notify(t('New_Notify_Send'),opts['content'],null,opts['duration']);
        setSettings('new_settings_page',checked.toString());
    };
    const onswitchMenuChange = checked => {
        setswitchMenuPchecked(checked);
        let opts = {
            content: (
                <Space>
                    <Text>{t('Success_change_UI')}</Text>
                    <Text link={{ href: window.location.href }}>
                        {t('Refresh')}
                    </Text>
                </Space>
            ),
            duration: 3,
            stack: true,
        };
        send_notify(t('New_Notify_Send'),opts['content'],null,opts['duration']);
        setSettings('use_app_content_menu',checked.toString());
    };
    const onchange_ai_page = checked => {
        set_use_ai_pagechecked(checked);
        setSettings('use_ai_page',checked.toString());
        window.location.reload();
    }
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
        } else {
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
                        <Text>{t('Success_save_set')}</Text>
                        <Text link={{ href: window.location.href }}>
                            {t('Refresh')}
                        </Text>
                    </Space>
                ),
                duration: 3,
            };
            send_notify(t('New_Notify_Send'),opts['content'],null,opts['duration'],'success');
        }else{
            let opts = {
                content: t('Failed_save'),
                duration: 3,
            };
            send_notify(t('New_Notify_Send'),opts['content'],null,opts['duration'],'error');
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
            <div id={'newSettings'}>
                <Card
                    title={t('Server_IP')}
                >
                    <Space>
                        <Input id={'server_ip_inputbox'} style={{width: '70%'}} defaultValue={getSettings('server_ip')}
                               placeholder={t('Tip_server_ip')} size='default'></Input>
                        <Button theme='outline' onClick={save_data} type='primary'
                                style={{marginRight: 8}}>{t('Save_setting')}</Button>
                    </Space>
                </Card>
                <br/>
                <Card title={t('Theme_color')}>
                    <Space>
                        <RadioGroup
                            type='pureCard'
                            defaultValue={color_int()}
                            direction='vertical'
                            aria-label={'Theme_color'}
                            name="demo-radio-group-pureCard"
                        >
                            <Radio value={0} extra='' style={{width: 280}}
                                   onChange={function () {
                                       set_autocolor()
                                   }}
                            >
                                <Space>
                                    {t('Theme_auto')}
                                    <Tag size="small" shape='circle' color='blue'> New </Tag>
                                </Space>
                            </Radio>

                            <Radio value={1} extra='' style={{width: 280}}
                                   onChange={function () {
                                       set_light()
                                   }}
                            >
                                {t('Theme_light')}
                            </Radio>
                            <Radio value={2} extra='' style={{width: 280}}
                                   onChange={function () {
                                       set_dark()
                                   }}
                            >
                                {t('Theme_dark')}
                            </Radio>
                        </RadioGroup>
                    </Space>
                </Card>
                <br/>
                <Card title={t('UI_set')}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Title heading={6} style={{margin: 8, backgroundColor: 'transparent', width: '90%'}}>
                            <Space>
                                {t('New_settings_page')}
                                <Popover
                                    showArrow
                                    arrowPointAtCenter
                                    content={
                                        <article>
                                            {t('Success_save_set')}
                                        </article>
                                    }
                                    position={'top'}
                                >
                                    <IconInfoCircle style={{color: 'var(--semi-color-primary)'}}/>
                                </Popover>
                            </Space>
                        </Title>
                        <Switch checked={switchSetPchecked} onChange={onswitchChange}/>
                    </div>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Title heading={6} style={{margin: 8, backgroundColor: 'transparent', width: '90%'}}>
                            <Space>
                                {t('Use the built-in right-click menu')}
                                <Tag size="small" shape='circle' color='blue'> New </Tag>
                                <Popover
                                    showArrow
                                    arrowPointAtCenter
                                    content={
                                        <article>
                                            {t('Success_save_set')}
                                        </article>
                                    }
                                    position={'top'}
                                >
                                    <IconInfoCircle style={{color: 'var(--semi-color-primary)'}}/>
                                </Popover>
                            </Space>
                        </Title>
                        <Switch checked={switchMenuPchecked} onChange={onswitchMenuChange}/>
                    </div>
                </Card>
                <br/>
                <Card title={t('AI Setting')}>
                    <Space vertical align={'left'}>
                        <Banner fullMode={false} type="success" bordered icon={null} closeIcon={null}
                                title={<div style={{ fontWeight: 600, fontSize: '14px', lineHeight: '20px' }}>{t('Increase productivity with Gemini built into Chrome')}</div>}
                                description={
                                    <Space vertical align={'left'}>
                                        <Text>注意事项</Text>
                                        <Text>
                                            这些功能依赖于 Google Chrome 内置的 Gemini nano AI，且该功能处于实验性阶段。使用 AI 时，可能会得到不正确或令人反感的信息。这些信息不受 Google 以及 CCRS 控制，也不代表 Google 以及 CCRS 的观点。
                                        </Text>
                                        <Text>
                                            请确保在设备满足
                                            <Text link={{href:'https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0#heading=h.cwc2ewfrtynq'}}>
                                            配置要求
                                            </Text>
                                            时再启用 AI，否则不会出现相应入口。
                                        </Text>
                                        <Text>
                                            这些数据不会发送给 Google 或其他服务器，所有计算均在您的设备上完成。
                                        </Text>
                                        <Text>
                                            使用这些功能请遵守 <Text link={{href:'https://policies.google.com/terms/generative-ai/use-policy'}}>《生成式 AI 使用限制政策》</Text>
                                        </Text>
                                    </Space>
                            }
                        />
                        <Space width={'100%'}>
                            <Title heading={6} style={{margin: 8, backgroundColor: 'transparent', width: '90%'}}>
                                使用生成式AI
                            </Title>
                            <Switch checked={use_ai_page_checked} onChange={onchange_ai_page} aria-label={'使用生成式AI'}/>
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
                        }}>{t('Look_other_set')}</Text>
                        <Text onClick={advanSchange}
                              style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>{t('HTTPS_Service')}</Text>
                        <Text onClick={advanSchange}
                              style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>{t('API_Settings')}</Text>
                        <Text onClick={LogsPchange}
                              style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>{t('Log_viewer')}</Text>
                    </Space>
                </Card>

            </div>
            <br/>
            <SideSheet style={{maxWidth: "100%"}} closeOnEsc={true} title="高级设置" visible={advanSvisible}
                       onCancel={advanSchange}>
                <AdvancedSettingsPage></AdvancedSettingsPage>
            </SideSheet>
            <SideSheet style={{width: "100%"}} closeOnEsc={true} title="日志查看器" visible={LogsPvisible}
                       onCancel={LogsPchange}>
                <Logs_Viewer></Logs_Viewer>
            </SideSheet>
        </>
    )
}