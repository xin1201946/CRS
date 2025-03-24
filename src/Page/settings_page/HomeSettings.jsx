
import React from "react"
import { Typography, Card, Button, Space, Avatar, Divider } from "@douyinfe/semi-ui"
import {
    Server,       // 服务器IP
    ShieldCheck,  // HTTPS服务
    Palette,      // 主题色
    Bell,         // 通知样式
    MenuSquare,   // 内建右键菜单
    Bot,          // 生成式AI
    Cloud,        // API设置
    Info,         // 关于
    FileText,     // 日志查看器
} from "lucide-react";

import { useNavigate } from 'react-router-dom';
import {useTranslation} from "react-i18next";
import {detectDevice} from "../../code/check_platform.js";

const { Title, Text } = Typography

function HomeSettings() {
    const { t } = useTranslation();

    const navigate = useNavigate();
    const settingsGroups = [
        {
            title: t("Recommended settings"),
            linkTo:"/settings/home#reco",
            items: [
                { name: t("Server_IP"), icon: <Server size={20} />, url: "/settings/basic/#server_ip" },
                { name: t("Use_https"), icon: <ShieldCheck size={20} />, url: "/settings/advanced/#HTTPS_Service_Setting" },
                { name: t("Theme_color"), icon: <Palette size={20} />, url: "/settings/basic/#theme_color" },
            ],
        },
        {
            title: t("Base_Settings"),
            linkTo:"/settings/basic",
            items: [
                { name: t("Server_IP"), icon: <Server size={20} />, url: "/settings/basic/#server_ip" },
                { name: t("Theme_color"), icon: <Palette size={20} />, url: "/settings/basic/#theme_color" },
                { name: t("Notify Style"), icon: <Bell size={20} />, url: "/settings/basic/#Notify_Set" },
                { name: t("UI_set"), icon: <MenuSquare size={20} />, url: "/settings/basic/#UI_set" },
                { name: t("Using Generative AI"), icon: <Bot size={20} />, url: "/settings/basic/#AI_Setting" },
            ],
        },
        {
            title: t("Advanced_Settings"),
            linkTo:"/settings/advanced",
            items: [
                { name: t("Use_https"), icon: <ShieldCheck size={20} />, url: "/settings/advanced/#HTTPS_Service_Setting" },
                { name: t("API_Settings"), icon: <Cloud size={20} />, url: "/settings/advanced/#API_Settings" },
            ],
        },
        {
            title: t("Other settings"),
            linkTo:"/settings/home#othe",
            items: [
                { name: t("About"), icon: <Info size={20} />, url: "/settings/about" },
                { name: t("Log_viewer"), icon: <FileText size={20} />, url: "/settings/logs/" },
            ],
        },
    ];

    return (
        <div
            style={{
                padding: detectDevice()==="PC"?"20px":"0px",
                paddingBottom: detectDevice() === "PC" ? "0px" : "30px",
                backgroundColor: "var(--semi-color-bg-0)",
                minHeight: "100vh",
            }}
        >
            <div
                style={{
                    maxWidth: "100%",
                    margin: "0 auto",
                }}
            >
                {/* Settings cards */}
                <Space vertical align="start" spacing={24} style={{ width: "100%" }}>
                    {settingsGroups.map((group, index) => (
                        <Card
                            key={index}
                            id={group.title.toString().toLowerCase().slice(0,4)}
                            shadows="hover"
                            style={{
                                borderRadius: "12px",
                                width: "100%",
                                transition: "all 0.3s ease",
                                border: "1px solid var(--semi-color-border)",
                                overflow: "hidden",
                            }}
                            bodyStyle={{ padding: 0 }}
                            headerStyle={{
                                padding: "20px 24px",
                                borderBottom: "1px solid var(--semi-color-border)",
                                backgroundColor: "var(--semi-color-fill-0)",
                            }}
                            header={
                                <Title heading={5} style={{ margin: 0 }}  onClick={() => navigate(`${group.linkTo}`)}>
                                    {group.title}
                                </Title>
                            }
                        >
                            <div style={{ padding: "8px 0" }}>
                                {group.items.map((item, itemIndex) => (
                                    <React.Fragment key={itemIndex}>
                                        <Button
                                            theme="borderless"
                                            block
                                            style={{
                                                justifyContent: "flex-start",
                                                height: "auto",
                                                padding: "16px 24px",
                                                textAlign: "left",
                                                transition: "background-color 0.2s ease",
                                                borderRadius: 0,
                                            }}
                                            onClick={() => {navigate(item.url)}}
                                        >
                                            <Space>
                                                <Avatar
                                                    size="default"
                                                    shape="square"
                                                    style={{
                                                        backgroundColor: "var(--semi-color-primary-light-default)",
                                                        color: "var(--semi-color-primary)",
                                                    }}
                                                >
                                                    {item.icon}
                                                </Avatar>
                                                <Text size="large">{item.name}</Text>
                                            </Space>
                                        </Button>
                                        {itemIndex < group.items.length - 1 && <Divider margin={0} style={{ margin: "0 24px" }} />}
                                    </React.Fragment>
                                ))}
                            </div>
                        </Card>
                    ))}
                </Space>
            </div>
        </div>
    )
}

export default HomeSettings

