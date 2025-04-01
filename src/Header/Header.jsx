import { useEffect, useState } from 'react';
import { Button, Dropdown, SideSheet, Space, Typography } from '@douyinfe/semi-ui';
import { MdHdrAuto, MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { getSetTheme, setAutoTheme, setDarkTheme, setLightTheme } from "../code/theme_color.js";
import { IconLanguage, IconMail, IconSetting } from "@douyinfe/semi-icons";
import { detectDevice } from "../code/check_platform.js";
import { useTranslation } from 'react-i18next';
import checkNetwork from "../code/NetWorkConnect.js";
import { getServer } from "../code/get_server.js";
import { send_notify } from "../code/SystemToast.jsx";
import { get_language, set_language } from "../code/language.js";
import { getSettings } from "../code/Settings.js";
import NotifyCenter from "../Page/NotifyCenter.jsx";
import { emit } from "../code/PageEventEmitter.js";
import { useNavigate } from "react-router-dom";

function Header1() {
    const navigate = useNavigate();
    const { Text } = Typography;
    const { t } = useTranslation();
    const langmenu = [
        { node: 'item', name: '中文', type: 'primary', active: get_language() === 1, onClick: () => set_language(1) },
        { node: 'item', name: 'English', type: 'primary', active: get_language() === 2, onClick: () => set_language(2) },
    ];

    // 获取初始主题图标的函数
    const getInitialThemeIcon = () => {
        const theme = getSettings('theme_color');
        if (theme === 'light') {
            return <MdOutlineLightMode style={{ width: '20px', height: '20px' }} />;
        } else if (theme === 'dark') {
            return <MdOutlineDarkMode style={{ width: '20px', height: '20px' }} />;
        } else {
            return <MdHdrAuto style={{ width: '20px', height: '20px' }} />;
        }
    };

    // 初始化状态时动态计算主题图标
    const [settingThemeIcon, set_ThemeIcon] = useState(getInitialThemeIcon);

    const s_side_sheet_change = () => {
        navigate("/settings/home");
    };

    const changeSelectKey = () => {
        emit('changePage', "home");
    };

    const [NotifyCenter_visible, set_NotifyCenter_visible] = useState(false);
    const NotifyCenter_change = () => {
        set_NotifyCenter_visible(!NotifyCenter_visible);
    };

    // 监听主题变化事件以实时更新图标
    useEffect(() => {
        const handleThemeChange = () => {
            set_ThemeIcon(getInitialThemeIcon());
        };
        window.addEventListener('themeChange', handleThemeChange);
        return () => {
            window.removeEventListener('themeChange', handleThemeChange);
        };
    }, []);

    // 切换主题模式并更新图标
    function switchDarkMode() {
        if (getSetTheme() === 'dark') {
            setAutoTheme();
            set_ThemeIcon(<MdHdrAuto style={{ width: '20px', height: '20px' }} />);
        } else if (getSetTheme() === 'light') {
            setDarkTheme();
            set_ThemeIcon(<MdOutlineDarkMode style={{ width: '20px', height: '20px' }} />);
        } else if (getSetTheme() === 'auto') {
            setLightTheme();
            set_ThemeIcon(<MdOutlineLightMode style={{ width: '20px', height: '20px' }} />);
        }
    }

    // 网络检查组件（保持不变）
    function MyComponent() {
        const [networkCheckResult, setNetworkCheckResult] = useState([null, null, null]);

        function checkNetworks() {
            return new Promise((resolve) => {
                checkNetwork(getServer()).then((result) => {
                    let type, children, duration;
                    if (result) {
                        duration = 3;
                        type = 'info';
                        children = <Text>{t('Server_connection_successful')}</Text>;
                    } else {
                        duration = 0;
                        type = 'error';
                        children = (
                            <>
                                <Text>{t('Server_connection_failed')}</Text>
                                <br />
                                <br />
                                <Space wrap={true} vertical={false}>
                                    <Button onClick={() => window.location.reload()}>
                                        {t('Refresh')}
                                    </Button>
                                    <Button
                                        style={{ marginLeft: '5px' }}
                                        className="semi-button semi-button-warning"
                                        onClick={() => navigate('/settings/basic')}
                                        type="button"
                                    >
                                        {t('Server_IP')}
                                    </Button>
                                    <Button
                                        style={{ marginLeft: '5px' }}
                                        className="semi-button semi-button-warning"
                                        onClick={() => navigate('/settings/advanced#API_Settings')}
                                        type="button"
                                    >
                                        {t('HTTPS_settings_API_settings')}
                                    </Button>
                                </Space>
                            </>
                        );
                    }
                    resolve([duration, type, children]);
                });
            });
        }

        function build_toast(lists) {
            if (!lists || lists.includes(null)) return;
            send_notify(t('Server Status Check'), lists[2], null, lists[0], lists[1]);
        }

        useEffect(() => {
            checkNetworks().then((result) => {
                setNetworkCheckResult(result);
            });
        }, []);

        useEffect(() => {
            build_toast(networkCheckResult);
        }, [networkCheckResult]);

        return <></>;
    }

    // 导航栏组件（保持不变）
    function New_Nav() {
        return (
            <div className="navbar bg-[--semi-color-nav-bg] backdrop-blur-3xl"
                 style={{
                     position: 'fixed',
                     width: '100%',
                     zIndex: 1,
                 }}
            >
                <div className="flex-0">
                    <button onClick={changeSelectKey} style={{ borderRadius: '7px' }} className="btn btn-ghost text-2xl">
                        <Space>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 142 141"
                                stroke="currentColor"
                            >
                                <g clipPath="url(#a)">
                                    <g
                                        clipPath="url(#b)"
                                        stroke="#4F46E5"
                                        strokeLinejoin="round"
                                    >
                                        <path
                                            d="M5.22 34.198v-14.63A14.61 14.61 0 0 1 9.519 9.223a14.699 14.699 0 0 1 10.377-4.285h14.676m73.378 0h14.676s7.625 1.541 10.377 4.285a14.608 14.608 0 0 1 4.298 10.345v14.63m0 73.152v14.631c0 3.88-1.546 7.601-4.298 10.345a14.701 14.701 0 0 1-10.377 4.285H107.95m-73.378 0H19.896a14.702 14.702 0 0 1-10.377-4.285 14.608 14.608 0 0 1-4.298-10.345V107.35"
                                            strokeWidth="10.667"
                                            strokeLinecap="round"
                                        />
                                        <path d="m47 78 28-42v28h20l-28 42V78H47Z" strokeWidth="8" />
                                    </g>
                                </g>
                                <defs>
                                    <clipPath id="a">
                                        <path d="M0 0h142v141H0z" />
                                    </clipPath>
                                    <clipPath id="b">
                                        <path d="M0 0h142v141H0z" />
                                    </clipPath>
                                </defs>
                            </svg>
                            <p>CCRS</p>
                        </Space>
                    </button>
                </div>
                <div className="flex-1"></div>
                <div className="flex-2">
                    <Space>
                        <Button style={{ margin: "10px" }} theme='borderless' icon={settingThemeIcon}
                                onClick={switchDarkMode}
                                aria-label="切换颜色" />
                        <Button style={{ margin: "10px", display: detectDevice() === 'PC' ? "none" : '' }} theme='borderless' icon={<IconMail />}
                                onClick={NotifyCenter_change}
                                aria-label="NotifyCenter" />
                        <Dropdown trigger={'click'} showTick position={'bottomLeft'} menu={langmenu}>
                            <Button style={{
                                color: 'var(--semi-color-text-0)',
                                display: detectDevice() === 'Phone' ? "none" : ''
                            }} theme='borderless'>
                                <IconLanguage />
                            </Button>
                        </Dropdown>
                        <Button onClick={s_side_sheet_change} style={{
                            color: 'var(--semi-color-text-0)',
                            display: detectDevice() === 'Phone' ? "none" : ''
                        }} theme='borderless'>
                            <IconSetting />
                        </Button>
                    </Space>
                </div>
            </div>
        );
    }

    return (
        <>
            {MyComponent()}
            <New_Nav />
            <SideSheet closeOnEsc={true} placement='left' style={{ maxWidth: "100%" }}
                       title={t('NotifyCenter')}
                       visible={NotifyCenter_visible} onCancel={NotifyCenter_change}>
                <NotifyCenter></NotifyCenter>
            </SideSheet>
        </>
    );
}

export default Header1;