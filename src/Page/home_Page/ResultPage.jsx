"use client"
import React, {lazy, useEffect, useState} from "react"
import {AnimatePresence, motion} from "framer-motion"
import "./resultpage_css.css"
import {off, on} from "../../code/PageEventEmitter.js"
import {getSettings, setSettings} from "../../code/Settings.js"

// 懒加载页面组件
const Step1 = lazy(() => import("./Step1.jsx"))
const HomePage = lazy(() => import("./HomePage.jsx"))
const Console = lazy(() => import("./Console.jsx"))
const Chrome_ai_page = lazy(() => import("../Chrome_ai_page.jsx"))

// 结果页面组件，处理页面切换和动画效果
function ResultPage() {
    // 当前页面状态
    const [page, setPage] = useState("home")
    // 使用React.memo优化HomePage组件性能
    const MemoizedHomePage = React.memo(HomePage);
    // 组件加载和卸载时的副作用处理
    useEffect(() => {
        // 从URL参数中获取服务器IP
        const urlParams = new URLSearchParams(window.location.search)
        setSettings("server_ip", urlParams.get("serverip") || getSettings("server_ip"))

        // 页面切换处理函数
        const handleChangePage = (newPage) => {
            setPage(newPage)
        }

        // 订阅页面切换事件
        on("changePage", handleChangePage)

        // 组件卸载时取消事件订阅
        return () => {
            off("changePage", handleChangePage)
        }
    }, [])

    // 页面切换动画配置
    const pageVariants = {
        initial: { opacity: 0, x: -20 }, // 初始状态
        in: { opacity: 1, x: 0 }, // 进入状态
        out: { opacity: 0, x: 20 }, // 退出状态
    }

    // 页面过渡动画配置
    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.3,
    }

    // 根据当前页面状态渲染对应组件
    const renderPage = () => {
        switch (page) {
            case "home":
                return <MemoizedHomePage />
            case "console":
                return <Console />
            case "vision":
                return <Step1 />
            default:
                return <Chrome_ai_page />
        }
    }

    return (
        <div id={"container"}>
            <div id={"returnpage"} style={{ height: "100%" ,width: "100%" }}>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={page}
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        style={{ height: "100%",width: "100%" }}
                    >
                        {renderPage()}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    )
}
export default  ResultPage

