"use client"

import { useCallback, useState, useEffect } from "react"
import { tryAskAIStream, initAI, checkAPIAvailability } from "../code/chrome_gemini_support.js"
import AIChatComponent from "./widget/AIChatComponent.jsx"

const defaultMessage = []

const roleInfo = {
    user: {
        name: "User",
        avatar: "./logo.svg",
    },
    assistant: {
        name: "Assistant",
        avatar: "./gemini.svg",
    },
    system: {
        name: "Assistant",
        avatar: "./gemini.svg",
    },
}

let id = 0
function getId() {
    return `id-${id++}`
}

function Chrome_ai_page() {
    const [message, setMessage] = useState(defaultMessage)
    const [aiInitialized, setAiInitialized] = useState(false)
    
    useEffect(() => {
        // 组件加载时初始化AI
        async function initializeAI() {
            try {
                // 首先检查API是否可用
                const apiAvailable = await checkAPIAvailability();
                
                if (!apiAvailable) {
                    // 如果API不可用，尝试初始化
                    const initialized = await initAI();
                    setAiInitialized(initialized);
                    
                    // 如果初始化失败，添加错误消息
                    if (!initialized) {
                        setMessage([
                            {
                                role: "system",
                                id: getId(),
                                createAt: Date.now(),
                                content: "Chrome AI API 初始化失败。请确保您已启用Chrome内置的Gemini API。可以点击顶部的'AI信息'按钮查看设置指南。"
                            }
                        ]);
                    }
                } else {
                    // API可用
                    setAiInitialized(true);
                }
            } catch (error) {
                console.error("AI初始化错误:", error);
                setAiInitialized(false);
                setMessage([
                    {
                        role: "system",
                        id: getId(),
                        createAt: Date.now(),
                        content: `AI初始化出错: ${error.message}。请确保您已启用Chrome内置的Gemini API。`
                    }
                ]);
            }
        }
        
        initializeAI();
    }, []);

    const onMessageSend = useCallback(async (content) => {
        // 添加用户消息
        const userMessage = {
            role: "User",
            id: getId(),
            createAt: Date.now(),
            content: content,
        };
        setMessage((prevMessages) => [...prevMessages, userMessage]);

        // 如果AI未初始化，返回错误消息
        if (!aiInitialized) {
            const errorMessageId = getId();
            setMessage((prevMessages) => [
                ...prevMessages,
                { 
                    role: "system", 
                    id: errorMessageId, 
                    createAt: Date.now(), 
                    content: "AI未初始化。请确保您已启用Chrome内置的Gemini API，然后刷新页面重试。" 
                },
            ]);
            return;
        }

        // 预创建一个空的 AI 消息对象
        const aiMessageId = getId();
        setMessage((prevMessages) => [
            ...prevMessages,
            { role: "assistant", id: aiMessageId, createAt: Date.now(), content: "" },
        ]);

        try {
            await tryAskAIStream(content, (chunk, fullResponse) => {
                setMessage((prevMessages) =>
                    prevMessages.map((msg) =>
                        msg.id === aiMessageId ? { ...msg, content: fullResponse } : msg
                    )
                );
            });
        } catch (error) {
            console.error("Error getting AI response:", error);
            // 更新AI消息为错误信息
            setMessage((prevMessages) =>
                prevMessages.map((msg) =>
                    msg.id === aiMessageId ? { ...msg, content: `错误: ${error.message}` } : msg
                )
            );
        }
    }, [aiInitialized]);



    return (
        <AIChatComponent
            roleInfo={roleInfo}
            messages={message}
            onSendMessage={onMessageSend}
            backgroundColor="bg-[--semi-color-bg-0]"
            userBubbleColor="bg-[--semi-color-tertiary-light-default]"
            aiBubbleColor="bg-[--semi-color-tertiary-light-default]"
            textColor="text-[ --semi-color-text-0]"
        />
    )
}

export default Chrome_ai_page

