import { add_log } from "./log.js";
import { getSettings, setSettings } from "./Settings.js";

let session = null; // AI 会话

export async function initAI() {
    try {
        if (typeof ai === "undefined") {
            throw new Error("ai is not defined. The API may have changed or is not enabled in this browser.");
        }
        session = await ai.languageModel.create({
            systemPrompt: "You are a Google Gemini named Canf, used to assist users in solving program problems."
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

        if (getSettings('ai_support') !== "False") {
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
