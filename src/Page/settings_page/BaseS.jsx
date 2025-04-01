import {
    Banner,
    Button,
    Card,
    Divider,
    Input,
    Radio,
    RadioGroup,
    Space,
    Switch,
    Tag,
    Tooltip,
    Typography
} from "@douyinfe/semi-ui";
import {getSettings, setSettings} from "../../code/Settings.js";
import {useState} from "react";
import {setAutoTheme, setDarkTheme, setLightTheme} from "../../code/theme_color.js";
import {useTranslation} from "react-i18next";
import {send_notify} from "../../code/SystemToast.jsx";
import Chrome_AI_Info from "../info_Page/Chrome_AI_Info.jsx";
import {getServer} from "../../code/get_server.js";
import {useNavigate} from "react-router-dom";

function BaseSPage(){
    const { t } = useTranslation();
    const navigate = useNavigate();
    const { Title } = Typography;
    const { Text } = Typography;
    const [switchMenuPchecked, setswitchMenuPchecked] = useState('true'===getSettings('use_app_content_menu'));
    const [use_use_gemini_checked, set_use_gemini_checked] = useState('true'===getSettings('use_gemini'))
    const [user_name, set_user_name] = useState(getSettings('user_name'));
    const onswitchMenuChange = checked => {
        setswitchMenuPchecked(checked);
        setSettings('use_app_content_menu',checked.toString());
        window.location.reload();
    };
    const onchange_use_gemini = checked => {
        set_use_gemini_checked(checked);
        setSettings('use_gemini',checked.toString());
        window.location.reload();
    }
    const [showChromeAIInfo, setShowChromeAIInfo] = useState(false);
    const set_user_name_change = (e) => {
        set_user_name(e);
    }
    const submit_user_name = () => {
        setSettings('user_name',user_name);
    }
    const showChromeAIInfos = () => {
        setShowChromeAIInfo(true);
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
                        <Text onClick={() => window.location.reload()} link>
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
    // const close_newNotify = () => {
    //     send_notify('Notification','You successfully deleted a notification.',null,3,'info',false,'light');
    // }
    return(
        <>
            <div id={'newSettings'} >
                <Card
                    id={'server_ip'}
                    title={t('Server_IP')}
                >
                    <Space>
                        <Tooltip
                            trigger="click"
                            content={
                                <article>
                                    {t('Warning')}
                                    <br /> {t('Tip_Server_IP')}
                                </article>
                            }
                        >
                            <Input id={'server_ip_inputbox'} style={{width: '70%'}} defaultValue={getServer()}
                                   placeholder={t('Tip_server_ip')} size='default'></Input>
                        </Tooltip>

                        <Button theme='outline' onClick={save_data} type='primary'
                                style={{marginRight: 8}}>{t('Save_setting')}</Button>
                    </Space>
                </Card>
                <br/>
                <Card
                    id={'theme_color'}
                    title={t('Theme_color')}>
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
                <Card
                    id={'ui_set'}
                    title={t('UI_set')}>
                    <div style={{display: 'flex', alignItems: 'center'}}>
                        <Title heading={6} style={{margin: 8, backgroundColor: 'transparent', width: '90%'}}>
                            <Space>
                                {t('Use the built-in right-click menu')}
                            </Space>
                        </Title>
                        <Switch checked={switchMenuPchecked} onChange={onswitchMenuChange}/>
                    </div>
                </Card>
                <br/>
                <Card title={t('AI Setting')}
                      id={'AI_Setting'}
                >
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
                                        <Button onClick={showChromeAIInfos} >
                                            Built-in AI Early Preview Program
                                        </Button>
                                    </Space>
                                }
                        />
                        <Space width={'100%'}>
                            <Title heading={6} style={{margin: 8, backgroundColor: 'transparent', width: '90%'}}>
                                {t('Using Generative AI')}
                            </Title>
                            <Switch disabled={getSettings('ai_support')==='False'} checked={use_use_gemini_checked} onChange={onchange_use_gemini} aria-label={'使用生成式AI'}/>
                        </Space>
                        <Space>
                            <Title heading={6} style={{margin: 8, backgroundColor: 'transparent', width: '90%'}}>
                                {t('UserName')}
                            </Title>
                            <Input defaultValue={user_name} onChange={set_user_name_change}  disabled={getSettings('ai_support')==='False'}></Input>
                            <Button type='primary' onClick={submit_user_name} disabled={getSettings('ai_support')==='False'}>{t("Done")}</Button>
                        </Space>
                    </Space>
                </Card>
                <br/>
                <Card style={{backgroundColor: 'var( --semi-color-fill-0)'}}>
                    <Space spacing={'medium'} vertical align='start'>
                        <Text style={{
                            fontSize: 'medium',
                            fontWeight: "bold",
                            color: "var( --semi-color-text-2)"
                        }}>{t('Look_other_set')}</Text>
                        <Text onClick={()=>{navigate("/settings/advanced#HTTPS_Service_Setting")}}
                              style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>{t('HTTPS_Service')}</Text>
                        <Text onClick={()=>{navigate("/settings/advanced#API_Settings")}}
                              style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>{t('API_Settings')}</Text>
                        <Text onClick={()=>{navigate("/settings/logs")}}
                              style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>{t('Log_viewer')}</Text>
                    </Space>
                </Card>
            </div>
            <br/>
            <Chrome_AI_Info visible={showChromeAIInfo} handleOk={()=>{setShowChromeAIInfo(false)}} />
        </>
    )
}
export default BaseSPage