import { add_log } from "./log.js";
import { getSettings, setSettings } from "./Settings.js";

let session = null; // AI 会话

export async function initAI() {
    try {
        if (typeof ai === "undefined" ) {
            throw new Error("Ai is not defined. The API may have changed or is not enabled in this browser.");
        }
        session = await ai.languageModel.create({
            systemPrompt: "You are a Program developer, used to assist users in solving program problems.\n" +
                "In addition to regular programming assistance, you are also capable of generating HTML interfaces using div elements and various UI libraries such as DaisyUI and SemiDesign.\n" +
                "You can even use React code for interactive elements.\n" +
                "Here are some key things you can do:\n" +
                "Use DaisyUI to create responsive and styled UI components (e.g., cards, buttons, modals).\n" +
                "Use SemiDesign components (e.g., TextArea, Button, Space) to build user-friendly interfaces.\n" +
                "Use React to handle dynamic content and events, like button clicks or form submissions.\n" +
                "When providing code examples, remember that they can include:\n" +
                "HTML elements wrapped in <div></div> tags for structuring the layout, ensuring proper rendering of content.\n" +
                "UI libraries (DaisyUI or SemiDesign) for predefined components.\n" +
                "React code for state management, event handling, and component rendering.\n" +
                "If you need to display a warning or a message to the user, please use the <Alert> component from DaisyUI (note: always start with a capital letter!) to ensure it is properly rendered and styled."
        });
        return true;
    } catch (error) {
        add_log('Chrome_AI_Support', 'error', `Failed to initialize AI: ${error}`);
        return false;
    }
}

export async function clearAiHistory() {
    if (session) {
        session = await session.clone();
    } else {
        add_log('Chrome_AI_Support', 'warning', 'Attempted to clear AI history, but session is not initialized.');
    }
}

export async function checkAPIAvailability() {
    try {
        if (typeof ai === "undefined") {
            throw new Error("ai is not defined. The API may have changed or is not enabled in this browser.");
        }

        try{
            const capabilities = await ai.languageModel.capabilities();
            if (capabilities.available === "readily") {
                setSettings('ai_support', 'True');
                add_log('Chrome_AI_Support', 'success', 'The browser environment meets the requirements');
                return true; // 直接返回 true
            }
        }catch {
            if (await initAI()){
                setSettings('ai_support', 'True');
                add_log('Chrome_AI_Support', 'success', 'Forced AI initialization, now enabled.');
                return true;
            }
        }
        return false;


    } catch (error) {
        setSettings('ai_support', 'False');
        add_log('Chrome_AI_Support', 'error', `Error checking API availability: ${error}`);
        return false;
    }
}

export async function tryAskAI(something) {
    try {
        if (!session) {
            add_log('Chrome_AI_Support', 'error', 'Session is not initialized.');
            return 'AI session is not initialized.';
        }

        if (getSettings('ai_support') !== "False" && getSettings("use_gemini") !== "false") {
            const result = await session.prompt(something);
            return typeof result === 'string' ? result : `Invalid result format: ${JSON.stringify(result)}`;
        } else {
            return 'AI support is disabled.';
        }
    } catch (error) {
        add_log('Chrome_AI_Support', 'error', `Error in tryAskAI: ${error}`);
        return `Something went wrong: ${error}`;
    }
}

export async function tryAskAIStream(something, onChunk) {
    try {
        if (!session) {
            add_log('Chrome_AI_Support', 'error', 'Session is not initialized.');
            return 'AI session is not initialized.';
        }
        if (getSettings('ai_support') !== "False" && getSettings("use_gemini") !== "false") {
            const result = session.promptStreaming(something);
            let fullResponse = "";
            for await (const chunk of result) {
                fullResponse += chunk;
                // 每收到一部分就调用回调更新 UI
                if (typeof onChunk === 'function') {
                    onChunk(chunk, fullResponse);
                }
            }
            return fullResponse;
        } else {
            return 'AI support is disabled.';
        }
    } catch (error) {
        add_log('Chrome_AI_Support', 'error', `Error in tryAskAI: ${error}`);
        return `Something went wrong: ${error}`;
    }
}
