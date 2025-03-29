// 导入必要的依赖和组件
import {useTranslation} from "react-i18next";
import {Layout} from "@douyinfe/semi-ui";
import {lazy, useEffect} from "react";
import {add_log} from "./code/log.js";
import { setSettings} from "./code/Settings.js";
import { Outlet} from "react-router-dom";


// 懒加载主要组件
const Header1 = lazy(() => import("./Header/Header.jsx"))
const Nav_T = lazy(() => import("./Header/Nav_T.jsx"))
// 应用内容主组件
function AppContent() {

    const { t } = useTranslation();
    const { Header,Content,Sider} = Layout;

    useEffect(() => {
        add_log('Hook Theme...', 'successfully', 'UI Loading(3/3)...');
        setSettings('buile_time', document.querySelector('#build-time').content.toString(),true)

    }, [t]);


    return (
        <>
            <Layout style={{ border: '1px solid var(--semi-color-border)' }}>
                <Header>
                    <Header1 />
                </Header>
                <Sider>
                    <Nav_T />
                </Sider>
                <Content style={{height:"90%",marginTop:"55px"}}>
                    <Outlet />
                </Content>
            </Layout>


        </>
    );
}
export default  AppContent