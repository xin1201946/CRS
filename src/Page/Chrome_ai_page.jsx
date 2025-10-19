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
                console.log("Chrome AI Page: Initializing AI...");
                
                // 直接尝试初始化AI
                const initialized = await initAI();
                
                if (initialized) {
                    console.log("Chrome AI Page: AI initialized successfully");
                    setAiInitialized(true);
                    
                    // 添加一条欢迎消息
                    setMessage([
                        {
                            role: "system",
                            id: getId(),
                            createAt: Date.now(),
                            content: "Chrome AI 已准备就绪，请输入您的问题。"
                        }
                    ]);
                } else {
                    console.error("Chrome AI Page: AI initialization failed");
                    setAiInitialized(false);
                    setMessage([
                        {
                            role: "system",
                            id: getId(),
                            createAt: Date.now(),
                            content: "Chrome AI API 初始化失败。请确保您已启用Chrome内置的Gemini API。可以点击顶部的'AI信息'按钮查看设置指南。"
                        }
                    ]);
                    
                    // 尝试检查API可用性，获取更详细的状态
                    const apiStatus = await checkAPIAvailability();
                    console.log("Chrome AI Page: API availability status:", apiStatus);
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
        
        // 组件卸载时清理资源
        return () => {
            console.log("Chrome AI Page: Component unmounting, cleaning up...");
            // 我们可以选择在这里销毁会话，但是为了让会话持久存在，我们选择不销毁
            // 如果想在组件卸载时销毁会话，可以取消下面的注释
            // import { destroySession } from "../code/chrome_gemini_support.js";
            // destroySession();
        };
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

        // 如果AI未初始化，尝试再次初始化
        if (!aiInitialized) {
            console.log("Chrome AI Page: AI not initialized, attempting to initialize before sending message...");
            
            // 尝试初始化
            const initialized = await initAI();
            
            if (!initialized) {
                console.error("Chrome AI Page: Failed to initialize AI before sending message");
                const errorMessageId = getId();
                setMessage((prevMessages) => [
                    ...prevMessages,
                    { 
                        role: "system", 
                        id: errorMessageId, 
                        createAt: Date.now(), 
                        content: "AI初始化失败。请确保您已启用Chrome内置的Gemini API，然后刷新页面重试。" 
                    },
                ]);
                return;
            }
            
            console.log("Chrome AI Page: AI initialized successfully before sending message");
            setAiInitialized(true);
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

