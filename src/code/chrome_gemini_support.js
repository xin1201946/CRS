//This API provides support for front-end AI functionality, but please note:
//This feature only supports Chrome Dev/Canary browsers for Windows, MacOS, and Linux operating systems, and the Chrome Browser kernel must meet 129.0.6667.0+
//Restricted and this feature does not rely on any server but is supported by Google Chrome. This API feature may expire at any time. Please read the developer documentation and make the necessary modifications https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0
//To use this feature, users need to be informed of the following content and terms:
//[Taken from developer documentation]
//The disk should have at least 22GB of space for storage (the available space after downloading should not be less than 10GB); Equipped with a cluster or independent GPU and 6GB of video RAM; Use non metric network connections.
//The API does not support Chrome's incognito mode and guest mode; In an enterprise environment, if GenAILocalFoundationlModelSettings is set to 'Donotdownloadmodel', the API will not work;
//The API does not support the "after download" state, in which the API will not trigger model downloads. Model downloads are carried out by Chrome based on its own mechanism.
//This API is mainly used for experiments, and the output quality may not achieve the final effect after integration with specific task APIs planned for future release.
//Models may have limitations in handling certain tasks, such as inaccurate answers to knowledge-based questions and poor performance for tasks that require precise answers. Developers need to consider these factors when designing features or user experience.
//Please strictly abide by it https://policies.google.com/terms/generative-ai/use-policy Terms of Use
//The model only supports English language by default. If you need to enable built-in multilingual support, please turn off Text Safety Classifier and enable multilingual support in the AI model settings.

import { add_log } from "./log.js";
import { getSettings, setSettings } from "./Settings.js";

let session = null; // 定义全局变量

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

        const capabilities = await ai.languageModel.capabilities();
        if (capabilities.available === "readily") {
            const initSuccess = await initAI();
            if (initSuccess) {
                setSettings('ai_support', 'True');
                add_log('Chrome_AI_Support', 'successfully', 'The browser environment meets the requirements');
            }
        } else {
            setSettings('ai_support', 'False');
            add_log('Chrome_AI_Support', 'warning', 'The browser environment does not meet the requirements');
        }
    } catch (error) {
        setSettings('ai_support', 'False');
        add_log('Chrome_AI_Support', 'error', `Error checking API availability: ${error}`);
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
            if (typeof result === 'string') {
                return result;
            } else {
                return `Invalid result format from session.prompt: ${JSON.stringify(result)}`;
            }
        } else {
            return 'AI support is disabled.';
        }
    } catch (error) {
        add_log('Chrome_AI_Support', 'error', `Error in tryAskAI: ${error}`);
        return `Something went wrong: ${error}`;
    }
}
