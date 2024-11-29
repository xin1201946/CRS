import checkNetwork from '../../code/NetWorkConnect.js'
import {Banner, Button, SideSheet} from "@douyinfe/semi-ui";
import {useEffect, useState} from "react";
import {FooterPage} from "../../Footer/Footer.jsx";
import BaseSPage from "../settings_page/BaseS.jsx";
import './resultpage_css.css'
import {Step1} from "./Step1.jsx";
import {getServer} from "../../code/get_server.js";
import {AdvancedSettingsPage} from "../settings_page/AdvancedSettings.jsx";
import {HomePage} from "./HomePage.jsx";
import {Console} from "./console.jsx"
import {on,off} from "../../code/PageEventEmitter.js";

export function ResultPage(){
    const [settingP_visible, set_settingP_Visible] = useState(false);
    const s_side_sheet_change = () => {
        set_settingP_Visible(!settingP_visible);
    };
    const [settingadv_visible, set_settingadv_Visible] = useState(false);
    const adv_side_sheet_change = () => {
        set_settingadv_Visible(!settingadv_visible);
    };
    const [page, setPage] = useState('home');
    function MyComponent() {
    const [networkCheckResult, setNetworkCheckResult] = useState([null, null, null]);

    useEffect(() => {
       checkNetworks().then(result => {
           setNetworkCheckResult(result);
       });
    }, []); // 空依赖数组表示这个 effect 只在组件挂载时运行一次
    useEffect(() => {
            const handleChangePage = (newPage) => {
                setPage(newPage);
            };

            on('changePage', handleChangePage);

            return () => {
                off('changePage', handleChangePage);
            };

    }, []);
    return (
       <div>
           {showBanner(networkCheckResult)}
       </div>
       );
    }

    function checkNetworks() {
       let message, type, children, result1;
       return new Promise((resolve) => {
           checkNetwork(getServer()).then(result => {
               result1 = result;
               if (result1) {
                   message = '服务器连通成功。';
                   type = 'info';

                   children = "";
               } else {
                   message = '服务器连通失败,请检查服务器IP是否发生变动或者检查高级设置的HTTPS设置以及API设置。';
                   type = 'danger';
                   children = <>
                       {/* eslint-disable-next-line no-self-assign */}
                       <Button onClick={function(){window.location.href = window.location.href}}>刷新</Button>
                       <Button style={{marginLeft:'5px'}} className="semi-button semi-button-warning" onClick={s_side_sheet_change} type="button">服务器IP</Button>
                       <Button style={{marginLeft:'5px'}} className="semi-button semi-button-warning" onClick={adv_side_sheet_change} type="button">HTTPS设置和API设置</Button>
                       </>;
               }
               resolve([message, type, children]);
           });
       });
    }

    function showBanner(list) {
       return (
           <Banner
               fullMode={false}
               icon={null}
               style={{ fontFamily:"var(--Default-font)"}}
               type={list[1]}
               description={list[0]}>
               {list[2]}
           </Banner>
       );
    }
    return (
        <>
            <div style={{margin:'2%'}} >
                {MyComponent()}
                <div  id={'container'}>
                    <div id={'returnpage'} style={{height:'100%'}}>
                        {page==='home'?<HomePage />:page==='console'?<Console/>:<Step1/>}
                    </div>
                </div>
                <SideSheet closeOnEsc={true} style={{ maxWidth:"100%",fontFamily:"var(--Default-font)"}} title="高级设置" visible={settingadv_visible} onCancel={adv_side_sheet_change}
                           footer={<FooterPage></FooterPage>}>
                    <AdvancedSettingsPage></AdvancedSettingsPage>
                </SideSheet>
                <SideSheet closeOnEsc={true} style={{ maxWidth:"100%",fontFamily:"var(--Default-font)"}} title="基本设置" visible={settingP_visible} onCancel={s_side_sheet_change}
                           footer={<FooterPage></FooterPage>}>
                    <BaseSPage></BaseSPage>
                </SideSheet>
            </div>
        </>
    )
}