"use client";

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Send, Copy, ArrowDown } from "lucide-react";
import { send_notify } from "../../code/SystemToast.jsx";
import { t } from "i18next";
import {Button, TextArea,HotKeys, Space, MarkdownRender} from "@douyinfe/semi-ui";
import {getSettings} from "../../code/Settings.js";
import {add_log} from "../../code/log.js";
import {useNavigate} from "react-router-dom";
import {get_Greeting} from "../../code/times.js";
import {get_T_language} from "../../code/language.js";

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        // 如果需要可以在此处记录错误
        add_log("Error in AI ChatComponent: ",'error', error.toString());
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // 这里可以用来记录错误日志，或者进行其他处理
        add_log("Error caught in ErrorBoundary:",'error', errorInfo.toString());
    }

    render() {
        // 当捕获到错误时，返回一个空的组件或者默认的内容
        if (this.state.hasError) {
            return null; // 这里什么都不渲染，避免显示错误信息
        }

        // eslint-disable-next-line react/prop-types
        return this.props.children;
    }
}

const AIChatComponent = ({
                             roleInfo,
                             messages,
                             onSendMessage,
                             backgroundColor = "bg-gray-100",
                             userBubbleColor = "bg-blue-500",
                             aiBubbleColor = "bg-white",
                             textColor = "text-gray-800",
                         }) => {
    const [input, setInput] = useState("");
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const navgate = useNavigate();
    const hotKeys = [HotKeys.Keys.Control, 'Enter'];
    // 如果未允许使用 AI，则自动弹出不可关闭的 modal
    useEffect(() => {
        if (getSettings("use_ai_page") !== "true") {
            const modal = document.getElementById("my_modal_3");
            if (modal) {
                modal.showModal();
                // 阻止 ESC 键关闭
                modal.addEventListener("cancel", (e) => {
                    e.preventDefault();
                });
            }
        }
    }, []);

    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            container.scrollTo({
                top: container.scrollHeight,
                behavior: "smooth", // 平滑滚动
            });
        }
    }, [messages]); // 监听 messages 变化，自动滚动到底部

    useEffect(() => {
        const container = chatContainerRef.current;
        if (container) {
            const handleScroll = () => {
                const { scrollTop, scrollHeight, clientHeight } = container;
                setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
            };
            container.addEventListener("scroll", handleScroll);
            return () => container.removeEventListener("scroll", handleScroll);
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            setIsLoading(true);
            await onSendMessage(input);
            setInput("");
            setIsLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            send_notify(t("Copy successful"), "", null, 3, "success", false);
        });
    };

    return (
        <div className={`flex flex-col h-full ${backgroundColor} relative`}>
            {/* DaisyUI 样式的 Modal */}
            {getSettings("ai_support") !== "True" || getSettings("use_gemini") !== "true" ? (
                <dialog id="my_modal_3" className="modal">
                    <div className="modal-box">
                        <form method="dialog">
                            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                        </form>
                        {getSettings("ai_support") !== "true" ? (
                            <p>
                                Please use a browser that meets the requirements and go to{" "}
                                <a className="link link-hover link-primary" onClick={() => { navgate("/settings/basic/#AI_Setting"); }}>
                                    {t("Settings")} &gt; {t("Base_Settings")}
                                </a>{" "}
                                review the configuration requirements.
                            </p>
                        ) : (
                            <p>
                                The AI function is not turned on, please go to{" "}
                                <a onClick={() => { navgate("/settings/basic/#AI_Setting"); }} className="link link-hover link-primary">
                                    {t("Settings")} &gt; {t("Base_Settings")}
                                </a>{" "}
                                and enable it.
                            </p>
                        )}
                    </div>
                </dialog>
            ) : null}

            {/* 条件渲染：无消息时显示居中布局，有消息时显示聊天布局 */}
            {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4">
                    {/* 标题 */}
                    <span
                        style={{
                            fontFamily:"Noto Sans SC",
                            fontSize: "1.7rem",
                            fontWeight: "400",
                        }}
                    >
                        {get_Greeting()}{" "}{getSettings("user_name")}{get_T_language() === "zh-CN" ? "。" : "."}
                    </span>

                    <span
                        style={{
                            fontFamily:"Noto Sans SC",
                            fontSize: "1.7rem",
                            color:"var(--semi-color-text-1)",
                            fontWeight: "400",
                        }}
                    >
                        {t("Tip_Can_i_help_you")}
                    </span>

                    {/* 美化后的输入表单 */}
                    <form onSubmit={handleSubmit} className="mt-6 w-3/4 rounded-2xl shadow-md p-4 bg-semi-color-bg-1">
                        <Space vertical={true} align={"start"} style={{ width: "100%" }}>
                            <Space spacing="loose" align="center" justify="center" style={{ width: "100%" }}>
                                <HotKeys hotKeys={hotKeys} style={{ display: "none" }} onHotKey={handleSubmit} />
                                <TextArea
                                    value={input}
                                    autosize={{ minRows: 3, maxRows: 10 }}
                                    onChange={(value, event) => setInput(event.target.value)}
                                    disabled={isLoading}
                                    placeholder={t("Tip_Send_message")}
                                    className="border-none focus:ring-2 focus:ring-blue-300"
                                    style={{
                                        backgroundColor: "transparent",
                                    }}
                                />

                            </Space>
                            <div style={{width:"100%",display:"flex",justifyContent: "flex-end" }} >
                                <div style={{ width: "100%", display: "flex", alignItems: "center" }}>
                                    <Space>
                                        <Button type="submit" onClick={()=>{setInput("Help me ")}} disabled={isLoading} style={{ borderRadius: "50px" }} className="btn btn-primary">
                                            <Space>
                                                <span className="icon-[iconoir--code]" style={{fontSize:20}}></span>
                                                <span>Code</span>
                                            </Space>
                                        </Button>
                                        <Button type="submit" onClick={()=>{setInput("How ")}} disabled={isLoading} style={{ borderRadius: "50px" }} className="btn btn-primary">
                                            <Space>
                                                <span className="icon-[tabler--help]" style={{fontSize:20}} />
                                                <span>How to</span>
                                            </Space>
                                        </Button>
                                    </Space>
                                    <Button
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        style={{ borderRadius: "50px", marginLeft: "auto" }} // 关键：marginLeft: "auto" 推到右边
                                        className="btn btn-primary"
                                    >
                                        <Send style={{ color: "var(--semi-color-text-0)" }} size={20} />
                                    </Button>
                                </div>
                            </div>
                        </Space>
                    </form>

                    {/* 免责声明 */}
                    <span className="text-[--semi-color-text-2] text-center mt-6 text-sm">
                        {t("Tip_AI_make_mistakes")}
                    </span>
                </div>
            ) : (
                <>
                    {/* 消息列表 */}
                    <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((message, index) => {
                            const isUser = message.role === roleInfo.user.name;
                            const avatar = isUser ? roleInfo.user.avatar : roleInfo.assistant.avatar;
                            return (
                                <div key={index} className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}>
                                    {!isUser && (
                                        <img src={avatar} alt={message.role} className="w-8 h-8 rounded-full mr-2" />
                                    )}
                                    <div className="relative max-w-[70%]">
                                        <div
                                            style={{
                                                userSelect: "text",
                                                overflowY: "auto",
                                            }}
                                            className={`rounded-lg p-3 group ${isUser ? userBubbleColor : aiBubbleColor} ${textColor} relative`}
                                        >
                                            <ErrorBoundary>
                                                <MarkdownRender raw={message.content} format="md" />
                                            </ErrorBoundary>
                                            <button
                                                onClick={() => copyToClipboard(message.content)}
                                                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <Copy size={16} />
                                            </button>
                                        </div>
                                        <div className={`text-xs mt-1 ${textColor} ${isUser ? "text-right" : "text-left"}`}>
                                            {new Date(message.createAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                                        </div>
                                    </div>
                                    {isUser && (
                                        <img src={avatar} alt={message.role} className="w-8 h-8 rounded-full ml-2" />
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* 滚动按钮 */}
                    {showScrollButton && (
                        <button
                            onClick={() =>
                                chatContainerRef.current.scrollTo({
                                    top: chatContainerRef.current.scrollHeight,
                                    behavior: "smooth",
                                })
                            }
                            style={{right:"50%",bottom:"23%"}}
                            className="absolute bg-semi-color-bg-2 text-gray-800 rounded-full p-2 shadow-lg transition-opacity hover:bg-gray-700"
                        >
                            <ArrowDown size={20} />
                        </button>
                    )}

                    {/* 美化后的输入表单 */}
                    <form onSubmit={handleSubmit} className="p-4">
                        <div className="bg-white rounded-lg shadow-md p-4 w-80% mx-auto">
                            <Space spacing="loose" align="center" justify="center" style={{ width: "100%" }}>
                                <HotKeys hotKeys={hotKeys} style={{ display: "none" }} onHotKey={handleSubmit} />
                                <TextArea
                                    value={input}
                                    autosize={{ minRows: 3, maxRows: 10 }}
                                    onChange={(value, event) => setInput(event.target.value)}
                                    disabled={isLoading}
                                    placeholder={t("Tip_Send_message")}
                                    className="border-none focus:ring-2 focus:ring-blue-300"
                                    style={{
                                        backgroundColor: "transparent",
                                    }}
                                />
                                <Button type="submit" disabled={isLoading} onClick={handleSubmit} className="btn btn-primary">
                                    <Send style={{color:"var(--semi-color-text-0)"}} size={20} />
                                </Button>
                            </Space>
                        </div>
                    </form>

                    {/* 免责声明 */}
                    <span className="text-[--semi-color-text-2] text-center text-sm p-1">
                       {t("Tip_AI_make_mistakes")}
                    </span>
                </>
            )}
        </div>
    );
};

AIChatComponent.propTypes = {
    backgroundColor: PropTypes.string,
    userBubbleColor: PropTypes.string,
    aiBubbleColor: PropTypes.string,
    textColor: PropTypes.string,
    messages: PropTypes.arrayOf(
        PropTypes.shape({
            role: PropTypes.string.isRequired,
            content: PropTypes.string.isRequired,
            createAt: PropTypes.number.isRequired,
        })
    ).isRequired,
    roleInfo: PropTypes.shape({
        user: PropTypes.shape({
            name: PropTypes.string.isRequired,
            avatar: PropTypes.string,
        }).isRequired,
        assistant: PropTypes.shape({
            avatar: PropTypes.string,
        }).isRequired,
    }).isRequired,
    onSendMessage: PropTypes.func.isRequired,
};

export default AIChatComponent;
