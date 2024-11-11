import './App.css'
import initializeSettings from './code/QuickLoadingService.js'
// eslint-disable-next-line no-unused-vars
import React, { useEffect, useRef } from 'react';
import {Header1} from './Header/Header.jsx'
import {HomePage} from "./Page/Home.jsx";
import {getSettings} from "./code/Settings.js";
import {setAutoTheme, queck_change_theme} from "./code/theme_color.js";
import {add_log} from "./code/log.js";
import register from "./code/registerServiceWorker.js";
import { Layout } from '@douyinfe/semi-ui';
function App()
{
    const { Header, Footer, Content } = Layout;
    register();
    add_log('UI Loading...','successfully','UI Loading(1/3)...');
    add_log('Check Settings...','successfully','UI Loading(2/3)...');
    initializeSettings()
    React.useEffect(() => {
        add_log('Hook Theme...','successfully','UI Loading(3/3)...');
        let theme_color = getSettings("theme_color");
        if (getSettings("theme_color")==='auto'){
            setAutoTheme()
        }else{
            queck_change_theme(theme_color)
        }
   }, []);

    add_log('UI was Start...','successfully','Start successfully');
    return (
        <>
            <Layout className="components-layout-demo">
                <Header  style={{position:'fixed',width:'100%',zIndex:1}} ><Header1 ></Header1></Header>
                <Content  style={{marginTop:'60px'}}><HomePage></HomePage></Content>
            </Layout>
        </>
    );
}

export default App