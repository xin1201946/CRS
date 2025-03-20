import  { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {Button, Layout, Nav} from '@douyinfe/semi-ui';
import { motion } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { useSettingsRoutes } from './widget/Settings/settingsConfig';
import SettingsSlot from './widget/Settings/SettingsSlot';
import "./widget/Settings/settings.css";
import {detectDevice} from "../code/check_platform.js";
import {IconSidebar} from "@douyinfe/semi-icons";
import {useTranslation} from "react-i18next";

const { Sider, Content } = Layout;

function SettingsLayout({ backgroundColor = 'var(--semi-color-bg-0)', textColor = 'var(--semi-color-text-0)' }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const settingsRoute = useSettingsRoutes();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };
    // 获取当前设置页面的子路由标识，比如 basic、advanced 等
    const currentPath = location.pathname.split('/settings/')[1]?.split('/')[0] || 'home';
    const [indicatorStyle, setIndicatorStyle] = useState({ top: 0, height: 0 });
    const navRef = useRef(null);

    // 同步高亮：更新指示器位置
    const updateIndicatorPosition = () => {
        if (navRef.current) {
            const selectedItem = navRef.current.querySelector('.semi-navigation-item-selected');
            if (selectedItem) {
                const { top, height } = selectedItem.getBoundingClientRect();
                const navTop = navRef.current.getBoundingClientRect().top;
                setIndicatorStyle({
                    top: top - navTop,
                    height
                });
            }
        }
    };

    useEffect(() => {
        // 延时执行，确保组件渲染完毕

        if (!location.hash) {
            window.scrollTo(0, 0);
        }
        setTimeout(() => {
            if (location.hash) {
                const id = location.hash.slice(1);
                const element = document.getElementById(id);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 50);
        updateIndicatorPosition();
        window.addEventListener('resize', updateIndicatorPosition);

        const observer = new MutationObserver(updateIndicatorPosition);
        if (navRef.current) {
            observer.observe(navRef.current, { attributes: true, childList: true, subtree: true });
        }
        return () => {
            window.removeEventListener('resize', updateIndicatorPosition);
            observer.disconnect();
        };
    }, [location.pathname, location.hash]);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // 监听窗口大小变化事件
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    const menuItems = settingsRoute.map(({ path, icon: Icon, text, description }) => ({
        itemKey: path,
        text,
        icon: <Icon size={18} />,
        description
    }));

    const currentRoute = settingsRoute.find(route => currentPath.startsWith(route.path));

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="h-full"
        >
            <Layout className="h-full">
                <div className="h-14 bg-white flex items-center px-4 shadow-sm justify-between">
                    {/* 左侧：返回按钮 + 设置文字 */}
                    <div className="flex items-center gap-2">
                        <button onClick={() => navigate(-1)} className="text-gray-600 hover:text-gray-900">
                            <ArrowLeft size={17} />
                        </button>
                        <span className="text-sm">{t("Settings")}</span>
                    </div>
                    {/* 右侧：关闭按钮 */}
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

                                isCollapsed={detectDevice()==='PC' && windowWidth >= 1000?collapsed:true}
                                footer={{
                                    children: (
                                        <>
                                            {
                                                detectDevice()==='PC' && windowWidth >= 1000? <Button
                                                    icon={collapsed ?<IconSidebar style={{ color: 'var(--semi-color-tertiary-active)' }} /> : <IconSidebar style={{ color: 'var(--semi-color-primary)' }} />}
                                                    onClick={toggleCollapse}
                                                    theme="borderless"
                                                >
                                                    {collapsed ? "" : t('Close navigation')}
                                                </Button> : null
                                            }
                                        </>
                                    ),
                                }}
                            />
                        </div>
                        <motion.div
                            className="highlight-indicator"
                            initial={false}
                            animate={indicatorStyle}
                            transition={{
                                type: "spring",
                                stiffness: 500,
                                damping: 40,
                                restDelta: 0.001,
                                restSpeed: 0.001,
                                velocity: 500
                            }}
                        />
                    </Sider>
                    <Content>
                        {currentRoute && (
                            <>
                                <p  style={{ marginLeft: "20px",  fontSize: "30px" ,backgroundColor: 'transparent' ,height:"7vh"}}>{currentRoute.description}</p>
                                <SettingsSlot
                                    component={currentRoute.component}
                                    backgroundColor={backgroundColor}
                                    textColor={textColor}
                                />
                            </>
                        )}
                    </Content>
                </Layout>
            </Layout>
        </motion.div>
    );
}

export default SettingsLayout;
