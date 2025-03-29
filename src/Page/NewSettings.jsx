import { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button, Layout, Nav } from '@douyinfe/semi-ui';
import { motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { useSettingsRoutes } from './widget/Settings/settingsConfig';
import SettingsSlot from './widget/Settings/SettingsSlot';
import "./widget/Settings/settings.css";
import { detectDevice } from "../code/check_platform.js";
import { IconSidebar } from "@douyinfe/semi-icons";
import { useTranslation } from "react-i18next";
import PageTitle from "../Page/widget/Settings/PageTitle";
import ErrorPage from "./error_page/ErrorPage.jsx";
const { Sider, Content } = Layout;

// eslint-disable-next-line react/prop-types
function SettingsLayout({ backgroundColor = 'var(--semi-color-bg-0)', textColor = 'var(--semi-color-text-0)' }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const settingsRoute = useSettingsRoutes();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapse = () => setCollapsed(!collapsed);
    const currentPath = location.pathname.split('/settings/')[1]?.split('/')[0] || 'home';
    const [indicatorStyle] = useState({ top: 0, height: 0 });
    const navRef = useRef(null);
    const scrollWrapperRef = useRef(null);
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // 使用 scrollWrapperRef 内部的滚动容器
        const scrollContainer = scrollWrapperRef.current;
        if (!scrollContainer) return;
        if (!location.hash) {
            scrollContainer.scrollTo(0, 0);
        }
        setTimeout(() => {
            if (location.hash) {
                const id = location.hash.slice(1);
                const element = document.getElementById(id);
                if (element) {
                    // 这里可选使用 element.scrollIntoView() 来平滑滚动到目标元素
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 50);
    }, [location.pathname, location.hash]);
    useEffect(() => {
        return () => {
            window.dispatchEvent(new CustomEvent('themeChange'));
        }
    })

    const menuItems = settingsRoute.map(({ path, icon: Icon, text, description }) => ({
        itemKey: path,
        text,
        icon: <Icon size={18} />,
        description
    }));
    const currentRoute = settingsRoute.find(route => currentPath.startsWith(route.path));

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="h-full">
            <Layout className="h-full ">
                <div className="h-14 bg-[--semi-color-nav-bg] flex items-center px-4 shadow-sm justify-between">
                    <div className="flex items-center gap-2 bg-[--semi-color-nav-bg]">
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft size={17} />
                        </button>
                        <span className="text-sm"  style={{ height: '100%', display: detectDevice() === "Phone" ? "none" : "block" }}>{t("Settings")}</span>
                    </div>
                    <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-900">
                        <X size={17} />
                    </button>
                </div>
                <Layout className="h-[calc(100%-3.5rem)]">
                    <Sider className="bg-[--semi-color-nav-bg] relative">
                        <div ref={navRef} className="h-full">
                            <Nav
                                items={menuItems}
                                selectedKeys={[currentPath]}
                                onSelect={(data) => navigate(`/settings/${data.itemKey}`)}
                                style={{ height: '100%', display: detectDevice() === "Phone" ? "none" : "block" }}
                                isCollapsed={detectDevice() === 'PC' && windowWidth >= 1000 ? collapsed : true}
                                footer={{
                                    children: (
                                        detectDevice() === 'PC' && windowWidth >= 1000 ? (
                                            <Button
                                                icon={<IconSidebar style={{ color: collapsed ? 'var(--semi-color-tertiary-active)' : 'var(--semi-color-primary)' }} />}
                                                onClick={toggleCollapse}
                                                theme="borderless"
                                            >
                                                {collapsed ? "" : t('Close navigation')}
                                            </Button>
                                        ) : null
                                    )
                                }}
                            />
                        </div>
                        <motion.div className="highlight-indicator" initial={false} animate={indicatorStyle} transition={{ type: "spring", stiffness: 500, damping: 40 }} />
                    </Sider>
                    <Content
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            height: 'calc(100vh - 3.5rem)',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{ overflow: 'auto' }} ref={scrollWrapperRef}>
                            <PageTitle title={currentRoute?.description || t("Page Not Found")} scrollContainer={scrollWrapperRef} />

                            <div style={{ padding: '2rem', minHeight: 'calc(100% - 40vh)' }}>
                                {currentRoute ? (
                                    <SettingsSlot component={currentRoute.component} backgroundColor={backgroundColor} textColor={textColor} />
                                ) : (
                                    <ErrorPage
                                        code={404}
                                        title={t("Page Not Found")}
                                        description={t("The page you are looking for does not exist.")}
                                        homeUrl={"/settings/home"}
                                    />
                                )}
                            </div>
                        </div>

                    </Content>
                </Layout>
            </Layout>
        </motion.div>
    );
}

export default SettingsLayout;
