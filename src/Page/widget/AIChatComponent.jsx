"use client";

import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import { Send, Copy, ArrowDown } from "lucide-react";
import { send_notify } from "../../code/SystemToast.jsx";
import { t } from "i18next";
import {Button, TextArea, Space, MarkdownRender} from "@douyinfe/semi-ui";
import {getSettings} from "../../code/Settings.js";

class ErrorBoundary extends React.Component {
    state = { hasError: false };

    static getDerivedStateFromError(error) {
        // 如果需要可以在此处记录错误
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // 这里可以用来记录错误日志，或者进行其他处理
        console.error("Error caught in ErrorBoundary:", error, errorInfo);
    }

    render() {
        // 当捕获到错误时，返回一个空的组件或者默认的内容
        if (this.state.hasError) {
            return null; // 这里什么都不渲染，避免显示错误信息
        }

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
    const markdown_components = {};
    markdown_components['daima'] = ({ children }) => {
        return <div className="mockup-code w-full">
            {children}
        </div>
    }
    markdown_components['div'] = ({ children,className }) => {
        return <div className={className}>
            {children}
        </div>
    }
    markdown_components['Alert'] = ({ children,className }) => {
        return <div role="alert" className={className}>
            {children}
        </div>
    }
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
            <dialog id="my_modal_3" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    {getSettings("ai_support") === "true" ? (
                        <p>
                            The AI function is not turned on, please go to {" "}
                            <a href="/settings/basic/#AI_Setting" className="text-blue-500">
                                {t("Settings")} &gt; {t("Base_Settings")}
                            </a>{" "}
                            and enable it.
                        </p>
                    ) : (
                        <p>
                            Please use a browser that meets the requirements and go to{" "}
                            <a href="/settings/basic/#AI_Setting" className="text-blue-500">
                                {t("Settings")} &gt; {t("Base_Settings")}
                            </a>{" "}
                            review the configuration requirements.
                        </p>
                    )}
                </div>
            </dialog>

            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center" style={{marginBottom: "20rem"}}>
                        <span
                            style={{
                                backgroundImage: "linear-gradient(74deg, rgb(66, 133, 244) 0%, rgb(155, 114, 203) 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                fontSize: "2rem",
                                fontWeight: "bold",
                            }}
                        >
                            Can I help you?
                        </span>
                    </div>
                )}

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
                                        overflowY: "auto",
                                    }}
                                    className={`rounded-lg p-3 group ${isUser ? userBubbleColor : aiBubbleColor} ${textColor} relative`}
                                >
                                    <ErrorBoundary>
                                        <MarkdownRender raw={message.content}  format="md" components={markdown_components}></MarkdownRender>
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
            {showScrollButton && (
                <button
                    onClick={() =>
                        chatContainerRef.current.scrollTo({
                            top: chatContainerRef.current.scrollHeight,
                            behavior: "smooth",
                        })
                    }
                    className="absolute bottom-20 right-4 bg-gray-300 text-gray-800 rounded-full p-2 shadow-lg transition-opacity hover:bg-gray-700"
                >
                    <ArrowDown size={20} />
                </button>
            )}
            <form onSubmit={handleSubmit} className="p-4">
                <div className="flex items-center">
                    <Space
                        spacing="loose"
                        align="center"
                        justify="center" // 确保内容水平居中
                        style={{ width: "80%", margin: "0 auto" }}
                    >
                        <TextArea
                            value={input}
                            autosize={{ minRows: 5, maxRows: 10 }}
                            onChange={(value, event) => setInput(event.target.value)}
                            disabled={isLoading}
                            placeholder=""
                        />
                        <Button type="submit" disabled={isLoading} onClick={handleSubmit}>
                            <Send size={20} />
                        </Button>
                    </Space>

                </div>
            </form>
            <span className="text-gray-400 text-center">
                AI may make mistakes. Please use with discretion.
            </span>
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
