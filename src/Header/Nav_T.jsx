
import "./header.css"
// eslint-disable-next-line no-unused-vars
import React, {useEffect, useState} from 'react';
import {Button, Nav, SideSheet} from '@douyinfe/semi-ui';
import {
    IconCode,
    IconHome, IconMailStroked1,
    IconScan, IconSidebar,
    IconTerminal
} from "@douyinfe/semi-icons";
import {emit} from "../code/PageEventEmitter.js";
import {on,off} from "../code/PageEventEmitter.js";
import { useTranslation } from 'react-i18next';
import NotifyCenter from "../Page/NotifyCenter.jsx";
import {getSettings} from "../code/Settings.js";
import {detectDevice} from "../code/check_platform.js";
import {FooterPage} from "../Footer/Footer.jsx";
import {Settings} from "../Page/Settings.jsx";

export function Nav_T (){
    const [collapsed, setCollapsed] = useState(false);

    const toggleCollapse = () => {
        setCollapsed(!collapsed);
    };
    const { t } = useTranslation();
    const [selectKey,setSelectKey]=useState('home');
    const [NotifyCenter_visible, set_NotifyCenter_visible] = useState(false);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [selectItem, setselectItem] = useState(1);
    const [settingP_visible, set_settingP_Visible] = useState(false);
    const s_side_sheet_change = () => {
        set_settingP_Visible(!settingP_visible);
    };
    const NotifyCenter_change = () => {
        set_NotifyCenter_visible(!NotifyCenter_visible);
    };
    function changeSelectKey(key){
        console.log(key);
        // 根据 key.itemKey 的值执行不同操作
        if (key.itemKey!== 'message' && key.itemKey!== 'settings') {
            let selectItemIndex;
            console.log(true,1)
            // 根据不同的 key.itemKey 值设置选中项索引
            if (key.itemKey === 'home') {
                selectItemIndex = 1;
            }else if (key.itemKey === 'vision') {
                selectItemIndex = 2;
            }else if(key.itemKey==="console"){
                selectItemIndex=3;
            } else{
                selectItemIndex = 4;
            }
            // 设置选中项索引
            setselectItem(selectItemIndex);
            // 设置选中的键
            setSelectKey(key.itemKey);
            // 触发 changePage 事件
            emit('changePage', key.itemKey);
        } else if (key.itemKey === 'settings') {
            console.log(true,2)
            // 调用 s_side_sheet_change 函数
            s_side_sheet_change();
        } else {

            // 调用 NotifyCenter_change 函数
            NotifyCenter_change();
        }
    }
    function getItem(){
        const items=[
            {itemKey: 'home', text: t('Home'), icon: <IconHome />},
            {itemKey: 'vision', text: t('Vision'), icon:<IconScan />},
            {itemKey: 'console', text: t('Console'), icon:<IconTerminal />},
            {itemKey: 'message', text: t('NotifyCenter'), icon:<IconMailStroked1 />},
        ]
        if ('true'===getSettings('use_ai_page')){
            items.push({itemKey: 'ai', text: t('AI'), icon:<IconCode />})
        }
        return items;
    }
    useEffect(() => {
        const handleChangePage = (newPage) => {
            setSelectKey(newPage);
        };

        on('changePage', handleChangePage);
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // 监听窗口大小变化事件
        window.addEventListener('resize', handleResize);

        return () => {
            off('changePage', handleChangePage);
            window.removeEventListener('resize', handleResize);
        };

    }, []);

    function PCNav(){
        return<>
            <Nav
                isCollapsed={detectDevice()==='PC' && windowWidth >= 1000?collapsed:true}
                style={{height:"100%"}}
                selectedKeys={selectKey}
                mode={'vertical'}
                items={getItem()}
                onSelect={key => changeSelectKey(key)}
                header={{
                    text: 'CCRS'
                }}
                footer={{
                    children: (
                        <>
                            {
                                detectDevice()==='PC' && windowWidth >= 1000? <Button
                                    icon={collapsed ?<IconSidebar style={{ color: '--semi-color-tertiary-active' }} /> : <IconSidebar style={{ color: '--semi-color-text-0' }} />}
                                    onClick={toggleCollapse}
                                    theme="borderless"
                                >
                                    {collapsed ? null : t('Close navigation')}
                                </Button> : null
                            }
                        </>
                    ),
                }}
            />
        </>
    }
    function PhoneNav(){
        return (
            <>
                <div className="dock dock-md">
                    <button className={selectItem===1?'dock-active':''} onClick={()=>{changeSelectKey({itemKey:'home'})}}>
                        <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                                <path d="M18.5 24h-13A5.507 5.507 0 0 1 0 18.5V9.886c0-1.83.906-3.534 2.424-4.559l6.5-4.386a5.473 5.473 0 0 1 6.153 0l6.499 4.386A5.493 5.493 0 0 1 24 9.886V18.5c0 3.032-2.468 5.5-5.5 5.5ZM12 2.997c-.486 0-.974.144-1.397.431L4.102 7.813A2.5 2.5 0 0 0 3 9.885v8.614c0 1.379 1.121 2.5 2.5 2.5h13c1.379 0 2.5-1.121 2.5-2.5V9.886c0-.832-.412-1.606-1.102-2.072l-6.5-4.386A2.496 2.496 0 0 0 12 2.997Z" />
                            </g>
                        </svg>
                        <span className="dock-label">Home</span>
                    </button>

                    <button className={selectItem===2?'dock-active':''} onClick={()=>{changeSelectKey({itemKey:'vision'})}}>
                        <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <path d="M24 11.5a1.5 1.5 0 0 1-1.5 1.5h-21a1.5 1.5 0 1 1 0-3h21a1.5 1.5 0 0 1 1.5 1.5ZM1.5 8A1.5 1.5 0 0 0 3 6.5v-1C3 4.122 4.122 3 5.5 3h1a1.5 1.5 0 1 0 0-3h-1A5.506 5.506 0 0 0 0 5.5v1A1.5 1.5 0 0 0 1.5 8Zm5 13h-1A2.503 2.503 0 0 1 3 18.5v-1a1.5 1.5 0 1 0-3 0v1C0 21.533 2.467 24 5.5 24h1a1.5 1.5 0 1 0 0-3Zm16-5a1.5 1.5 0 0 0-1.5 1.5v1c0 1.378-1.122 2.5-2.5 2.5h-1a1.5 1.5 0 1 0 0 3h1c3.033 0 5.5-2.467 5.5-5.5v-1a1.5 1.5 0 0 0-1.5-1.5Zm-4-16h-1a1.5 1.5 0 1 0 0 3h1C19.878 3 21 4.122 21 5.5v1a1.5 1.5 0 1 0 3 0v-1C24 2.467 21.533 0 18.5 0Z" />
                        </svg>
                        <span className="dock-label">Recognition</span>
                    </button>

                    <button className={selectItem===3?'dock-active':''} onClick={()=>{changeSelectKey({itemKey:'console'})}}>
                        <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                                <path d="M19.5 15H17V9h2.5C21.981 9 24 6.981 24 4.5S21.981 0 19.5 0 15 2.019 15 4.5V7H9V4.5C9 2.019 6.981 0 4.5 0S0 2.019 0 4.5 2.019 9 4.5 9H7v6H4.5C2.019 15 0 17.019 0 19.5S2.019 24 4.5 24 9 21.981 9 19.5V17h6v2.5c0 2.481 2.019 4.5 4.5 4.5s4.5-2.019 4.5-4.5-2.019-4.5-4.5-4.5ZM17 4.5C17 3.122 18.121 2 19.5 2S22 3.122 22 4.5 20.879 7 19.5 7H17V4.5ZM4.5 7C3.121 7 2 5.878 2 4.5S3.121 2 4.5 2 7 3.122 7 4.5V7H4.5ZM7 19.5C7 20.878 5.879 22 4.5 22S2 20.878 2 19.5 3.121 17 4.5 17H7v2.5ZM9 15V9h6v6H9Zm10.5 7a2.503 2.503 0 0 1-2.5-2.5V17h2.5c1.379 0 2.5 1.122 2.5 2.5S20.879 22 19.5 22Z" />
                            </g>
                        </svg>
                        <span className="dock-label">Console</span>
                    </button>


                    <button className={selectItem===4?'dock-active':''} onClick={()=>{changeSelectKey({itemKey:'settings'})}}>
                        <svg className="size-[1.2em]" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                            <g fill="currentColor" stroke-linejoin="miter" stroke-linecap="butt">
                                <path d="M12 8a4 4 0 1 0 4 4 4 4 0 0 0-4-4Zm0 6a2 2 0 1 1 2-2 2 2 0 0 1-2 2Z" />

                                <path d="m21.294 13.9-.444-.256a9.1 9.1 0 0 0 0-3.29l.444-.256a3 3 0 1 0-3-5.2l-.445.257A8.977 8.977 0 0 0 15 3.513V3a3 3 0 0 0-6 0v.513a8.977 8.977 0 0 0-2.848 1.646L5.705 4.9a3 3 0 0 0-3 5.2l.444.256a9.1 9.1 0 0 0 0 3.29l-.444.256a3 3 0 1 0 3 5.2l.445-.257A8.977 8.977 0 0 0 9 20.487V21a3 3 0 0 0 6 0v-.513a8.977 8.977 0 0 0 2.848-1.646l.447.258a3 3 0 0 0 3-5.2Zm-2.548-3.776a7.048 7.048 0 0 1 0 3.75 1 1 0 0 0 .464 1.133l1.084.626a1 1 0 0 1-1 1.733l-1.086-.628a1 1 0 0 0-1.215.165 6.984 6.984 0 0 1-3.243 1.875 1 1 0 0 0-.751.969V21a1 1 0 0 1-2 0v-1.252a1 1 0 0 0-.751-.969A6.984 6.984 0 0 1 7.006 16.9a1 1 0 0 0-1.215-.165l-1.084.627a1 1 0 1 1-1-1.732l1.084-.626a1 1 0 0 0 .464-1.133 7.048 7.048 0 0 1 0-3.75 1 1 0 0 0-.465-1.129l-1.084-.626a1 1 0 0 1 1-1.733l1.086.628A1 1 0 0 0 7.006 7.1a6.984 6.984 0 0 1 3.243-1.875A1 1 0 0 0 11 4.252V3a1 1 0 0 1 2 0v1.252a1 1 0 0 0 .751.969A6.984 6.984 0 0 1 16.994 7.1a1 1 0 0 0 1.215.165l1.084-.627a1 1 0 1 1 1 1.732l-1.084.626a1 1 0 0 0-.463 1.129Z" />
                            </g>
                        </svg>
                        <span className="dock-label">Settings</span>
                    </button>
                </div>
                <SideSheet closeOnEsc={true} style={{maxWidth: "100%", fontFamily: "var(--Default-font)"}}
                           title={t('Settings')}
                           visible={settingP_visible} onCancel={s_side_sheet_change} footer={<FooterPage></FooterPage>}>
                    <Settings></Settings>
                </SideSheet>
            </>
        )
    }
    function returnNav(){
        if(detectDevice()==='PC'){
            return(PCNav())
        }else{
            return(PhoneNav())
        }
    }
    return (
        <>
            {returnNav()}
            <SideSheet closeOnEsc={true} placement='left' style={{maxWidth: "100%", fontFamily: "var(--Default-font)"}}
                       title={t('NotifyCenter')}
                       visible={NotifyCenter_visible} onCancel={NotifyCenter_change}>
                <NotifyCenter></NotifyCenter>
            </SideSheet>
        </>
    )
}