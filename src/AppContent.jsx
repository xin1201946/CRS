// 导入必要的依赖和组件
import {useTranslation} from "react-i18next";
import {Layout, SideSheet} from "@douyinfe/semi-ui";
import {lazy, Suspense, useEffect, useState} from "react";
import {add_log, saveLogsToTxt} from "./code/log.js";
import {getSettings, setSettings} from "./code/Settings.js";
import {queck_change_theme, setAutoTheme, setDarkTheme, setLightTheme} from "./code/theme_color.js";
import {detectDevice} from "./code/check_platform.js";
import {
    Clipboard,
    CloudDownload,
    Copy, House,
    Languages,
    Moon,
    Notebook,
    RotateCcw, Scan, Server,
    Settings, SquareChevronRight,
    Sun,
    SunMoon,
    SwatchBook
} from "lucide-react";
import {send_notify} from "./code/SystemToast.jsx";
import {set_language} from "./code/language.js";
import {emit} from "./code/PageEventEmitter.js";
import RightClickMenu from "./Page/RightClickMenu.jsx";
import Sider from "@douyinfe/semi-ui/lib/es/layout/Sider.js";


// 懒加载主要组件
const Header1 = lazy(() => import("./Header/Header.jsx"))
const ResultPage = lazy(() => import("./Page/home_Page/ResultPage.jsx"))
const Nav_T = lazy(() => import("./Header/Nav_T.jsx"))
const BaseSettings = lazy(() => import("./Page/settings_page/BaseS.jsx"))
const Advanced_Settings = lazy(() => import("./Page/settings_page/AdvancedSettings.jsx"))
const Logs_Viewer = lazy(() => import("./Page/settings_page/Logs_Viewer.jsx"))
const ServerInfo=lazy(() => import("./Page/info_Page/ServerInfo.jsx"))

