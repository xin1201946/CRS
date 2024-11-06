
import "./header.css"
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Button, SideSheet, Col, Row, Space} from '@douyinfe/semi-ui';
import {Settings} from "../Page/Settings.jsx";
import {FooterPage} from "../Footer/Footer.jsx";
import {getSettings} from "../code/Settings.js";
import {MdHdrAuto, MdNightlight, MdOutlineDarkMode, MdOutlineLightMode} from "react-icons/md";
import {IoMdSettings} from "react-icons/io";
import {getSetTheme, setAutoTheme, setDarkTheme, setLightTheme} from "../code/theme_color.js";


export function Header1 (){
    const [settingP_visible, set_settingP_Visible] = useState(false);
    const [settingThemeIcon, set_ThemeIcon] = useState(getSettings('theme_color')==='auto'?<MdHdrAuto />:getSettings('theme_color')==='light'?<MdOutlineLightMode />:<MdNightlight/>);
    const s_side_sheet_change = () => {
        set_settingP_Visible(!settingP_visible);
    };
    function switchDarkMode() {
        if (getSetTheme() === 'dark') {
            setAutoTheme(); // 确保调用函数
            set_ThemeIcon(<MdHdrAuto />);
        } else if (getSetTheme() === 'light') {
            setDarkTheme(); // 确保调用函数
            set_ThemeIcon(<MdOutlineDarkMode />);
        } else if (getSetTheme() === 'auto') {
            setLightTheme(); // 确保调用函数
            set_ThemeIcon(<MdOutlineLightMode />);
        }
    }
    return(
        <>
            <div style={{ fontFamily:"var(--Default-font)"}} className="grid">
                <div style={{float: 'left', marginLeft: '10px'}}>
                    <h1 id={"header_h1"}>铸造识别系统</h1>
                </div>
                <Row type="flex" justify="end">
                    <Col>
                        <Space align={'center'}>
                            <Button style={{margin: "10px"}} theme='borderless' icon={settingThemeIcon} onClick={switchDarkMode}
                                    aria-label="切换颜色"/>
                            <Button style={{margin: "10px"}} theme='borderless' icon={<IoMdSettings style={{width:'20px',height:'20px'}} />}
                                    onClick={s_side_sheet_change} aria-label="设置"/>
                        </Space>
                    </Col>
                </Row>
            </div>
            <SideSheet closeOnEsc={true}  style={{ maxWidth:"100%",fontFamily:"var(--Default-font)"}} title="设置" visible={settingP_visible} onCancel={s_side_sheet_change} footer={<FooterPage></FooterPage>}>
                <Settings></Settings>
            </SideSheet>
        </>
    )
}