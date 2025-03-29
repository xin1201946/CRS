// 从 log.js 文件导入 add_log 函数
// Import the add_log function from the log.js file
import { add_log } from "./log.js";
// 从 Settings.js 文件导入 getSettings 和 setSettings 函数
// Import the getSettings and setSettings functions from the Settings.js file
import { getSettings, setSettings } from "./Settings.js";

// AI 会话，初始化为 null
// AI session, initialized to null
let session = null;
// 从设置中获取用户名称
// Get the user name from the settings
let user_name = getSettings('user_name');

/**
 * 初始化 AI 会话。
 * Initializes the AI session.
 * @returns {Promise<boolean>} 如果初始化成功返回 true，否则返回 false。
 * @returns {Promise<boolean>} Returns true if the initialization is successful, otherwise false.
 */
export async function initAI() {
    try {
        // 检查 ai 对象是否未定义
        // Check if the ai object is undefined
        if (typeof ai === "undefined" ) {
            // 若未定义，抛出错误
            // If undefined, throw an error
            throw new Error("Ai is not defined. The API may have changed or is not enabled in this browser.");
        }
        // 创建 AI 会话
        // Create an AI session
        session = await ai.languageModel.create({
            // 设置系统提示信息
            // Set the system prompt information
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
        // 初始化成功，返回 true
        // Initialization successful, return true
        return true;
    } catch (error) {
        // 记录初始化失败日志
        // Record the initialization failure log
        add_log('Chrome_AI_Support', 'error', `Failed to initialize AI: ${error}`);
        // 初始化失败，返回 false
        // Initialization failed, return false
        return false;
    }
}

/**
 * 清除 AI 会话历史。
 * Clears the AI session history.
 */
export async function clearAiHistory() {
    // 检查会话是否已初始化
    // Check if the session is initialized
    if (session) {
        // 克隆会话以清除历史
        // Clone the session to clear the history
        session = await session.clone();
    } else {
        // 记录会话未初始化警告
        // Record the session uninitialized warning
        add_log('Chrome_AI_Support', 'warning', 'Attempted to clear AI history, but session is not initialized.');
    }
}

/**
 * 检查 AI API 是否可用。
 * Checks if the AI API is available.
 * @returns {Promise<boolean>} 如果 API 可用返回 true，否则返回 false。
 * @returns {Promise<boolean>} Returns true if the API is available, otherwise false.
 */
export async function checkAPIAvailability() {
    try {
        // 检查 ai 对象是否未定义
        // Check if the ai object is undefined
        if (typeof ai === "undefined") {
            // 若未定义，抛出错误
            // If undefined, throw an error
            throw new Error("ai is not defined. The API may have changed or is not enabled in this browser.");
        }

        try{
            // 获取 AI 语言模型的能力信息
            // Get the capabilities information of the AI language model
            const capabilities = await ai.languageModel.capabilities();
            // 检查 API 是否随时可用
            // Check if the API is readily available
            if (capabilities.available === "readily") {
                // 设置 AI 支持为可用
                // Set AI support to available
                setSettings('ai_support', 'True');
                // 记录 API 可用日志
                // Record the API availability log
                add_log('Chrome_AI_Support', 'success', 'The browser environment meets the requirements');
                // 直接返回 true
                // Return true directly
                return true;
            }
        }catch {
            // 尝试初始化 AI
            // Try to initialize the AI
            if (await initAI()){
                // 设置 AI 支持为可用
                // Set AI support to available
                setSettings('ai_support', 'True');
                // 记录强制初始化成功日志
                // Record the forced initialization success log
                add_log('Chrome_AI_Support', 'success', 'Forced AI initialization, now enabled.');
                // 返回 true
                // Return true
                return true;
            }
        }
        // API 不可用，返回 false
        // API is unavailable, return false
        return false;


    } catch (error) {
        // 设置 AI 支持为不可用
        // Set AI support to unavailable
        setSettings('ai_support', 'False');
        // 记录检查 API 可用性错误日志
        // Record the error log of checking API availability
        add_log('Chrome_AI_Support', 'error', `Error checking API availability: ${error}`);
        // 返回 false
        // Return false
        return false;
    }
}

/**
 * 尝试向 AI 提问。
 * Attempts to ask the AI a question.
 * @param {string} something 要问的问题。
 * @param {string} something The question to ask.
 * @returns {Promise<string>} AI 的回答或错误信息。
 * @returns {Promise<string>} The AI's answer or an error message.
 */
export async function tryAskAI(something) {
    try {
        // 检查会话是否未初始化
        // Check if the session is not initialized
        if (!session) {
            // 记录会话未初始化错误
            // Record the session uninitialized error
            add_log('Chrome_AI_Support', 'error', 'Session is not initialized.');
            // 返回会话未初始化提示
            // Return the session uninitialized prompt
            return 'AI session is not initialized.';
        }

        // 检查 AI 支持和使用 Gemini 是否启用
        // Check if AI support and use of Gemini are enabled
        if (getSettings('ai_support') !== "False" && getSettings("use_gemini") !== "false") {
            // 向 AI 提问
            // Ask the AI a question
            const result = await session.prompt(something);
            // 返回 AI 的回答或错误信息
            // Return the AI's answer or an error message
            return typeof result === 'string' ? result : `Invalid result format: ${JSON.stringify(result)}`;
        } else {
            // 返回 AI 支持禁用提示
            // Return the AI support disabled prompt
            return 'AI support is disabled.';
        }
    } catch (error) {
        // 记录提问错误日志
        // Record the question error log
        add_log('Chrome_AI_Support', 'error', `Error in tryAskAI: ${error}`);
        // 返回错误信息
        // Return the error message
        return `Something went wrong: ${error}`;
    }
}

/**
 * 尝试以流式方式向 AI 提问。
 * Attempts to ask the AI a question in a streaming manner.
 * @param {string} something 要问的问题。
 * @param {string} something The question to ask.
 * @param {function} onChunk 每收到一部分回答时的回调函数。
 * @param {function} onChunk The callback function when each part of the answer is received.
 * @returns {Promise<string>} AI 的完整回答或错误信息。
 * @returns {Promise<string>} The AI's full answer or an error message.
 */
export async function tryAskAIStream(something, onChunk) {
    try {
        // 检查会话是否未初始化
        // Check if the session is not initialized
        if (!session) {
            // 记录会话未初始化错误
            // Record the session uninitialized error
            add_log('Chrome_AI_Support', 'error', 'Session is not initialized.');
            // 返回会话未初始化提示
            // Return the session uninitialized prompt
            return 'AI session is not initialized.';
        }
        // 检查 AI 支持和使用 Gemini 是否启用
        // Check if AI support and use of Gemini are enabled
        if (getSettings('ai_support') !== "False" && getSettings("use_gemini") !== "false") {
            // 以流式方式向 AI 提问
            // Ask the AI a question in a streaming manner
            const result = session.promptStreaming(something);
            // 存储完整回答
            // Store the full answer
            let fullResponse = "";
            // 遍历流式回答的每一部分
            // Iterate through each part of the streaming answer
            for await (const chunk of result) {
                // 拼接完整回答
                // Concatenate the full answer
                fullResponse += chunk;
                // 每收到一部分就调用回调更新 UI
                // Call the callback to update the UI when each part is received
                if (typeof onChunk === 'function') {
                    onChunk(chunk, fullResponse);
                }
            }
            // 返回完整回答
            // Return the full answer
            return fullResponse;
        } else {
            // 返回 AI 支持禁用提示
            // Return the AI support disabled prompt
            return 'AI support is disabled.';
        }
    } catch (error) {
        // 记录提问错误日志
        // Record the question error log
        add_log('Chrome_AI_Support', 'error', `Error in tryAskAI: ${error}`);
        // 返回错误信息
        // Return the error message
        return `Something went wrong: ${error}`;
    }
}
