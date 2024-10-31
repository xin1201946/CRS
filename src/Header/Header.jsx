
import "./header.css"
// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import {Button, SideSheet, Col, Row, Space, Toast} from '@douyinfe/semi-ui';
import {IconSetting,IconMoon} from '@douyinfe/semi-icons';
import {Settings} from "../Page/Settings.jsx";
import {FooterPage} from "../Footer/Footer.jsx";


export function Header1 (){
    const [settingP_visible, set_settingP_Visible] = useState(false);
    const s_side_sheet_change = () => {
        set_settingP_Visible(!settingP_visible);
    };
    const switchDarkMode = () => {
        const body = document.body;
        if (body.hasAttribute('theme-mode')) {
            body.removeAttribute('theme-mode');
        } else {
            body.setAttribute('theme-mode', 'dark');
        }
    };
    return(
        <>
            <div style={{ fontFamily:"var(--Default-font)"}} className="grid">
                <div style={{float: 'left', marginLeft: '10px'}}>
                    <h1 id={"header_h1"}>铸造识别系统</h1>
                </div>
                <Row type="flex" justify="end">
                    <Col>
                        <Space align={'center'}>
                            <Button style={{margin: "10px"}} theme='borderless' icon={<IconMoon/>} onClick={switchDarkMode}
                                    aria-label="切换颜色"/>
                            <Button style={{margin: "10px"}} theme='borderless' icon={<IconSetting/>}
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