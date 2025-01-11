
import "./header.css"
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Button, SideSheet, Space, Nav, Notification, Typography} from '@douyinfe/semi-ui';
import {Settings} from "../Page/Settings.jsx";
import {FooterPage} from "../Footer/Footer.jsx";
import {MdHdrAuto, MdOutlineDarkMode, MdOutlineLightMode} from "react-icons/md";
import {getSetTheme,  setAutoTheme, setDarkTheme, setLightTheme} from "../code/theme_color.js";
import {IconLanguage, IconSetting} from "@douyinfe/semi-icons";
import {emit} from "../code/PageEventEmitter.js";
import {on,off} from "../code/PageEventEmitter.js";
import {detectDevice} from "../code/check_platform.js";
import {LanguagePage} from "../Page/settings_page/LanguagePage.jsx";
import { useTranslation } from 'react-i18next';
import checkNetwork from "../code/NetWorkConnect.js";
import {getServer} from "../code/get_server.js";
import {AdvancedSettingsPage} from "../Page/settings_page/AdvancedSettings.jsx";
import BaseSPage from "../Page/settings_page/BaseS.jsx";

export function Header1 (){
    const { Text } = Typography;
    const { t } = useTranslation();
    const set_icon=()=>{
        if (getSetTheme() === 'light'){
            return <MdOutlineLightMode style={{width:'20px',height:'20px'}} />
        } else if(getSetTheme() === 'dark'){
            return <MdOutlineDarkMode style={{width:'20px',height:'20px'}} />
        }else{
            return <MdHdrAuto style={{width:'20px',height:'20px'}} />
        }
    }
    const [selectKey,setSelectKey]=useState('home');
    const [settingP_visible, set_settingP_Visible] = useState(false);
    const s_side_sheet_change = () => {
        set_settingP_Visible(!settingP_visible);
    };
    const [LanguagePage_visible, set_LanguagePage_visible] = useState(false);
    const LanguagePage_change = () => {
        set_LanguagePage_visible(!LanguagePage_visible);
    };
    const [settingThemeIcon, set_ThemeIcon] = useState(set_icon());
    function changeSelectKey(key){
        setSelectKey(key.itemKey)
        emit('changePage', key.itemKey)
    }
    const [settingadv_visible, set_settingadv_Visible] = useState(false);
    const adv_side_sheet_change = () => {
        set_settingadv_Visible(!settingadv_visible);
    };
    useEffect(() => {
        const handleChangePage = (newPage) => {
            setSelectKey(newPage);
        };

        on('changePage', handleChangePage);

        return () => {
            off('changePage', handleChangePage);
        };

    }, []);
    function switchDarkMode() {
        if (getSetTheme() === 'dark') {
            setAutoTheme(); // 确保调用函数
            const body = document.body;
            if (!body.hasAttribute('theme-mode')){
                set_ThemeIcon(<MdHdrAuto style={{width:'20px',height:'20px'}} />);
            }else{
                set_ThemeIcon(<MdHdrAuto style={{width:'20px',height:'20px'}} />);
            }
        } else if (getSetTheme() === 'light') {
            setDarkTheme(); // 确保调用函数
            set_ThemeIcon(<MdOutlineDarkMode style={{width:'20px',height:'20px'}}/>);
        } else if (getSetTheme() === 'auto') {
            setLightTheme(); // 确保调用函数
            set_ThemeIcon(<MdOutlineLightMode style={{width:'20px',height:'20px'}}/>);
        }
    }
    function MyComponent() {
        const [networkCheckResult, setNetworkCheckResult] = useState([null, null, null]);

        // 检查网络连接函数
        function checkNetworks() {
            return new Promise((resolve) => {
                checkNetwork(getServer()).then((result) => {
                    let type, children, duration;
                    if (result) {
                        duration = 3;
                        type = 'info';
                        children = (
                            <Text>{t('Server_connection_successful')}</Text>
                        );
                    } else {
                        duration = 0;
                        type = 'danger';
                        children = (
                            <>
                                <Text>{t('Server_connection_failed')}</Text>
                                <br/>
                                <Button
                                    onClick={() => {
                                        window.location.href = window.location.href;
                                    }}
                                >
                                    {t('Refresh')}
                                </Button>
                                <Button
                                    style={{ marginLeft: '5px' }}
                                    className="semi-button semi-button-warning"
                                    onClick={s_side_sheet_change}
                                    type="button"
                                >
                                    {t('Server_IP')}
                                </Button>
                                <Button
                                    style={{ marginLeft: '5px' }}
                                    className="semi-button semi-button-warning"
                                    onClick={adv_side_sheet_change}
                                    type="button"
                                >
                                    {t('HTTPS_settings_API_settings')}
                                </Button>
                            </>
                        );
                    }
                    resolve([duration, type, children]);
                });
            });
        }

        // 触发通知函数
        function build_toast(lists) {
            if (!lists || lists.includes(null)) return; // 确保列表不为空或未定义
            const opts = {
                duration: lists[0],
                position: 'top',
                title: t('Server Status Check'), // 替换成你需要的标题
                content: lists[2],
            };
            Notification.info(opts)
        }

        // 使用 useEffect 检测网络并显示通知
        useEffect(() => {
            checkNetworks().then((result) => {
                setNetworkCheckResult(result); // 更新网络检查结果
            });
        }, []); // 空依赖数组表示只在组件挂载时运行一次

        // 监听 networkCheckResult 变化并触发通知
        useEffect(() => {
            build_toast(networkCheckResult);
        }, [networkCheckResult]); // 当 networkCheckResult 改变时触发
    }
    return(
        <>
            {MyComponent()}
            <div className={'index-module_container__x1Eix'} style={{width: '100%',top:'0',zIndex:'1',height:'5%',backdropFilter:" blur(5px)",
                backgroundColor:" rgba(112,110,109,0)"}}>
                <Nav
                    selectedKeys={selectKey}
                    mode={'horizontal'}
                    onSelect={key => changeSelectKey(key)}
                    header={{
                        text: 'CCRS'
                    }}
                    footer={
                        <>
                            <Space>
                                <Button style={{margin: "10px"}} theme='borderless' icon={settingThemeIcon} onClick={switchDarkMode}
                                                       aria-label="切换颜色"/>
                                <Button onClick={LanguagePage_change} style={{color:'var(--semi-color-text-0)',display: detectDevice()==='Phone'?"none":''}} theme='borderless'>
                                    <IconLanguage />
                                </Button>
                                <Button onClick={s_side_sheet_change} style={{color:'var(--semi-color-text-0)',display: detectDevice()==='Phone'?"none":''}} theme='borderless'>
                                    <IconSetting/>
                                </Button>
                            </Space>
                        </>
                    }
                />
            </div>
            <SideSheet closeOnEsc={true} style={{maxWidth: "100%", fontFamily: "var(--Default-font)"}} title={t('Settings')}
                       visible={settingP_visible} onCancel={s_side_sheet_change} footer={<FooterPage></FooterPage>}>
                <Settings></Settings>
            </SideSheet>
            <SideSheet closeOnEsc={true} style={{ maxWidth:"100%",fontFamily:"var(--Default-font)"}} title={t('Advanced_Settings')}
                       visible={settingadv_visible} onCancel={adv_side_sheet_change}
                       footer={<FooterPage></FooterPage>}>
                <AdvancedSettingsPage></AdvancedSettingsPage>
            </SideSheet>
            <SideSheet closeOnEsc={true} style={{maxWidth: "100%", fontFamily: "var(--Default-font)"}} title="语言/language"
                       visible={LanguagePage_visible} onCancel={LanguagePage_change} footer={<FooterPage></FooterPage>}>
                <LanguagePage></LanguagePage>
            </SideSheet>
        </>
    )
}