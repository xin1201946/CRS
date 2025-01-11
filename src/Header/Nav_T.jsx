
import "./header.css"
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Nav} from '@douyinfe/semi-ui';
import {IconHome, IconScan,  IconTerminal} from "@douyinfe/semi-icons";
import {emit} from "../code/PageEventEmitter.js";
import {on,off} from "../code/PageEventEmitter.js";
import { useTranslation } from 'react-i18next';
export function Nav_T (){
    const { t } = useTranslation();

    const [selectKey,setSelectKey]=useState('home');
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
    return(
        <>
            <Nav
                style={{height:"100%"}}
                selectedKeys={selectKey}
                mode={'vertical'}
                isCollapsed={true}
                items={[
                    {itemKey: 'home', text: t('Home'), icon: <IconHome />},
                    {itemKey: 'vision', text: t('Vision'), icon:<IconScan />},
                    {itemKey: 'console', text: t('Console'), icon:<IconTerminal />},
                ]}
                onSelect={key => changeSelectKey(key)}
                header={{
                    text: 'CCRS'
                }}
            />
        </>
    )
}