"use client"
import React, {lazy, Suspense, useMemo, useState} from "react"
import {Card, SideSheet} from "@douyinfe/semi-ui"
import {IconArrowRight, IconBeaker, IconFile, IconInfoCircle, IconLanguage, IconSetting} from "@douyinfe/semi-icons"
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js"
import {useTranslation} from "react-i18next"

// 懒加载组件
const BaseSPage = lazy(() => import("./settings_page/BaseS.jsx"))
const AboutWE = lazy(() => import("./settings_page/About.jsx"))
const AdvancedSettingsPage = lazy(() => import("./settings_page/AdvancedSettings.jsx"))
const LanguagePage = lazy(() => import("./settings_page/LanguagePage.jsx"))
const LogsViewer = lazy(() => import("./settings_page/Logs_Viewer.jsx"))

// 可重用的 SettingCard 组件
const SettingCard = ({ icon, title, description, onClick }) => (
    <Card
        shadows="hover"
        style={{ cursor: "pointer", marginBottom: "1rem" }}
        bodyStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
        }}
        onClick={onClick}
    >
        <Meta
            avatar={React.cloneElement(icon, { style: { color: "var(--semi-color-primary)" } })}
            title={title}
            description={description}
        />
        <IconArrowRight style={{ color: "var(--semi-color-primary)" }} />
    </Card>
)

export function Settings() {
    const { t } = useTranslation()
    const [visibleSheet, setVisibleSheet] = useState(null)

    const closeSheet = () => setVisibleSheet(null)

    const settingsData = useMemo(
        () => [
            {
                key: "base",
                icon: <IconSetting />,
                title: t("Base_Settings"),
                description: t("Server_IP"),
                component: BaseSPage,
            },
            {
                key: "advanced",
                icon: <IconBeaker />,
                title: t("Advanced_Settings"),
                description: `${t("API_port")},${t("HTTPS_Service")}`,
                component: AdvancedSettingsPage,
            },
            {
                key: "language",
                icon: <IconLanguage />,
                title: "语言/Language",
                description: t("Toggle_display_language"),
                component: LanguagePage,
            },
            {
                key: "logs",
                icon: <IconFile />,
                title: t("Log_viewer"),
                description: t("Log_viewer_text"),
                component: LogsViewer,
            },
            {
                key: "about",
                icon: <IconInfoCircle />,
                title: t("About"),
                description: t("AppInfo"),
                component: AboutWE,
            },
        ],
        [t],
    )

    return (
        <>
            {settingsData.map((setting) => (
                <SettingCard
                    key={setting.key}
                    icon={setting.icon}
                    title={setting.title}
                    description={setting.description}
                    onClick={() => setVisibleSheet(setting.key)}
                />
            ))}

            {settingsData.map((setting) => (
                <SideSheet
                    key={setting.key}
                    style={{ maxWidth: "100%", width: setting.key === "logs" ? "100%" : undefined }}
                    closeOnEsc={true}
                    title={setting.title}
                    visible={visibleSheet === setting.key}
                    onCancel={closeSheet}
                >
                    <Suspense fallback={<div>Loading...</div>}>
                        <setting.component />
                    </Suspense>
                </SideSheet>
            ))}
        </>
    )
}

