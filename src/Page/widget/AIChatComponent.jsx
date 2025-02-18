"use client"

import { useState, useRef, useEffect } from "react"
import ReactMarkdown from "react-markdown"
import { Send, Copy, ArrowDown } from "lucide-react"
import {send_notify} from "../../code/SystemToast.jsx";
import {t} from "i18next";

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
    const chatContainerRef = useRef(null)

    useEffect(() => {
        scrollToBottom(false)
    }, []) // Removed unnecessary dependency: messages

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

    const handleSubmit = (e) => {
        e.preventDefault()
        if (input.trim()) {
            onSendMessage(input)
            setInput("")
        }
    }

    const formatDate = (timestamp) => {
        return new Date(timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text).then(() => {
            send_notify(t('Copy successful'), "", null, 3, "success", false);
        })
    }

    return (
        <div className={`flex flex-col h-full ${backgroundColor} relative`} style={{textAlign: "left"}}>
            <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth">
                {messages.map((message, index) => {
                    const isUser = message.role === roleInfo.user.name
                    const avatar = isUser ? roleInfo.user.avatar : roleInfo.assistant.avatar
                    return (
                        <div key={index} className={`flex items-start ${isUser ? "justify-end" : "justify-start"}`}>
                            {!isUser && (
                                <img src={avatar || "/placeholder.svg"} alt={message.role} className="w-8 h-8 rounded-full mr-2" />
                            )}
                            <div className="flex flex-col max-w-[50%]">
                                <div
                                    className={`rounded-lg p-3 group relative ${
                                        isUser ? `${userBubbleColor} text-white` : `${aiBubbleColor} ${textColor} border border-gray-200`
                                    }`}
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
                                <img src={avatar || "/placeholder.svg"} alt={message.role} className="w-8 h-8 rounded-full ml-2" />
                            )}
                        </div>
                    )
                })}
            </div>
            {showScrollButton && (
                <button
                    onClick={() => scrollToBottom(true)}
                    className="absolute bottom-20 right-4 bg-gray-800 text-white rounded-full p-2 shadow-lg transition-opacity hover:bg-gray-700"
                >
                    <ArrowDown size={20} />
                </button>
            )}
            <form onSubmit={handleSubmit} className="p-4 border-t border-gray-200">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                    />
                    <button
                        type="submit"
                        className={`${userBubbleColor} text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    >
                        <Send size={20} />
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AIChatComponent
