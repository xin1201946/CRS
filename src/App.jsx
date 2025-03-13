// 导入必要的React组件和功能模块
import { lazy, Suspense } from 'react';
import './App.css';
import { add_log } from './code/log.js';
import { motion } from "framer-motion"
import initializeSettings from "./code/QuickLoadingService.js";
// 懒加载主要内容组件，优化首次加载性能
const AppContent = lazy(() => import('./AppContent.jsx'));

// 加载屏幕组件，在主内容加载时显示
function LoadingScreen() {
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
    // 使用Suspense包装懒加载的内容，并显示加载屏幕
    return (
        <Suspense fallback={<LoadingScreen />}>
            <AppContent/>
        </Suspense>
    );
}

export default App;