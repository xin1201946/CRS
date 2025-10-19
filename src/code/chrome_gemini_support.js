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
// 会话初始化状态
// Session initialization status
let sessionInitializing = false;

/**
 * 初始化 AI 会话。
 * Initializes the AI session.
 * @returns {Promise<boolean>} 如果初始化成功返回 true，否则返回 false。
 * @returns {Promise<boolean>} Returns true if the initialization is successful, otherwise false.
 */
export async function initAI() {
    // 如果会话已经存在，直接返回成功
    // If the session already exists, return success directly
    if (session) {
        add_log('Chrome_AI_Support', 'info', 'Session is already initialized.');
        return true;
    }
    
    // 如果正在初始化，等待
    // If initializing, wait
    if (sessionInitializing) {
        add_log('Chrome_AI_Support', 'info', 'Session initialization is in progress. Waiting...');
        // 等待初始化完成
        // Wait for initialization to complete
        let waitAttempts = 0;
        while (sessionInitializing && waitAttempts < 10) {
            await new Promise(resolve => setTimeout(resolve, 500)); // 等待500ms
            waitAttempts++;
        }
        return !!session; // 返回会话是否存在
    }
    
    // 标记为正在初始化
    // Mark as initializing
    sessionInitializing = true;
    
    try {
        // 检查 LanguageModel 对象是否未定义 (新版 Chrome API)
        // Check if the LanguageModel object is undefined (new Chrome API)
        if (typeof LanguageModel === "undefined") {
            // 若未定义，抛出错误
            // If undefined, throw an error
            throw new Error("LanguageModel is not defined. The API may have changed or is not enabled in this browser.");
        }
        
        // 创建 AI 会话，使用新版 API 结构
        // Create an AI session using the new API structure
        session = await LanguageModel.create({
            // 设置输出语言为英语（API要求指定输出语言）
            // Set output language to English (API requires output language)
            expectedInputs: [
                { type: "text", languages: ["en" /* system prompt */, "ja" /* user prompt */] }
            ],
            expectedOutputs: [
                { type: "text", languages: ["en"] }
            ],
            // 设置系统提示信息作为初始提示
            // Set system prompt as initial prompts
            initialPrompts: [
                {
                    role: "system",
                    content:
                        "Hi, you are speaking with " + user_name + ".\n" +
                        "Database structure:\n" +
                        "- `history_record`: Records the identification history.\n" +
                        "- `record_info`: Records the details of each identification record.\n" +
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
                        "'You can use the quick query button at the bottom of the Terminal page, which is the recommended method. If you prefer the command line, open the Terminal at the top of the page and type: `rexec select * from history_record;`. Note that commands to delete or modify database records are prohibited.'\n" +
                        "\n" +
                        "You are CCRS AI — an assistant integrated into this system. The program itself was created by Canfeng. You should never refer to yourself as Canfeng."
                    }

            ],
            // 可选: 监视下载进度
            // Optional: monitor download progress
            monitor(m) {
                m.addEventListener("downloadprogress", e => {
                    add_log('Chrome_AI_Support', 'info', `下载进度: ${e.loaded} / ${e.total} 字节`);
                });
            }
        });
        
        // 初始化成功，返回 true
        // Initialization successful, return true
        sessionInitializing = false; // 重置初始化状态
        return true;
    } catch (error) {
        // 记录初始化失败日志
        // Record the initialization failure log
        add_log('Chrome_AI_Support', 'error', `Failed to initialize AI: ${error}`);
        // 重置初始化状态
        // Reset initialization status
        sessionInitializing = false;
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
        // 使用新版API的clone方法清除历史
        // Use the new API's clone method to clear history
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
        // 检查 LanguageModel 对象是否未定义
        // Check if the LanguageModel object is undefined
        if (typeof LanguageModel === "undefined") {
            // 若未定义，抛出错误
            // If undefined, throw an error
            throw new Error("LanguageModel is not defined. The API may have changed or is not enabled in this browser.");
        }

        try {
            // 获取 AI 语言模型的可用性信息 (新版API)
            // Get the availability information of the AI language model (new API)
            const { available } = await LanguageModel.availability({
                // 使用与创建会话时相同的语言设置
                // Use the same language settings as when creating the session
                expectedInputs: [
                    { type: "text", languages: ["en", "ja"] }
                ],
                expectedOutputs: [
                    { type: "text", languages: ["en"] }
                ]
            });
            
            // 检查 API 是否可用
            // Check if the API is available
            if (available !== "no") {
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
        } catch {
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
            // 记录会话初始化尝试日志
            // Record session initialization attempt log
            add_log('Chrome_AI_Support', 'info', 'Session is not initialized. Attempting to initialize...');
            console.log("Initializing AI before asking...");
            
            // 等待AI初始化完成
            // Wait for AI initialization to complete
            const initSuccess = await initAI();
            
            if (!initSuccess) {
                add_log('Chrome_AI_Support', 'error', 'Failed to initialize AI session.');
                return 'AI session initialization failed. Please try again or check your browser settings.';
            }
            
            add_log('Chrome_AI_Support', 'success', 'AI session initialized successfully.');
        }

        // 检查 AI 支持和使用 Gemini 是否启用
        // Check if AI support and use of Gemini are enabled
        if (getSettings('ai_support') !== "False" && getSettings("use_gemini") !== "false") {
            // 向 AI 提问 (使用新的 API 结构)
            // Ask the AI a question (using new API structure)
            console.log("Asking AI:", something);
            const result = await session.prompt(something, {
                // 使用与创建会话时相同的语言设置
                // Use the same language settings as when creating the session
                expectedOutputs: [
                    { type: "text", languages: ["en"] }
                ]
            });
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
            // 记录会话初始化尝试日志
            // Record session initialization attempt log
            add_log('Chrome_AI_Support', 'info', 'Session is not initialized. Attempting to initialize...');
            console.log("Initializing AI before streaming...");
            
            // 等待AI初始化完成
            // Wait for AI initialization to complete
            const initSuccess = await initAI();
            
            if (!initSuccess) {
                add_log('Chrome_AI_Support', 'error', 'Failed to initialize AI session.');
                return 'AI session initialization failed. Please try again or check your browser settings.';
            }
            
            add_log('Chrome_AI_Support', 'success', 'AI session initialized successfully.');
        }
        // 检查 AI 支持和使用 Gemini 是否启用
        // Check if AI support and use of Gemini are enabled
        if (getSettings('ai_support') !== "False" && getSettings("use_gemini") !== "false") {
            // 以流式方式向 AI 提问 (使用新的 API 结构)
            // Ask the AI a question in a streaming manner (using new API structure)
            const result = session.promptStreaming(something, {
                // 使用与创建会话时相同的语言设置
                // Use the same language settings as when creating the session
                expectedOutputs: [
                    { type: "text", languages: ["en"] }
                ]
            });
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
        add_log('Chrome_AI_Support', 'error', `Error in tryAskAIStream: ${error}`);
        // 返回错误信息
        // Return the error message
        return `Something went wrong: ${error}`;
    }
}

/**
 * 获取AI会话信息，包括令牌使用情况和配额。
 * Get AI session information, including token usage and quota.
 * @returns {Object|null} 返回包含会话信息的对象，如果会话未初始化则返回 null。
 * @returns {Object|null} Returns an object containing session information, or null if the session is not initialized.
 */
export function getSessionInfo() {
    if (!session) {
        return null;
    }
    
    return {
        // 新版API的配额跟踪
        // New API quota tracking
        inputUsage: session.inputUsage || 0,
        inputQuota: session.inputQuota || 0,
        
        // 保留旧有字段以保持向后兼容
        // Keep old fields for backward compatibility
        tokensSoFar: session.inputUsage || 0,
        maxTokens: session.inputQuota || 0,
        tokensLeft: session.inputQuota - session.inputUsage || 0
    };
}

/**
 * 销毁当前会话并释放资源。
 * Destroy the current session and free resources.
 */
export function destroySession() {
    if (session) {
        session.destroy();
        session = null;
        add_log('Chrome_AI_Support', 'info', 'Session destroyed and resources freed.');
    }
}
