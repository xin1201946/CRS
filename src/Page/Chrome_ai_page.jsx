import {useCallback, useState} from "react";
import { Chat, Space} from "@douyinfe/semi-ui";
import {clearAiHistory, tryAskAI} from "../code/chrome_gemini_support.js";

const defaultMessage = [
    // {
    //     role: 'assistant',
    //     id: '1',
    //     createAt: 1715676751919,
    //     content: "Hi, Can I help you?"
    // },
];

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


export default function Chrome_ai_page() {
    const [message, setMessage] = useState(defaultMessage);
    const onMessageSend = useCallback(async(content) => {
        tryAskAI(content).then(result => {
            const newAssistantMessage = {
                role: 'assistant',
                id: getId(),
                createAt: Date.now(),
                content: result,
            }
            setMessage((message) => ([ ...message, newAssistantMessage]));
        })

    }, []);

    const onChatsChange = useCallback((chats) => {
        setMessage(chats);
    }, []);

    const commonOuterStyle = {
        height: window.innerHeight-100,
        textAlign: "left",
        width: window.innerWidth,
    }
    const onMessageReset = useCallback(async () => {
        const currentMessage = [...message];
        const lastMessage = currentMessage[currentMessage.length - 1];
        try {
            const result = await tryAskAI(currentMessage[currentMessage.length - 2].content);
            const newLastMessage = {
                ...lastMessage,
                status: 'complete',
                content: result
            };
            setMessage([...currentMessage.slice(0, -1), newLastMessage]);
        } catch (error) {
            console.error('Error in tryAskAI:', error);
        }
    }, [message]);
    const clearAIhistory = useCallback(async() => {
        await clearAiHistory()
    },[])
    return (
        <Space align='start' style={{width:'100%'}}>
            <Chat
                key={'leftRightuserBubble'}
                align={'leftRight'}
                mode={'userBubble'}
                style={commonOuterStyle}
                chats={message}
                roleConfig={roleInfo}
                onChatsChange={onChatsChange}
                onMessageSend={onMessageSend}
                onMessageReset={onMessageReset}
                clearContext={clearAIhistory}
                showClearContext
            />
        </Space>
    );
}