// 应用内容主组件
function AppContent() {

    let theme_color = getSettings('theme_color');
    if (theme_color === 'auto') {
        setAutoTheme();
    } else {
        queck_change_theme(theme_color);
    }

    const { t } = useTranslation();
    const { Header} = Layout;
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        menuItems: [],
    });

    const [settingB_visible, set_settingB_Visible] = useState(false);
    const settingB_visible_change = () => {
        set_settingB_Visible(!settingB_visible);
    };

    const [settingA_visible, set_settingA_Visible] = useState(false);
    const settingA_visible_change = () => {
        set_settingA_Visible(!settingA_visible);
    };

    const [Log_Page_visible, set_Log_Page_Visible] = useState(false);
    const Log_Page_visible_change = () => {
        set_Log_Page_Visible(!Log_Page_visible);
    };

    const [Server_Info_visible, set_Server_Info_Visible] = useState(false);
    const Server_Info_visible_change = () => {
        set_Server_Info_Visible(!Server_Info_visible);
    };

    useEffect(() => {
        add_log('Hook Theme...', 'successfully', 'UI Loading(3/3)...');
        setSettings('buile_time', document.querySelector('#build-time').content.toString(),true)


        if (detectDevice() === "PC" && getSettings("use_app_content_menu") === "true") {
            const handleGlobalContextMenu = (event) => {
                event.preventDefault();
                const target = event.target;
                let menuItems = [];

                // 检查是否是输入框或文本区域
                const isInputElement = target.matches('input, textarea, .semi-input, .xterm-screen');
                const selectedText = window.getSelection().toString();

                if (isInputElement) {
                    // 输入框的菜单项
                    menuItems = [
                        {
                            icon: <Copy className="w-4 h-4 text-blue-400" />,
                            label: selectedText ? t('Copy selected text') : t('Copy'),
                            rightElement:<span className="text-xs text-gray-400">Ctrl+C</span>,
                            onClick: () => {
                                const text = target.value || target.textContent;
                                if (selectedText) {
                                    navigator.clipboard.writeText(text).then(() => {
                                        send_notify(t('Copy successful'), "", null, 3, "success", false);
                                    });
                                } else if (text) {
                                    navigator.clipboard.writeText(text).then(() => {
                                        send_notify(t('Copy successful'), "", null, 3, "success", false);
                                    });
                                }
                            },
                        },
                        {
                            icon: <Clipboard className="w-4 h-4 text-green-400" />,
                            label: t('Paste'),
                            rightElement:<span className="text-xs text-gray-400">Ctrl+V</span>,
                            onClick: async () => {
                                try {
                                    const text = await navigator.clipboard.readText();
                                    if (target.setRangeText) {
                                        target.setRangeText(text, target.selectionStart, target.selectionEnd, 'end');
                                    } else if (target.value !== undefined) {
                                        const start = target.selectionStart;
                                        target.value = target.value.substring(0, start) + text + target.value.substring(target.selectionEnd);
                                        target.setSelectionRange(start + text.length, start + text.length);
                                    }
                                    // 触发 input 事件以确保 React 组件更新
                                    target.dispatchEvent(new Event('input', { bubbles: true }));
                                } catch (err) {
                                    send_notify(t('Paste failed'), err, null, 5, "error", false);
                                }
                            },
                        },
                    ];
                } else {
                    // 默认菜单项
                    menuItems = [
                        {
                            icon: <RotateCcw className="w-4 h-4 text-pink-400" />,
                            label: t('Refresh'),
                            rightElement:<span className="text-xs text-gray-400">F5</span>,
                            onClick: () => { window.location.reload() },
                        },
                        {
                            icon: <SwatchBook className="w-4 h-4 text-blue-400" />,
                            label: t('Theme_color'),
                            subItems: [
                                {
                                    icon: <SunMoon className="w-4 h-4 text-purple-400" />,
                                    label: t('Theme_auto'),
                                    onClick: () => { setAutoTheme() },
                                },
                                {
                                    icon: <Sun className="w-4 h-4 text-purple-400" />,
                                    label: t('Theme_light'),
                                    onClick: () => { setLightTheme() },
                                },
                                {
                                    icon: <Moon className="w-4 h-4 text-purple-400" />,
                                    label: t('Theme_dark'),
                                    onClick: () => { setDarkTheme() },
                                },
                            ],
                        },
                        {
                            icon: <Settings className="w-4 h-4 text-green-400" />,
                            label: t('Settings'),
                            subItems: [
                                {
                                    label: t('Base_Settings'),
                                    onClick: () => { settingB_visible_change() },
                                },
                                {
                                    label: t('Advanced_Settings'),
                                    onClick: () => { settingA_visible_change() },
                                },
                                {
                                    icon: <Languages className="w-4 h-4 text-purple-400" />,
                                    label: t('language'),
                                    subItems: [
                                        {
                                            label: '中文',
                                            onClick: () => { set_language(1) },
                                        },
                                        {
                                            label: 'English',
                                            onClick: () => { set_language(2) },
                                        },
                                    ]
                                },
                                {
                                    icon: <Notebook className="w-4 h-4 text-purple-400" />,
                                    label: t('Log_viewer'),
                                    subItems: [
                                        {
                                            icon: <Notebook className="w-4 h-4 text-purple-400" />,
                                            label: t('Check_logs'),
                                            onClick: () => { Log_Page_visible_change() },
                                        },
                                        {
                                            icon: <CloudDownload className="w-4 h-4 text-purple-400" />,
                                            label: t('Log_download'),
                                            onClick: () => { saveLogsToTxt() },
                                        },
                                    ]
                                },
                                {
                                    icon: <Server className="w-4 h-4 text-purple-400" />,
                                    label: t('Server detail'),
                                    onClick: () => { Server_Info_visible_change() },
                                },
                            ],
                        },
                        {
                            label: t('Switch page'),
                            subItems: [
                                {
                                    icon: <House className="w-4 h-4 text-purple-400" />,
                                    label: t('Home'),
                                    onClick: () => { emit('changePage', "home") },
                                },
                                {
                                    icon: <Scan className="w-4 h-4 text-purple-400" />,
                                    label: t('Vision'),
                                    onClick: () => { emit('changePage', "vision"); },
                                },
                                {
                                    icon: <SquareChevronRight className="w-4 h-4 text-purple-400" />,
                                    label: t('Console'),
                                    onClick: () => { emit('changePage', "console"); },
                                },
                            ]
                        },

                    ];
                }
                setContextMenu({
                    visible: true,
                    x: event.clientX,
                    y: event.clientY,
                    menuItems,
                });
            };

            window.addEventListener('contextmenu', handleGlobalContextMenu);
            return () => {
                window.removeEventListener('contextmenu', handleGlobalContextMenu);
            };
        }
    }, [Log_Page_visible_change, Server_Info_visible_change, contextMenu, settingA_visible_change, settingB_visible_change, t]);


    return (
        <>

            <Layout style={{ border: '1px solid var(--semi-color-border)' }}>
                <Header>
                    <Header1 />
                </Header>
                <Sider>
                    <Nav_T />
                </Sider>
                <Layout style={{ height: '100%', paddingTop: '68px'}}>
                    <ResultPage />
                    {contextMenu.visible && (
                        <RightClickMenu
                            items={contextMenu.menuItems}
                            x={contextMenu.x}
                            y={contextMenu.y}
                            onClose={() => setContextMenu({ ...contextMenu, visible: false })}
                        />
                    )}
                </Layout>
            </Layout>

            <SideSheet
                closeOnEsc={true}
                style={{ maxWidth: '100%' }}
                title={t('Base_Settings')}
                visible={settingB_visible}
                onCancel={settingB_visible_change}
            >
                <Suspense fallback={<div>Loading Base Settings...</div>}>
                    <BaseSettings />
                </Suspense>
            </SideSheet>

            <SideSheet
                loseOnEsc={true}
                style={{ maxWidth: '100%' }}
                title={t('Advanced_Settings')}
                visible={settingA_visible}
                onCancel={settingA_visible_change}
            >
                <Suspense fallback={<div>Loading Advanced Settings...</div>}>
                    <Advanced_Settings />
                </Suspense>
            </SideSheet>

            <SideSheet
                loseOnEsc={true}
                style={{ width: '100%' }}
                title={t('Log_viewer')}
                visible={Log_Page_visible}
                onCancel={Log_Page_visible_change}
            >
                <Suspense fallback={<div>Loading Logs...</div>}>
                    <Logs_Viewer />
                </Suspense>
            </SideSheet>

            <SideSheet
                loseOnEsc={true}
                style={{ width: '100%' }}
                title={t('Server Info')}
                visible={Server_Info_visible}
                onCancel={Server_Info_visible_change}
            >
                <Suspense fallback={<div>Loading Server Info...</div>}>
                    <ServerInfo />
                </Suspense>
            </SideSheet>

        </>
    );
}
export default  AppContent