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
import {useEffect, useMemo, useState} from "react";
import {getThemePresets, useTheme} from "../../code/ThemeManager.jsx";
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
    const { config: themeConfig, setThemeMode, updateTheme, icons } = useTheme();
    const themePresets = useMemo(() => getThemePresets(), []);
    const [switchMenuPchecked, setswitchMenuPchecked] = useState('true'===getSettings('use_app_content_menu'));
    const [use_use_gemini_checked, set_use_gemini_checked] = useState('true'===getSettings('use_gemini'))
    const [user_name, set_user_name] = useState(getSettings('user_name'));
    const [themeForm, setThemeForm] = useState({
        primaryColor: themeConfig.primaryColor,
        backgroundColor: themeConfig.backgroundColor,
        backgroundImage: themeConfig.backgroundImage,
        iconSet: themeConfig.iconSet,
        presetTheme: themeConfig.presetTheme || "default",
        allowModeSwitch: themeConfig.allowModeSwitch ?? true,
    });
    const [modeChoice, setModeChoice] = useState(themeConfig.themeMode);
    useEffect(() => {
        setThemeForm({
            primaryColor: themeConfig.primaryColor,
            backgroundColor: themeConfig.backgroundColor,
            backgroundImage: themeConfig.backgroundImage,
            iconSet: themeConfig.iconSet,
            presetTheme: themeConfig.presetTheme || "default",
            allowModeSwitch: themeConfig.allowModeSwitch ?? true,
        });
        setModeChoice(themeConfig.themeMode);
    }, [themeConfig]);
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
    const handlePresetChange = (presetValue) => {
        const nextPreset = themePresets[presetValue] || themePresets.default;
        const nextMode = nextPreset.allowModeSwitch ? (modeChoice || nextPreset.defaultMode) : nextPreset.defaultMode;
        setModeChoice(nextMode);
        setThemeMode(nextMode);
        setThemeForm(prev => ({
            ...prev,
            ...nextPreset.config,
            presetTheme: presetValue,
            allowModeSwitch: nextPreset.allowModeSwitch,
        }));
    };
    function saveThemeForm(){
        updateTheme({
            ...themeForm,
            themeMode: modeChoice,
        });
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

    const color_int = () => modeChoice === 'auto' ? 0 : modeChoice === 'light' ? 1 : 2;
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
                    <Space align="start" wrap>
                        <Space vertical align="start">
                            <Text strong>Theme presets</Text>
                            <RadioGroup
                                type='pureCard'
                                value={themeForm.presetTheme}
                                direction='vertical'
                                aria-label={'Theme presets'}
                                name="theme-presets"
                                onChange={(val)=>{
                                    const value = val?.target ? val.target.value : val;
                                    handlePresetChange(value);
                                }}
                            >
                                {Object.entries(themePresets).map(([key,preset])=>(
                                    <Radio key={key} value={key} style={{width: 280}}>
                                        <Space>
                                            {preset.label}
                                            {!preset.allowModeSwitch && <Tag size="small" color='purple'>Dark only</Tag>}
                                        </Space>
                                    </Radio>
                                ))}
                            </RadioGroup>
                        </Space>
                        <Divider margin='12px' layout="vertical" />
                        <Space vertical align={'start'} style={{width:'100%'}}>
                            <Space>
                                <Text strong>{t('Theme_color')}</Text>
                                <icons.Primary style={{width:16,height:16}} />
                                <input
                                    aria-label="primary-color"
                                    type="color"
                                    value={themeForm.primaryColor}
                                    onChange={(e)=>setThemeForm(prev=>({...prev,primaryColor:e.target.value}))}
                                    style={{width:60,height:28,border:'none',background:'transparent',cursor:'pointer'}}
                                />
                            </Space>
                            <Space align={'center'}>
                                <Text strong>Background</Text>
                                <input
                                    aria-label="background-color"
                                    type="color"
                                    value={themeForm.backgroundColor}
                                    onChange={(e)=>setThemeForm(prev=>({...prev,backgroundColor:e.target.value}))}
                                    style={{width:60,height:28,border:'none',background:'transparent',cursor:'pointer'}}
                                />
                            </Space>
                            <Space wrap style={{width:'100%'}}>
                                <Text strong>Background image</Text>
                                <Input
                                    placeholder={'https://example.com/bg.png'}
                                    value={themeForm.backgroundImage}
                                    onChange={(value)=>setThemeForm(prev=>({...prev,backgroundImage:value}))}
                                    aria-label="background-image"
                                />
                            </Space>
                            <Space align={'center'}>
                                <Text strong>Icon set</Text>
                                <RadioGroup
                                    type="button"
                                    value={themeForm.iconSet}
                                    onChange={(value)=>{
                                        const nextValue = value?.target ? value.target.value : value;
                                        setThemeForm(prev=>({...prev,iconSet:nextValue}));
                                    }}
                                >
                                    <Radio value={'lucide'}>Lucide</Radio>
                                    <Radio value={'emoji'}>Emoji</Radio>
                                </RadioGroup>
                            </Space>
                            <Divider margin='12px' />
                            <Text strong>{t('Theme_color')}</Text>
                            <RadioGroup
                                type='pureCard'
                                value={color_int()}
                                direction='vertical'
                                aria-label={'Theme_color'}
                                name="demo-radio-group-pureCard"
                            >
                                <Radio value={0} extra='' style={{width: 280}}
                                       onChange={function () {
                                           if(themeForm.allowModeSwitch){
                                               setModeChoice('auto');
                                               setThemeMode('auto')
                                           }
                                       }}
                                       disabled={!themeForm.allowModeSwitch}
                                >
                                    <Space>
                                        {t('Theme_auto')}
                                        <Tag size="small" shape='circle' color='blue'> New </Tag>
                                    </Space>
                                </Radio>

                                <Radio value={1} extra='' style={{width: 280}}
                                       onChange={function () {
                                           if(themeForm.allowModeSwitch){
                                               setModeChoice('light');
                                               setThemeMode('light')
                                           }
                                       }}
                                       disabled={!themeForm.allowModeSwitch}
                                >
                                    {t('Theme_light')}
                                </Radio>
                                <Radio value={2} extra='' style={{width: 280}}
                                       onChange={function () {
                                           if(themeForm.allowModeSwitch){
                                               setModeChoice('dark');
                                               setThemeMode('dark')
                                            }
                                       }}
                                       disabled={!themeForm.allowModeSwitch}
                                >
                                    {t('Theme_dark')}
                                </Radio>
                            </RadioGroup>
                            {!themeForm.allowModeSwitch && (
                                <Text type="tertiary" size="small">This theme forces dark mode.</Text>
                            )}
                            <Button onClick={saveThemeForm} type='primary'>{t('Save_setting')}</Button>
                        </Space>
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
