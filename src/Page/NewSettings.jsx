import { useRef, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, X, Menu, ChevronRight, Info , SquareArrowOutUpRight } from 'lucide-react';
import { useSettingsRoutes } from './widget/Settings/settingsConfig';
import SettingsSlot from './widget/Settings/SettingsSlot';
import "./widget/Settings/settings.css";
import { detectDevice } from "../code/check_platform.js";
import { useTranslation } from "react-i18next";
import PageTitle from "../Page/widget/Settings/PageTitle";
import ErrorPage from "./error_page/ErrorPage.jsx";

function SettingsLayout({ backgroundColor = 'bg-[var(--semi-color-bg-0)]', textColor = 'text-[var(--semi-color-text-0)]' }) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const location = useLocation();
    const settingsRoute = useSettingsRoutes();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [collapsed, setCollapsed] = useState(window.innerWidth < 900);
    const currentPath = location.pathname.split('/settings/')[1]?.split('/')[0] || 'home';
    const scrollWrapperRef = useRef(null);
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const [isTransitioning, setIsTransitioning] = useState(false);

    const isPhone = detectDevice() === 'Phone';
    const canShowMini = !isPhone && windowWidth >= 900;

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            if (window.innerWidth < 900) setCollapsed(true);
            else setCollapsed(false);
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // 处理导航栏展开/折叠的过渡动画
    const toggleCollapsed = (value) => {
        setIsTransitioning(true);
        setCollapsed(value);
        // 为过渡动画预留足够时间
        setTimeout(() => {
            setIsTransitioning(false);
        }, 350); // 略长于CSS过渡时间
    };

    useEffect(() => {
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
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            } else {
                scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 50);
    }, [location.pathname, location.hash]);

    // 关闭子菜单当路径改变时
    useEffect(() => {
        setActiveSubmenu(null);
    }, [currentPath]);

    // 对菜单项进行分组
    const groupedMenuItems = settingsRoute.reduce((acc, item) => {
        const category = item.category || '常规';
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push({
            path: item.path,
            text: item.text,
            icon: item.icon,
            description: item.description,
            subItems: item.subItems || []
        });
        return acc;
    }, {});

    // 切换子菜单显示状态
    const toggleSubmenu = (path) => {
        setActiveSubmenu(activeSubmenu === path ? null : path);
    };

    const currentRoute = settingsRoute.find(route => currentPath.startsWith(route.path));

    return (
        <div className="flex h-screen relative bg-[var(--semi-color-bg-1)]">
            {/* 折叠时的浮动菜单按钮（仅在手机或小屏时显示） */}
            {collapsed && !canShowMini && (
                <button
                    onClick={() => toggleCollapsed(false)}
                    className="fixed top-4 left-4 z-30 p-2 rounded hover:bg-[var(--semi-color-fill-1)]"
                    aria-label="展开导航栏"
                >
                    <Menu size={22} />
                </button>
            )}

            {/* Pane */}
            <aside
                className={`
                    ${collapsed
                        ? (canShowMini ? 'w-16 min-w-[64px]' : 'w-0 min-w-0')
                        : 'w-[260px] min-w-[260px]'}
                    flex flex-col border-r border-[var(--semi-color-border)] bg-[var(--semi-color-bg-1)] transition-all duration-300 overflow-hidden
                `}
                style={{ zIndex: 20 }}
            >
                <div className="flex-1 flex flex-col">
                    {/* 顶部：菜单按钮和返回 */}
                    {!collapsed && (
                        <div className="flex items-center h-14 px-4 gap-2 border-b border-[var(--semi-color-border)]">
                            <button
                                onClick={() => toggleCollapsed(true)}
                                className="p-2 rounded hover:bg-[var(--semi-color-fill-1)]"
                                aria-label="折叠导航栏"
                            >
                                <Menu size={20} />
                            </button>
                            <button 
                                onClick={() => navigate(-1)} 
                                className="p-2 rounded hover:bg-[var(--semi-color-fill-1)]" 
                                aria-label="返回"
                            >
                                <ArrowLeft size={20} />
                            </button>
                            <span className={`text-base font-medium whitespace-nowrap ${isTransitioning ? 'opacity-0' : 'opacity-100 transition-opacity duration-200 delay-200'}`}>{t('设置')}</span>
                        </div>
                    )}

                    {/* 导航项 */}
                    {(canShowMini || !collapsed) && (
                        <nav className="flex-1 overflow-y-auto">
                            {/* 折叠时，在顶部显示展开按钮 */}
                            {collapsed && canShowMini && (
                                <div
                                    className="flex items-center justify-center py-3 cursor-pointer hover:bg-[var(--semi-color-fill-1)]"
                                    onClick={() => toggleCollapsed(false)}
                                >
                                    <Menu size={20} />
                                </div>
                            )}

                            {/* 分组展示菜单项 */}
                            {Object.entries(groupedMenuItems).map(([category, items]) => (
                                <div key={category} className="py-1">
                                    {!collapsed && category !== '常规' && (
                                        <div className={`px-5 py-1 mt-2 text-xs text-[var(--semi-color-text-2)] ${isTransitioning ? 'opacity-0' : 'opacity-100 transition-opacity duration-200 delay-150'}`}>
                                            {category}
                                        </div>
                                    )}
                                    
                                    {items.map(item => (
                                        <div key={item.path} className="relative">
                                            <div
                                                className={`
                                                    flex items-center ${!collapsed ? 'px-3' : 'justify-center'} py-2 cursor-pointer mx-2
                                                    ${currentPath === item.path
                                                        ? 'text-[var(--semi-color-primary)] font-medium'
                                                        : 'text-[var(--semi-color-text-0)] hover:bg-[var(--semi-color-fill-1)] hover:rounded'}
                                                `}
                                                onClick={() => {
                                                    if (item.subItems && item.subItems.length > 0 && !collapsed && !isTransitioning) {
                                                        toggleSubmenu(item.path);
                                                    } else {
                                                        navigate(`/settings/${item.path}`);
                                                        if (windowWidth < 900) toggleCollapsed(true);
                                                    }
                                                }}
                                            >
                                                {currentPath === item.path && (
                                                    <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-[var(--semi-color-primary)]" />
                                                )}
                                                
                                                <span className={`text-[var(--semi-color-text-0)] ${!collapsed ? 'mr-3' : ''}`}>
                                                    {item.icon && <item.icon size={18} />}
                                                </span>
                                                
                                                {!collapsed && (
                                                    <div className={`flex-1 flex items-center justify-between overflow-hidden ${isTransitioning ? 'opacity-0 w-0' : 'opacity-100 transition-all duration-200 delay-150'}`}>
                                                        <span className="truncate">{item.text}</span>
                                                        {item.subItems && item.subItems.length > 0 && (
                                                            <ChevronRight
                                                                size={14}
                                                                className={`transition-transform duration-200 flex-shrink-0 ${activeSubmenu === item.path ? 'rotate-90' : ''}`}
                                                            />
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            
                                            {/* 子菜单 */}
                                            {!collapsed && item.subItems && item.subItems.length > 0 && (
                                                <div
                                                    className={`
                                                        overflow-hidden transition-all duration-200 pl-8
                                                        ${activeSubmenu === item.path ? 'max-h-96' : 'max-h-0'}
                                                        ${isTransitioning ? 'opacity-0' : ''}
                                                    `}
                                                >
                                                    {item.subItems.map(subItem => (
                                                        <div
                                                            key={subItem.path}
                                                            className={`
                                                                py-1.5 px-2 cursor-pointer whitespace-nowrap overflow-hidden text-ellipsis
                                                                ${location.pathname === `/settings/${item.path}/${subItem.path}`
                                                                    ? 'text-[var(--semi-color-primary)]'
                                                                    : 'hover:text-[var(--semi-color-primary)]'}
                                                            `}
                                                            onClick={() => {
                                                                navigate(`/settings/${item.path}/${subItem.path}`);
                                                                if (windowWidth < 900) toggleCollapsed(true);
                                                            }}
                                                        >
                                                            {subItem.text}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </nav>
                    )}

                    {/* 底部信息 */}
                    {!collapsed && (
                        <div className={`p-3 border-t border-[var(--semi-color-border)] text-xs text-[var(--semi-color-text-2)] ${isTransitioning ? 'opacity-0' : 'opacity-100 transition-opacity duration-200 delay-200'}`}>
                            <div className="flex items-center mb-1 whitespace-nowrap">
                                <Info size={12} className="mr-1.5 flex-shrink-0" />
                                <span className="truncate">{t('Version')}: 1.0.0</span>
                            </div>
                            <div className="flex items-center mb-1 whitespace-nowrap">
                                <SquareArrowOutUpRight  size={12} className="mr-1.5 flex-shrink-0" />
                                <span className="truncate">{t('OfficialWebSite')}</span>
                            </div>
                        </div>
                    )}
                </div>
            </aside>

            {/* 主内容区 */}
            <main className="flex-1 flex flex-col">
                {/* Header */}
                <header className="h-16 flex items-center px-8 border-b border-[var(--semi-color-border)] bg-[var(--semi-color-bg-0)] justify-between">
                    <h1 className="text-2xl font-bold text-[var(--semi-color-text-0)]"></h1>
                    <button
                        onClick={() => navigate("/")}
                        className="p-2 rounded-full hover:bg-[var(--semi-color-fill-1)]"
                        aria-label="关闭"
                    >
                        <X size={22} />
                    </button>
                </header>
                {/* Content */}
                <section className={`flex-1 overflow-auto p-8 ${backgroundColor} ${textColor}`} ref={scrollWrapperRef}>
                    <PageTitle title={currentRoute?.description || t('Page Not Found')} scrollContainer={scrollWrapperRef} />
                    <div className="mt-6">
                        {currentRoute ? (
                            <SettingsSlot component={currentRoute.component} backgroundColor={backgroundColor} textColor={textColor} />
                        ) : (
                            <ErrorPage
                                code={404}
                                title={t('Page Not Found')}
                                description={t('The page you are looking for does not exist.')}
                                homeUrl={"/settings/home"}
                            />
                        )}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default SettingsLayout;
