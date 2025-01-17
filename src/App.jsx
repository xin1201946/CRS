import './App.css';
import initializeSettings from './code/QuickLoadingService.js';
import React, { useEffect, useState } from 'react';
import { Header1 } from './Header/Header.jsx';
import { HomePage } from './Page/Home.jsx';
import { getSettings } from './code/Settings.js';
import { setAutoTheme, queck_change_theme } from './code/theme_color.js';
import { add_log } from './code/log.js';
import register from './code/registerServiceWorker.js';
import { Layout } from '@douyinfe/semi-ui';
import Sider from '@douyinfe/semi-ui/lib/es/layout/Sider.js';
import { Nav_T } from './Header/Nav_T.jsx';
import CustomContextMenu from './Page/RightClickMenu.jsx';

function App() {
    const { Header, Content } = Layout;
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [menuVisible, setMenuVisible] = useState(false);

    // 监听右键菜单打开时的全局点击事件
    useEffect(() => {
        const handleClickOutside = (event) => {
            // 如果点击的位置不是菜单内，则关闭菜单
            if (!event.target.closest('.context-menu')) {
                setMenuVisible(false);
            }
        };

        if (menuVisible) {
            document.addEventListener('click', handleClickOutside);
        }

        // 清理事件监听器
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [menuVisible]);

    const handleContextMenu = (event) => {
        event.preventDefault(); // 阻止默认的右键菜单
        setMenuPosition({ x: event.clientX, y: event.clientY });
        setMenuVisible(true);
    };

    const handleCloseMenu = () => {
        setMenuVisible(false);
    };

    // 注册服务和日志
    register();
    add_log('UI Loading...', 'successfully', 'UI Loading(1/3)...');
    add_log('Check Settings...', 'successfully', 'UI Loading(2/3)...');
    initializeSettings();

    useEffect(() => {
        add_log('Hook Theme...', 'successfully', 'UI Loading(3/3)...');
        let theme_color = getSettings('theme_color');
        if (getSettings('theme_color') === 'auto') {
            setAutoTheme();
        } else {
            queck_change_theme(theme_color);
        }
    }, []);

    add_log('UI was Start...', 'successfully', 'Start successfully');

    return (
        <>
            <Layout
                onContextMenu={'true'===getSettings('use_app_content_menu')?(event) => {
                    event.preventDefault();
                }:null}
                style={{ border: '1px solid var(--semi-color-border)' }}
            >
                <Header
                    style={{
                        position: 'fixed',
                        width: '100%',
                        zIndex: 1,
                        backdropFilter: ' blur(5px)',
                        backgroundColor: 'rgba(255, 255, 255, 0)',
                    }}
                >
                    <Header1 />
                </Header>
                <Sider>
                    <Nav_T />
                </Sider>
                <Layout>
                    <Content
                        onContextMenu={'true'===getSettings('use_app_content_menu')?handleContextMenu:null}
                        style={{ height: '100%', marginTop: '60px' }}
                    >
                        <HomePage />
                    </Content>
                </Layout>
            </Layout>
            <CustomContextMenu
                className="context-menu" // 为右键菜单添加一个唯一的class
                x={menuPosition.x}
                y={menuPosition.y}
                visible={menuVisible}
                onClose={handleCloseMenu}
            />
        </>
    );
}

export default App;
