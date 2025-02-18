import {createRoot} from 'react-dom/client'; // 修改这里
import {StrictMode} from 'react';
import App from './App.jsx';
import './index.css';
import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import zh_CN from '@douyinfe/semi-ui/lib/es/locale/source/zh_CN';
import en_US from '@douyinfe/semi-ui/lib/es/locale/source/en_US';
import zhCN from './locales/zh-CN.json';
import enUS from './locales/en-US.json';
import {LocaleProvider} from '@douyinfe/semi-ui';
import {get_language} from './code/language.js'; // 引入语言设置函数


// 初始化 i18next
i18n
    .use(initReactI18next) // 绑定 React
    .init({
        resources: {
            en: { translation: enUS },
            zh: { translation: zhCN }
        },
        lng: get_language() === 1 ? 'zh' : 'en', // 动态设置默认语言
        fallbackLng: 'zh', // 备用语言
        interpolation: {
            escapeValue: false // React 格式不需要 HTML 转义
        }
    });

// 获取当前语言并设置 LocaleProvider 的语言
const currentLocale = get_language() === 1 ? zh_CN : en_US;

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <LocaleProvider locale={currentLocale}>
            <App />
        </LocaleProvider>
    </StrictMode>
);
