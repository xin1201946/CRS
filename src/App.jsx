import './App.css';
import initializeSettings from './code/QuickLoadingService.js';
import {lazy, useEffect} from 'react';
import {getSettings} from './code/Settings.js';
import {queck_change_theme, setAutoTheme} from './code/theme_color.js';
import {add_log} from './code/log.js';
import register from './code/registerServiceWorker.js';
import {Layout} from '@douyinfe/semi-ui';
import Sider from '@douyinfe/semi-ui/lib/es/layout/Sider.js';
import {ContextMenuProvider, useContextMenu} from "./contexts/ContextMenuContext.jsx";
import {detectDevice} from "./code/check_platform.js";
import {log} from "./Theme/prettyLog.jsx";

const Header1 = lazy(() => import("./Header/Header.jsx"))
const HomePage = lazy(() => import("./Page/Home.jsx"))
const Nav_T = lazy(() => import("./Header/Nav_T.jsx"))
const CustomContextMenu = lazy(() => import("./Page/RightClickMenu.jsx"))
function AppContent() {
    const { Header, Content } = Layout;
    const { showContextMenu } = useContextMenu();

    useEffect(() => {
        add_log('Hook Theme...', 'successfully', 'UI Loading(3/3)...');
        let theme_color = getSettings('theme_color');
        if (theme_color === 'auto') {
            setAutoTheme();
        } else {
            queck_change_theme(theme_color);
        }
    }, []);

    const handleContextMenu = (event) => {
        if (getSettings('use_app_content_menu') === 'true' && detectDevice()==='PC') {
            showContextMenu(event);
        }
    };

    return (
        <Layout
            // onContextMenu={'true'===getSettings('use_app_content_menu')?(event) => {
            //     event.preventDefault();
            // }:null}
            onContextMenu={handleContextMenu}
            style={{ border: '1px solid var(--semi-color-border)' }}
        >
            <Header>
                <Header1 />
            </Header>
            <Sider>
                <Nav_T />
            </Sider>
            <Layout style={{ height: '100%', paddingTop: '68px'}}>
                <Content>
                    <HomePage />
                    <CustomContextMenu />
                </Content>
            </Layout>
        </Layout>
    );
}

function App() {
    // 注册服务和日志
    register();
    add_log('UI Loading...', 'successfully', 'UI Loading(1/3)...');
    add_log('Check Settings...', 'successfully', 'UI Loading(2/3)...');
    initializeSettings();
    log.title("Here is CCRS")
    add_log('UI was Start...', 'successfully', 'Start successfully');

    return (
        <ContextMenuProvider>
            <AppContent />
        </ContextMenuProvider>
    );
}

export default App;