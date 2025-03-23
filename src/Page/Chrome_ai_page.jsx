"use client"

import { useCallback, useState } from "react"
import { tryAskAIStream} from "../code/chrome_gemini_support.js"
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

    const onMessageSend = useCallback(async (content) => {
        const userMessage = {
            role: "User",
            id: getId(),
            createAt: Date.now(),
            content: content,
        };
        setMessage((prevMessages) => [...prevMessages, userMessage]);

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
        }
    }, []);



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

