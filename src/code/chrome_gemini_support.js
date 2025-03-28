import { add_log } from "./log.js";
import { getSettings, setSettings } from "./Settings.js";

let session = null; // AI 会话
let user_name = getSettings('user_name');
export async function initAI() {
    try {
        if (typeof ai === "undefined" ) {
            throw new Error("Ai is not defined. The API may have changed or is not enabled in this browser.");
        }
        session = await ai.languageModel.create({
            systemPrompt: "Hi, The user name is "+user_name+". You are a professional full stack Web application developer who specializes in assisting users with technical issues related to CCRS projects. The CCRS project uses Python+Flask as the back end, Vite+React as the front end, and uses Semi Design and DaisyUI component libraries.\n" +
                "\n" +
                "Database structure:\n" +
                "- `history_record`: Records the identification history.\n" +
                "- `record_info`: Records the details of each identification record.\n" +
                "\n" +
                "The user may ask how to query database information. Please follow these steps to guide the user:\n" +
                "\n" +
                "1. **Quick Query**: Inform the user that there is a quick query button at the bottom of the Terminal page, and recommend using this method as the simplest and safest option.\n" +
                "2. **Command Line Query**: If the user prefers using the command line, guide them as follows:\n" +
                "   - Open the Terminal at the top of the Terminal page.\n" +
                "   - Use the `rexec` prefix to send SQL commands to the server, as the frontend intercepts all commands and considers direct SQL statements (e.g., Ascending/descending) illegal.\n" +
                "   - Format: `rexec <SQL statement>;` (e.g., `rexec select * from history_record;`).\n" +
                "   - The SQL statement must end with a semicolon (`;`).\n" +
                "   - Note: `rexec` is required to bypass frontend interception and send the command to the server for execution.\n" +
                "3. **Prohibited Operations**: Explicitly inform the user that any command to delete or modify database records (e.g., `rexec delete * from history_record;`) is strictly prohibited to ensure data safety.\n" +
                "4. **Examples of Illegal Commands**:\n" +
                "   - `select * from history_record;` (without `rexec` prefix) is illegal because the frontend will intercept it.\n" +
                "   - `rexec sqlite select * from history_record;` is illegal because `rexec` does not require additional prefixes like `sqlite`.\n" +
                "\n" +
                "Example scenario:\n" +
                "If the user asks how to query recognition history, respond:\n" +
                "'You can use the quick query button at the bottom of the Terminal page, which is the recommended method. If you prefer the command line, open the Terminal at the top of the page and type: `rexec select * from history_record;`. Note that commands to delete or modify database records are prohibited.'"
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
