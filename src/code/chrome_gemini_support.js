//本API为前端的AI功能提供支持，但是请注意：
//本功能仅支持Windows、MacOS 和 Linux 的操作系统的 Chrome Dev / Canary 浏览器，内核需满足129.0.6667.0+
//受限与本功能不依赖任何服务器而是Google Chrome支持，本API功能可能会随时失效，请阅读开发者文档并进行修改：https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0
//使用该功能需要告知用户以下内容和条款：
//[摘自开发者文档]
//磁盘要有至少 22GB 空间用于存储（下载后可用空间不能低于 10GB）；具备集成或独立 GPU 且视频 RAM 为 6GB；使用非计量网络连接。
//当前不支持 Chrome 的隐身模式和访客模式；在企业环境中，如果 GenAILocalFoundationalModelSettings 设置为 “Donotdownloadmodel”，API 将无法工作；
//API 不支持 “after - download” 状态，该状态下 API 不会触发模型下载，模型下载由 Chrome 基于自身机制进行。
//该 API 主要用于实验，输出质量可能无法达到与未来计划推出的特定任务 API 集成后的最终效果。
//模型在处理某些任务时可能存在局限性，如回答知识类问题可能不准确，对于需要精准答案的任务也可能表现不佳，开发者在设计功能或用户体验时需考虑这些因素。
//请严格遵守 https://policies.google.com/terms/generative-ai/use-policy 使用条款.
//如果需要开启内置多语言支持，请关闭  Text Safety Classifier

import {add_log} from "./log.js";
import {setSettings} from "./Settings.js";

let session = null; // 先定义全局变量

export async function initAI() {
    session = await ai.languageModel.create({
        systemPrompt: "You are a Google Gemini named Canf, used to assist users in solving program problems.."
    });
}
export async function clearAiHistory() {
    session = await session.clone();
}

export async function checkAPIAvailability() {
    try {
        const capabilities = await ai.languageModel.capabilities();
        if (capabilities.available === "readily") {
            await initAI()
            setSettings('ai_support','True')
            add_log('Chrome_AI_Support','successfully','The browser environment meets the requirements')
        } else if (capabilities.available === "no") {
            setSettings('ai_support','False')
            add_log('Chrome_AI_Support','warning','The browser environment does not meet the requirements')
        }
    } catch (error) {
        setSettings('ai_support','False')
        add_log('Chrome_AI_Support','warning','Error:'+error+',It may be an unsupported browser.')
    }
}
export async function tryAskAI(something) {
    try {
        const {available} = await ai.languageModel.capabilities();
        if (available!== "no") {
            const result = await session.prompt(something);
            if (typeof result === 'string') {
                return result;
            } else {
                return 'Invalid result format from session.prompt:'+result;
            }
        } else {
            return 'something was wrong';
        }
    } catch (error) {
        return 'something was wrong:'+error;
    }
}
