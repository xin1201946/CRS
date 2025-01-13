
import "./header.css"
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Button, IconButton, Nav, SideSheet, Space} from '@douyinfe/semi-ui';
import {
    IconClose,
    IconHome, IconMailStroked1,
    IconScan, IconSidebar,
    IconTerminal
} from "@douyinfe/semi-icons";
import {emit} from "../code/PageEventEmitter.js";
import {on,off} from "../code/PageEventEmitter.js";
import { useTranslation } from 'react-i18next';
import {FooterPage} from "../Footer/Footer.jsx";
import NotifyCenter from "../Page/NotifyCenter.jsx";
import {clear_notify} from "../code/SystemToast.jsx";

export function Nav_T (){
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };
    const { t } = useTranslation();
    const [selectKey,setSelectKey]=useState('home');
    const [NotifyCenter_visible, set_NotifyCenter_visible] = useState(false);
    const NotifyCenter_change = () => {
        set_NotifyCenter_visible(!NotifyCenter_visible);
    };
    function changeSelectKey(key){
        console.log(key);
        if (key.itemKey!=='message'){
            setSelectKey(key.itemKey)
            emit('changePage', key.itemKey)
        }else{
            NotifyCenter_change()
        }
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

    return(
        <>
            <Nav
                isCollapsed={collapsed}
                style={{height:"100%"}}
                selectedKeys={selectKey}
                mode={'vertical'}
                items={[
                    {itemKey: 'home', text: t('Home'), icon: <IconHome />},
                    {itemKey: 'vision', text: t('Vision'), icon:<IconScan />},
                    {itemKey: 'console', text: t('Console'), icon:<IconTerminal />},
                    {itemKey: 'message', text: t('NotifyCenter'), icon:<IconMailStroked1 />},
                ]}
                onSelect={key => changeSelectKey(key)}
                header={{
                    text: 'CCRS'
                }}
                footer={{
                    children: (
                        <>
                            <Button
                                icon={collapsed ?<IconSidebar style={{ color: '--semi-color-tertiary-active' }} /> : <IconSidebar style={{ color: '--semi-color-text-0' }} />}
                                onClick={toggleCollapse}
                                theme="borderless"
                            >
                                {collapsed ? '' : t('Close navigation')}
                            </Button>
                        </>
                    ),
                }}
            />
            <SideSheet closeOnEsc={true} placement='left' style={{maxWidth: "100%", fontFamily: "var(--Default-font)"}} title={t('NotifyCenter')}
                       visible={NotifyCenter_visible} onCancel={NotifyCenter_change} footer={<Space style={{width:'100%'}} align={'center'}><Button onClick={clear_notify} icon={<IconClose />}>{t('close_all_notify')}</Button></Space>}>
                <NotifyCenter></NotifyCenter>
            </SideSheet>
        </>
    )
}