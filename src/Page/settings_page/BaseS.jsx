import {
    Banner,
    Button,
    Card, Divider,
    Input, Modal, Popover,
    Radio,
    RadioGroup, SideSheet,
    Space,
    Switch, Table, TabPane, Tabs,
    Tag,
    Typography
} from "@douyinfe/semi-ui";
import {getSettings, setSettings} from "../../code/Settings.js";
import {useState} from "react";
import {Title} from "@douyinfe/semi-ui/lib/es/skeleton/item.js";
import {IconFile, IconGlobe, IconHelpCircle, IconInfoCircle} from "@douyinfe/semi-icons";
import {setDarkTheme,setLightTheme,setAutoTheme} from "../../code/theme_color.js";
import {AdvancedSettingsPage} from "./AdvancedSettings.jsx";
import {Logs_Viewer} from "./Logs_Viewer.jsx";
import {useTranslation} from "react-i18next";
import {send_notify} from "../../code/SystemToast.jsx";
import Column from "@douyinfe/semi-ui/lib/es/table/Column.js";

export default function BaseSPage(){
    const { t } = useTranslation();
    const { Text } = Typography;
    const [switchMenuPchecked, setswitchMenuPchecked] = useState('true'===getSettings('use_app_content_menu'));
    const [use_ai_page_checked, set_use_ai_pagechecked] = useState('true'===getSettings('use_ai_page'))
    const [advanSvisible, setadvanSVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const showDialog = () => {
        setVisible(true);
    };
    const handleOk = () => {
        setVisible(false);
    };
    const advanSchange = () => {
        setadvanSVisible(!advanSvisible);
    };
    const [LogsPvisible, setLogsPVisible] = useState(false);
    const LogsPchange = () => {
        setLogsPVisible(!LogsPvisible);
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

    const data = [
        {
            class: t('OS version'),
            value: 'Windows ≥ 10, MacOS ≥ 13(Ventura),Linux',
        },
        {
            class: t('Browser Support'),
            value: 'Chrome Canary | Chrome Dev',
        },
        {
            class: t('minChromeVersion'),
            value: '128.0.6545.0',
        },
        {
            class: t('Storage'),
            value: t('Tip_AI_require_Disk'),
        },
        {
            class: 'GPU',
            value: t('Tip_AI_require_GPU'),
        },
        {
            class: t('Video RAM'),
            value: t('Tip_AI_require_GPU_M'),
        },
        {
            class: t('Network connection'),
            value: t('Tip_AI_require_Network'),
        },
    ];

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
                                        <Text>{t('Warning')}</Text>
                                        <Text>
                                            {t('Tip_AI_Page_1')}
                                        </Text>
                                        <Text>
                                            {t('Tip_AI_Page_2_1')}
                                            <Text link={{href:'https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0#heading=h.cwc2ewfrtynq'}}>
                                                {t('Tip_AI_Page_2_2')}
                                            </Text>
                                            {t('Tip_AI_Page_2_3')}
                                        </Text>
                                        <Text>
                                            {t('Tip_AI_Page_3')}
                                        </Text>
                                        <Text>
                                            {t('Tip_AI_Page_4_1')} <Text link={{href:'https://policies.google.com/terms/generative-ai/use-policy'}}>{t('Tip_AI_Page_4_2')}</Text>
                                        </Text>
                                        <Divider/>
                                        <Text style={{fontWeight:'bold'}}>{t('Refer also to Built_AI')}:</Text>
                                        <Button onClick={()=>{showDialog()}} >
                                            Built-in AI Early Preview Program
                                        </Button>
                                    </Space>
                                }
                        />
                        <Space width={'100%'}>
                            <Title heading={6} style={{margin: 8, backgroundColor: 'transparent', width: '90%'}}>
                                {t('Using Generative AI')}
                            </Title>
                            <Switch disabled={getSettings('ai_support')==='False'} checked={use_ai_page_checked} onChange={onchange_ai_page} aria-label={'使用生成式AI'}/>
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
            <Modal
                title={t('More_info')}
                visible={visible}
                closeOnEsc={true}
                fullScreen
                footer={null}
                onCancel={handleOk}
            >
                <Tabs
                    tabPosition="left"
                    lazyRender={true}
                >
                    <TabPane
                        tab={
                            <span>
                                <IconFile />
                                {t('Generative AI operational requirements')}
                            </span>
                        }
                        itemKey="1"
                    >
                        <div style={{ padding: '0 24px' }}>
                            <h3>{t('Generative AI operational requirements')}</h3>
                            {t('data source')}: <Text link={{target:'_blank',href:'https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0#heading=h.cwc2ewfrtynq'}}>Google Built-in AI Early Preview Program - Update 1</Text>
                            <br/>
                            <br/>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <Table dataSource={data} pagination={false}>
                                    <Column title={t('Type')} dataIndex="class" key="class" />
                                    <Column title={t('content')} dataIndex="value" key="value" />
                                </Table>
                                <br/>
                                <br/>
                                <Banner fullMode={false} type="warning" style={{width:'98%'}} bordered icon={null} closeIcon={null}
                                        title={<div style={{ fontWeight: 600, fontSize: '14px', lineHeight: '20px' }}>{t('Warning')}</div>}
                                        description={
                                            <Space vertical align={'start'}>
                                                <div>{t('Tip_AI_require_1')}</div>
                                                <div>{t('Tip_AI_require_2')}</div>
                                            </Space>
                                        }
                                />
                            </div>
                        </div>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <IconGlobe />
                                {t('Enable Chrome API functionality')}
                            </span>
                        }
                        itemKey="2"
                    >
                        <div style={{ padding: '0 24px' }}>
                            <h3>{t('Enable Chrome API functionality')}</h3>
                            <div style={{ maxHeight: '500px', overflow: 'auto' ,userSelect:'text'}}>
                                <Banner type={"warning"} closeIcon={null} fullMode={false}>Using this extension relies on Chrome&#39;s built-in Gemini Nano AI, which requires Chrome version greater than v127, which you can get in the
                                    <Text link={{target:'_blank',href:'https://www.google.com/chrome/dev/'}}>Dev</Text> or
                                    <Text link={{target:'_blank',href:'https://www.google.com/chrome/canary/'}}>Canary</Text> channels.
                                </Banner>
                                <ol>
                                    <li>Download and install Chrome with built-in AI(Dev / Canary).</li>
                                    <li>Go to <Text style={{color:"var( --semi-color-link)"}}>chrome://flags/#prompt-api-for-gemini-nano</Text> and enable the Prompt API for Gemini Nano option.</li>
                                    <li>Relaunch Chrome</li>
                                    <li>Go to <Text style={{color:"var( --semi-color-link)"}}>chrome://flags/#optimization-guide-on-device-model</Text> and turn on the Enables optimization guide on device option.</li>
                                    <li>Go to <Text style={{color:"var( --semi-color-link)"}}>chrome://components/</Text> and check or download the latest version of Optimization Guide On Device Model.</li>
                                    <li>Open DevTools and send <Text style={{color:"var( --semi-color-link)"}} copyable={true}>(await ai.languageModel.capabilities()).available;</Text> in the console.</li>
                                    <li>If this returns <Text style={{color:"var( --semi-color-link)"}}>“readily”</Text>, then you are all set.</li>
                                </ol>
                            </div>
                        </div>
                    </TabPane>
                    <TabPane
                        tab={
                            <span>
                                <IconHelpCircle />
                                {t('Help')}
                            </span>
                        }
                        itemKey="3"
                    >
                        <div style={{ padding: '0 24px' ,userSelect:'text'}}>
                            <h3>{t('Help')}</h3>
                            <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
                                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                                    Q：I follow the instructions and the result is not &#34;readily&#34;?
                                </p>
                                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                                    <ol>
                                        <li>Force Chrome to recognize that you want to use this API. To do so, open DevTools and send <Text style={{color:"var( --semi-color-link)"}} copyable={true}> await ai.languageModel.create();</Text> in the console. This will likely fail but it’s intended.</li>
                                        <li>Relaunch Chrome.</li>
                                        <li>Open a new tab in Chrome, go to <Text style={{color:"var( --semi-color-link)"}}>chrome://components</Text></li>
                                        <li>Confirm that Gemini Nano is either available or is being downloaded</li>
                                        <ul>
                                            <li>You&#39;ll want to see the <Text style={{color:"var( --semi-color-link)"}}> Optimization Guide On Device Model</Text> present with a version greater or equal to 2024.5.21.1031.</li>
                                            <li>If there is no version listed, click on Check for update to force the download.</li>
                                        </ul>
                                        <li>Once the model has downloaded and has reached a version greater than shown above, open DevTools and send <Text copyable={true} style={{color:"var( --semi-color-link)"}}>(await ai.languageModel.capabilities()).available;</Text> in the console. If this returns “readily”, then you are all set.</li>
                                        <ul>
                                            <li>Otherwise, relaunch, wait for a little while, and try again from step 1. </li>
                                        </ul>
                                    </ol>
                                </p>
                                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                                    Q：I tried to solve problem 1, but there is no Optimization Guide On Device Model？
                                </p>
                                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                                    Some participants have reported that the following steps helped them get the component to show up:
                                    <ul>
                                        <li>If you want to try the API on a device that doesn&#39;t have the performance or VRAM requirement (i.e., when capabilities() === &#39;no&#39;), you can override it by setting the flag #optimization-guide-on-device-mode to  &#34;Enabled BypassPerfRequirement&#34;, then retry the setup steps. This comes with the caveat that, while the model may be able to run, it may also fail to execute with generic failure errors.</li>
                                    </ul>
                                </p>
                                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                                    Q：All my steps were successful, but I was prompted to &#34;downloading&#34; during verification.
                                </p>
                                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                                    The browser may not start downloading the model right away. If your computer fulfills all the requirements and you don&#39;t see the model download start on <Text style={{color:"var( --semi-color-link)"}}>chrome://components</Text> after calling <Text copyable={true} style={{color:"var( --semi-color-link)"}}>ai.languageModel.create()</Text>, and Optimization Guide On Device Model shows version 0.0.0.0 / New, leave the browser open for a few minutes to wait for the scheduler to start the download.
                                </p>
                                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-0)', fontWeight: 600 }}>
                                    Q：Prompting me about an unsupported language in a conversation?
                                </p>
                                <p style={{ lineHeight: 1.8, color: 'var(--semi-color-text-1)' }}>
                                    Yes, since the AI feature is still in closed beta and the model is not heavily trained for languages other than English, to prevent unexpected errors, an option is quoted in Chrome new version to force the model to speak only English. If you want to try your language, change the option to Disabled at <Text style={{color:"var( --semi-color-link)"}}>chrome://flags/#text-safety-classifier</Text>
                                </p>
                            </div>
                        </div>
                    </TabPane>
                </Tabs>
            </Modal>
            <SideSheet style={{maxWidth: "100%"}} closeOnEsc={true} title={t('Advanced_Settings')} visible={advanSvisible}
                       onCancel={advanSchange}>
                <AdvancedSettingsPage></AdvancedSettingsPage>
            </SideSheet>
            <SideSheet style={{width: "100%"}} closeOnEsc={true} title={t('Log_viewer')} visible={LogsPvisible}
                       onCancel={LogsPchange}>
                <Logs_Viewer></Logs_Viewer>
            </SideSheet>
        </>
    )
}