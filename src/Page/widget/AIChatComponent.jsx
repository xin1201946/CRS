"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Send, Copy, ArrowDown } from "lucide-react"
import { send_notify } from "../../code/SystemToast.jsx"
import { t } from "i18next"
import {Button, TextArea} from "@douyinfe/semi-ui"

const AIChatComponent = ({
                             roleInfo,
                             messages,
                             onSendMessage,
                             backgroundColor = "bg-gray-100",
                             userBubbleColor = "bg-blue-500",
                             aiBubbleColor = "bg-white",
                             textColor = "text-gray-800",
                         }) => {
    const [input, setInput] = useState("")
    const [showScrollButton, setShowScrollButton] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const chatContainerRef = useRef(null)

    useEffect(() => {
        scrollToBottom(false)
    }, [])

    useEffect(() => {
        const container = chatContainerRef.current
        if (container) {
            const handleScroll = () => {
                const { scrollTop, scrollHeight, clientHeight } = container
                setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100)
            }
            container.addEventListener("scroll", handleScroll)
            return () => container.removeEventListener("scroll", handleScroll)
        }
    }, [])

    const scrollToBottom = (smooth = true) => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: smooth ? "smooth" : "auto",
            })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (input.trim() && !isLoading) {
            setIsLoading(true)
            await onSendMessage(input)
            setInput("")
            setIsLoading(false)
        }
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            send_notify(t("Copy successful"), "", null, 3, "success", false)
        })
    }

    const handleTextKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault(); // 阻止默认的换行行为
        }
    };

    return (
        <div className={`flex flex-col h-full ${backgroundColor} relative`} style={{ textAlign: "left" }}>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.map((message, index) => {
                    const isUser = message.role === roleInfo.user.name
                    const avatar = isUser ? roleInfo.user.avatar : roleInfo.assistant.avatar
                    return (
                        <div key={index} className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}>
                            {!isUser && (
                                <img src={avatar} alt={message.role} className="w-8 h-8 rounded-full mr-2" />
                            )}
                            <div className="flex flex-col max-w-[50%]">
                                <div
                                    className={`rounded-lg p-3 group relative ${
                                        isUser
                                            ? `${userBubbleColor} text-[ --semi-color-text-0]`
                                            : `${aiBubbleColor} ${textColor} border border-[--semi-color-tertiary-light-hover]`
                                    }`}
                                    style={{
                                        overflow:"auto",
                                    }}
                                >
                                    <ReactMarkdown>{message.content}</ReactMarkdown>
                                    <button
                                        onClick={() => copyToClipboard(message.content)}
                                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Copy size={16} />
                                    </button>
                                </div>
                                <div className={`text-xs ${textColor} mt-1 ${isUser ? "text-right" : "text-left"}`}>
                                    {formatDate(message.createAt)}
                                </div>
                            </div>
                            {isUser && (
                                <img src={avatar} alt={message.role} className="w-8 h-8 rounded-full ml-2" />
                            )}
                        </div>
                    )
                })}
                {isLoading && (
                    <div className="flex items-start justify-start">
                        <img
                            src={roleInfo.assistant.avatar || "/placeholder.svg"}
                            alt="Assistant"
                            className="w-8 h-8 rounded-full mr-2"
                        />
                        <div
                            className={`rounded-lg p-3 ${aiBubbleColor} ${textColor} border border-[--semi-color-tertiary-light-hover]`}
                        >
                            Thinking...
                        </div>
                    </div>
                )}
            </div>
            {showScrollButton && (
                <button
                    onClick={() => scrollToBottom(true)}
                    className="absolute bottom-20 right-4 bg-[--semi-color-tertiary-light-default] text-[ --semi-color-text-0] rounded-full p-2 shadow-lg transition-opacity hover:bg-gray-700"
                >
                    <ArrowDown size={20} />
                </button>
            )}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[--semi-color-tertiary-light-hover]">
                <div className="flex items-center">
                    <TextArea
                        value={input}
                        autosize={{ minRows: 1, maxRows: 5}}
                        onChange={(value, event) => setInput(event.target.value)}
                        onKeyDown={handleTextKeyDown}
                        disabled={isLoading}
                        placeholder="Type your message , press Enter to send the message...."
                    />
                    <Button type="submit" onClick={handleSubmit} className={"h-max w-auto"} disabled={isLoading}>
                        <Send size={20}/>
                    </Button>
                </div>
            </form>
            <span className={"text-gray-400 text-center"}>AI may make mistakes. Please use with discretion.</span>
            <br/>
        </div>
    )
}

export default AIChatComponent

