
import "./header.css"
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Button, SideSheet, Space,  Nav} from '@douyinfe/semi-ui';
import {Settings} from "../Page/Settings.jsx";
import {FooterPage} from "../Footer/Footer.jsx";
import {MdHdrAuto, MdOutlineDarkMode, MdOutlineLightMode} from "react-icons/md";
import {getSetTheme,  setAutoTheme, setDarkTheme, setLightTheme} from "../code/theme_color.js";
import {IconHome, IconScan, IconSetting} from "@douyinfe/semi-icons";
import {emit} from "../code/PageEventEmitter.js";
import {on,off} from "../code/PageEventEmitter.js";
import {detectDevice} from "../code/check_platform.js";
export function Header1 (){
    const set_icon=()=>{
        if (getSetTheme() === 'light'){
            return <MdOutlineLightMode style={{width:'20px',height:'20px'}} />
        } else if(getSetTheme() === 'dark'){
            return <MdOutlineDarkMode style={{width:'20px',height:'20px'}} />
        }else{
            return <MdHdrAuto style={{width:'20px',height:'20px'}} />
        }
    }
    const [selectKey,setSelectKey]=useState('home');
    const [settingP_visible, set_settingP_Visible] = useState(false);
    const [settingThemeIcon, set_ThemeIcon] = useState(set_icon());
    const s_side_sheet_change = () => {
        set_settingP_Visible(!settingP_visible);
    };
    function changeSelectKey(key){
        setSelectKey(key.itemKey)
        emit('changePage', key.itemKey)
    }
    useEffect(() => {
        const handleChangePage = (newPage) => {
            setSelectKey(newPage);
        };

        on('changePage', handleChangePage);

        return () => {
            off('changePage', handleChangePage);
        };

    }, []);
    function switchDarkMode() {
        if (getSetTheme() === 'dark') {
            setAutoTheme(); // 确保调用函数
            const body = document.body;
            if (!body.hasAttribute('theme-mode')){
                set_ThemeIcon(<MdHdrAuto style={{width:'20px',height:'20px'}} />);
            }else{
                set_ThemeIcon(<MdHdrAuto style={{width:'20px',height:'20px'}} />);
            }
        } else if (getSetTheme() === 'light') {
            setDarkTheme(); // 确保调用函数
            set_ThemeIcon(<MdOutlineDarkMode style={{width:'20px',height:'20px'}}/>);
        } else if (getSetTheme() === 'auto') {
            setLightTheme(); // 确保调用函数
            set_ThemeIcon(<MdOutlineLightMode style={{width:'20px',height:'20px'}}/>);
        }
    }
    return(
        <>
            <div className={'index-module_container__x1Eix'} style={{width: '100%',top:'0',zIndex:'1',height:'5%',backdropFilter:" blur(5px)",
                backgroundColor:" rgba(112,110,109,0)"}}>
                <Nav
                    selectedKeys={selectKey}
                    mode={'horizontal'}
                    items={[
                        {itemKey: 'home', text: '主页', icon: <IconHome />},
                        {itemKey: 'vision', text: '识别系统', icon:<IconScan />},
                    ]}
                    onSelect={key => changeSelectKey(key)}
                    header={{
                        text: 'CCRS'
                    }}
                    footer={
                        <>
                            <Space>
                                <Button style={{margin: "10px"}} theme='borderless' icon={settingThemeIcon} onClick={switchDarkMode}
                                                       aria-label="切换颜色"/>
                                <Button onClick={s_side_sheet_change} style={{color:'var(--semi-color-text-0)',display: detectDevice()==='Phone'?"none":''}} theme='borderless'>
                                    <IconSetting/>
                                </Button>
                            </Space>
                        </>
                    }
                />
            </div>
            <SideSheet closeOnEsc={true} style={{maxWidth: "100%", fontFamily: "var(--Default-font)"}} title="设置"
                       visible={settingP_visible} onCancel={s_side_sheet_change} footer={<FooterPage></FooterPage>}>
                <Settings></Settings>
            </SideSheet>
        </>
    )
}