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

const { Sider, Content } = Layout;

function SettingsLayout({ backgroundColor = 'var(--semi-color-bg-0)', textColor = 'var(--semi-color-text-0)' }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const settingsRoute = useSettingsRoutes();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapse = () => setCollapsed(!collapsed);
    const currentPath = location.pathname.split('/settings/')[1]?.split('/')[0] || 'home';
    const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
    const navRef = useRef(null);
    const scrollWrapperRef = useRef(null);

    useEffect(() => {
        // 定义处理函数
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };
        // 添加 resize 事件监听器
        window.addEventListener('resize', handleResize);

        // 清理函数，在组件卸载时移除监听器
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []); // 空依赖数组，只在挂载和卸载时运行
    // 其他 useEffect 逻辑保持不变
    useEffect(() => {
        if (!location.hash) window.scrollTo(0, 0);
        setTimeout(() => {
            if (location.hash) {
                const id = location.hash.slice(1);
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 50);
        // ... 其他逻辑
    }, [location.pathname, location.hash]);

    // 渲染逻辑保持不变
    const menuItems = settingsRoute.map(({ path, icon: Icon, text, description }) => ({
        itemKey: path,
        text,
        icon: <Icon size={18} />,
        description
    }));
    const currentRoute = settingsRoute.find(route => currentPath.startsWith(route.path));

    return (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }} className="h-full">
            <Layout className="h-full">
                <div className="h-14 bg-white flex items-center px-4 shadow-sm justify-between">
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft size={17} />
                        </button>
                        <span className="text-sm">{t("Settings")}</span>
                    </div>
                    <button onClick={() => navigate("/")} className="text-gray-600 hover:text-gray-900">
                        <X size={17} />
                    </button>
                </div>
                <Layout className="h-[calc(100%-3.5rem)]">
                    <Sider className="bg-white relative">
                        <div ref={navRef} className="h-full">
                            <Nav
                                items={menuItems}
                                selectedKeys={[currentPath]}
                                onSelect={(data) => navigate(`/settings/${data.itemKey}`)}
                                style={{ height: '100%' }}
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
                        <div
                        style={{
                            overflow:'auto'
                        }}
                        ref={scrollWrapperRef}
                        >

                            <PageTitle title={currentRoute?.description || ''} scrollContainer={scrollWrapperRef} />
                            <div style={{ padding: '2rem', minHeight: 'calc(100% - 40vh)' }}>
                                {currentRoute && (
                                    <SettingsSlot component={currentRoute.component} backgroundColor={backgroundColor} textColor={textColor} />
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