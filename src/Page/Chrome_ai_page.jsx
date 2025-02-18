import { useCallback, useState } from "react";
import { tryAskAI } from "../code/chrome_gemini_support.js";
import AIChatComponent from "./widget/AIChatComponent.jsx";

const defaultMessage = [];

const roleInfo = {
    user: {
        name: 'User',
        avatar: './CCRS-j.png'
    },
    assistant: {
        name: 'Assistant',
        avatar: './gemini.svg'
    },
    system: {
        name: 'Assistant',
        avatar: './gemini.svg'
    }
};

let id = 0;
function getId() {
    return `id-${id++}`;
}

function Chrome_ai_page() {
    const [message, setMessage] = useState(defaultMessage);

    const onMessageSend = useCallback(async (content) => {
        const userMessage = {
            role: 'User',
            id: getId(),
            createAt: Date.now(),
            content: content,
        };
        setMessage((prevMessages) => [...prevMessages, userMessage]);

        // Get AI response
        try {
            const result = await tryAskAI(content);
            const newAssistantMessage = {
                role: 'assistant',
                id: getId(),
                createAt: Date.now(),
                content: result,
            };
            setMessage((prevMessages) => [...prevMessages, newAssistantMessage]);
        } catch (error) {
            console.error("Error getting AI response:", error);
        }
    }, []);

    return (
        <AIChatComponent
            roleInfo={roleInfo}
            messages={message}
            onSendMessage={onMessageSend}
            backgroundColor="bg-gray-50"
            userBubbleColor="bg-blue-500"
            aiBubbleColor="bg-white"
            textColor="text-gray-800"
        />
    );
}

export default Chrome_ai_page;