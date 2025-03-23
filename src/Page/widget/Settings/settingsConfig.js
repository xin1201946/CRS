import { lazy } from 'react';
import {Home, Server, Sliders, Languages, FileText, Info } from 'lucide-react';
import {useTranslation} from "react-i18next";

// 懒加载组件
const HomeSettings = lazy(() => import('../../settings_page/HomeSettings'));
const BasicSettings = lazy(() => import('../../settings_page/BaseS.jsx'));
const AdvancedSettings = lazy(() => import('../../settings_page/AdvancedSettings.jsx'));
const LanguageSettings = lazy(() => import('../../settings_page/LanguagePage.jsx'));
const LogViewer = lazy(() => import('../../settings_page/Logs_Viewer.jsx'));
const About = lazy(() => import('../../settings_page/About.jsx'));

export const useSettingsRoutes = () => {
    const { t } = useTranslation();

    return [
        {
            path: 'home',
            component: HomeSettings,
            icon: Home,
            text: t("Home"),
            description: t("Settings")
        },
        {
            path: 'basic',
            component: BasicSettings,
            icon: Server,
            text: t("Base_Settings"),
            description: t("Base_Settings")
        },
        {
            path: 'advanced',
            component: AdvancedSettings,
            icon: Sliders,
            text: t("Advanced_Settings"),
            description: t("Advanced_Settings")
        },
        {
            path: 'language',
            component: LanguageSettings,
            icon: Languages,
            text: '语言/Language',
            description: '语言/Language'
        },
        {
            path: 'logs',
            component: LogViewer,
            icon: FileText,
            text: t("Log_viewer"),
            description: t("Log_viewer")
        },
        {
            path: 'about',
            component: About,
            icon: Info,
            text: t("About"),
            description: t("About")
        }
    ];
};

