import checkNetwork from '../../code/NetWorkConnect.js'
import {Banner, Button, SideSheet} from "@douyinfe/semi-ui";
import {getSettings} from "../../code/Settings.js";
import { Lottie } from '@douyinfe/semi-ui';
import {isHalloweenPeriod} from "../../code/is_wsj.js";
import React, {useEffect, useState} from "react";
import {FooterPage} from "../../Footer/Footer.jsx";
import BaseSPage from "../settings_page/BaseS.jsx";
import './resultpage_css.css'
import {Step1} from "./Step1.jsx";
export function ResultPage(){
    const [settingP_visible, set_settingP_Visible] = useState(false);
    const [HWvisible, setHWvisibleVisible] = useState('hidden');
    const [jsonURL,setjsonURL] = useState('');
    const s_side_sheet_change = () => {
        set_settingP_Visible(!settingP_visible);
    };

    React.useEffect(() => {
    const isHalloween = isHalloweenPeriod();
    if(isHalloween && (getSettings('is_wsj') ==='true')){
        setjsonURL('https://lottie.host/7ccaf0cf-d9b1-4bdd-b0ec-01a6ced432a8/1ISnQCB6IB.json' );
        setHWvisibleVisible("visible");
    }
    }, []);
    function addDH(){
        let height=0
        if (isHalloweenPeriod() && (getSettings('is_wsj') ==='true')){
            height="30%"
        }
        return(
            <Lottie params={{ path: jsonURL }} width={'100%'}  height={height} />
        )
    }
    function MyComponent() {
    const [networkCheckResult, setNetworkCheckResult] = useState([null, null, null]);

    useEffect(() => {
       checkNetworks().then(result => {
           setNetworkCheckResult(result);
       });
    }, []); // 空依赖数组表示这个 effect 只在组件挂载时运行一次

    return (
       <div>
           {showBanner(networkCheckResult)}
       </div>
       );
    }

    function checkNetworks() {
       let message, type, children, result1;
       return new Promise((resolve) => {
           checkNetwork(getSettings('server_ip')).then(result => {
               result1 = result;
               if (result1) {
                   message = '服务器连通成功。';
                   type = 'info';

                   children = "";
               } else {
                   message = '服务器连通失败,请检查服务器IP是否发生变动。';
                   type = 'danger';
                   children = <>
                       {/* eslint-disable-next-line no-self-assign */}
                       <Button onClick={function(){window.location.href = window.location.href}}>刷新</Button>
                       <Button style={{marginLeft:'5px'}} className="semi-button semi-button-warning" onClick={s_side_sheet_change} type="button">打开设置</Button>
                       </>;
               }
               resolve([message, type, children]);
           });
       });
    }

    function showBanner(list) {
       return (
           <Banner
               style={{ fontFamily:"var(--Default-font)"}}
               type={list[1]}
               description={list[0]}>
               {list[2]}
           </Banner>
       );
    }
    return (
        <>
            {MyComponent()}
            <br/>
            {addDH()}
            <p style={{visibility:HWvisible,fontSize:"30px",fontFamily:"HalloweenEN"}}>Happy Halloween 🎃</p>
            <div id={'container'}>
                <div id={'returnpage'}>
                    <Step1></Step1>
                </div>
            </div>

            <SideSheet closeOnEsc={true} style={{ maxWidth:"100%",fontFamily:"var(--Default-font)"}} title="基本设置" visible={settingP_visible} onCancel={s_side_sheet_change}
                       footer={<FooterPage></FooterPage>}>
                <BaseSPage></BaseSPage>
            </SideSheet>
        </>
    )
}