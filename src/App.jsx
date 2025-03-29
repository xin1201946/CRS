// 导入必要的React组件和功能模块
import {lazy, Suspense, useEffect, useState} from 'react';
import './App.css';
import {add_log, saveLogsToTxt} from './code/log.js';
import { motion } from "framer-motion"
import initializeSettings from "./code/QuickLoadingService.js";
import {Routes, Route, useNavigate} from 'react-router-dom';
import {getSettings} from "./code/Settings.js";
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
import {t} from "i18next";
import RightClickMenu from "./Page/RightClickMenu.jsx";

// 懒加载主要内容组件，优化首次加载性能
const AppContent = lazy(() => import('./AppContent.jsx'));
const NewSettings = lazy(() => import("./Page/NewSettings.jsx"));
const ResultPage = lazy(() => import("./Page/home_Page/ResultPage.jsx"));
const ErrorPage = lazy(() => import("./Page/error_page/ErrorPage.jsx"));

// 加载屏幕组件，在主内容加载时显示
function LoadingScreen() {
    let theme_color=getSettings('theme_color')

    if (theme_color==='auto'){
        setAutoTheme()
    }else{
        queck_change_theme(theme_color);
    }

    return (
        <div className={`flex flex-col items-center justify-center min-h-screen bg-[--semi-color-bg-0] overflow-hidden`}>
            <div className="flex flex-col items-center gap-16">
                {/* Logo Container */}
                <div className="relative w-32 h-32">
                    <svg
                        width="128"
                        height="128"
                        viewBox="0 0 128 128"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="absolute top-0 left-0"
                    >
                        {/* Static Outer frame */}
                        <path
                            d="M4.70593 31.0454V17.7639C4.70593 14.2415 6.09967 10.8633 8.58055 8.37253C11.0614 5.88177 14.4262 4.48248 17.9347 4.48248H31.1635M97.3073 4.48248H110.536C110.536 4.48248 117.409 5.88177 119.89 8.37253C122.371 10.8633 123.765 14.2415 123.765 17.7639V31.0454M123.765 97.4526V110.734C123.765 114.257 122.371 117.635 119.89 120.126C117.409 122.616 114.044 124.016 110.536 124.016H97.3073M31.1635 124.016H17.9347C14.4262 124.016 11.0614 122.616 8.58055 120.126C6.09967 117.635 4.70593 114.257 4.70593 110.734V97.4526"
                            stroke="#415CF7"
                            strokeWidth="10.6667"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                        {/* Animated Lightning bolt */}
                        <motion.path
                            d="M42.3662 70.8085L67.6056 32.6808V58.0993H85.6338L60.3944 96.227V70.8085H42.3662Z"
                            stroke="#874AEF"
                            strokeWidth="8"
                            strokeLinejoin="round"
                            initial={{ filter: "blur(6px)", opacity: 0.3 }}
                            animate={{
                                filter: "blur(0px)",
                                opacity: 1,
                            }}
                            transition={{
                                duration: 2,
                                repeat: Number.POSITIVE_INFINITY,
                                repeatType: "reverse",
                                ease: "easeInOut",
                            }}
                            style={{
                                filter: "blur(var(--blur, 0px))",
                            }}
                        />
                    </svg>
                </div>

                {/* 进度条区域，位于页面下方 */}
                <div className="flex items-center justify-center flex-1">
                    <progress className="progress w-56 h-2 text-blue-700"></progress>
                </div>
            </div>
        </div>
    );
}
// 主应用组件
function App() {
    // 记录应用启动日志
    add_log('UI was Start...', 'successfully', 'Start successfully');
    // Register services and logs
    initializeSettings();
    const navigate = useNavigate();
    const [contextMenu, setContextMenu] = useState({
        visible: false,
        x: 0,
        y: 0,
        menuItems: [],
    });

    useEffect(() => {
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
                                    onClick: () => { navigate() },
                                },
                                {
                                    label: t('Advanced_Settings'),
                                    onClick: () => { navigate("/advanced") },
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
                                            onClick: () => {  navigate("/logs") },
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
                                    onClick: () => {  navigate("/about") },
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
    },[contextMenu, navigate])
    return (
        <Suspense fallback={<LoadingScreen />}>
            <Routes>
                {/* 主页面 (包含 ResultPage) */}
                <Route path="/" element={<AppContent />}>
                    <Route index element={<ResultPage />} />
                </Route>

                {/* 设置页面独立渲染 */}
                <Route path="/settings/*" element={<NewSettings />} />

                <Route path="*" element={<ErrorPage code={404} title={"Page Not Found"} description={t("404_Description")}/>} />

            </Routes>
            {contextMenu.visible && (
                <RightClickMenu
                    items={contextMenu.menuItems}
                    x={contextMenu.x}
                    y={contextMenu.y}
                    onClose={() => setContextMenu({ ...contextMenu, visible: false })}
                />
            )}
        </Suspense>
    );
}

export default App;