import {Banner, Modal, Space, Table, TabPane, Tabs, Typography} from "@douyinfe/semi-ui";
import {IconFile, IconGlobe, IconHelpCircle} from "@douyinfe/semi-icons";
import {useEffect, useState} from "react";
import {useTranslation} from "react-i18next";
import Column from "@douyinfe/semi-ui/lib/es/table/Column.js";
import {detectDevice} from "../../code/check_platform.js";

// eslint-disable-next-line react/prop-types
function Chrome_AI_Info({visible,handleOk}){
    const { t } = useTranslation();
    const { Text } = Typography;
    const [windowHeight, setWindowHeight] = useState(window.innerHeight);
    useEffect(() => {
        const handleResize = () => {
            setWindowHeight(window.innerHeight);
        };

        // 监听窗口大小变化事件
        window.addEventListener('resize', handleResize);

        // 在组件卸载时移除事件监听器，避免内存泄漏
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);
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
    return <Modal
        title={t('More_info')}
        visible={visible}
        closeOnEsc={true}
        fullScreen
        footer={null}
        onCancel={handleOk}
    >
        <Tabs
            more={detectDevice()==='PC'?0:3}
            tabPosition={detectDevice()==='PC'?"left":"top"}
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
                    <div  style={{ maxHeight:windowHeight-170, overflowY: 'auto' }}>
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
                        <br/>
                        <br/>
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
                    <div style={{ maxHeight:windowHeight-120, overflowY: 'auto' }}>
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
}

export default  Chrome_AI_Info