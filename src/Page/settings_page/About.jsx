// eslint-disable-next-line no-unused-vars
import {Avatar, Card, Descriptions, Toast, Typography, Space, Button, SideSheet} from "@douyinfe/semi-ui";
// import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {getSettings} from "../../code/Settings.js";
import {useState} from "react";
import {UpdateLog} from "./UpdateLog.jsx"
import {Logs_Viewer} from "./Logs_Viewer.jsx"
import {check_browser} from "../../code/browserCheck.js"
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {IconChevronRight, IconCloud, IconFile} from "@douyinfe/semi-icons";
import {getServer} from "../../code/get_server.js";
import {BetaFunctionalityPage} from "./BetaFunctionality.jsx";


export  default  function AboutWE(){
    const { Text } = Typography;
    const [upvisible, setupVisible] = useState(false);
    const [logvisible, setlogVisible] = useState(false);
    const [beta, setbeta] = useState(0);
    const [betavisible, setbetaVisible] = useState('hidden');
    const [betaPagevisible, setbetaPageVisible] = useState(false);
    const clickbeta = ()=>{
        if (beta >= 8){
            setbetaVisible('visible');
            setbeta(0)
        }else{
            setbeta(beta + 1);
        }

    }
    const betaPchange=()=>{
        setbetaPageVisible(!betaPagevisible)
    }
    const upchange = () => {
        setupVisible(!upvisible);
    };
    const logchange = () => {
        setlogVisible(!logvisible);
    };
    // function person(name,description){
    //     return(
    //         <>
    //             <Card
    //                 style={{ maxWidth: 360 }}
    //                 bodyStyle={{
    //                     display: 'flex',
    //                     alignItems: 'center',
    //                     justifyContent: 'space-between'
    //                 }}
    //             >
    //                 <Meta
    //                     title={name}
    //                     description={description}
    //                     avatar={
    //                         <Avatar size="default" style={{ color: '#f56a00', backgroundColor: '#fde3cf', margin: 4 }} alt='User'>
    //                             {name.substring(0, 1)}
    //                         </Avatar>
    //                     }
    //                 />
    //             </Card>
    //             <br/>
    //         </>
    //
    //     )
    // }

    function appInfo(){
        return (
            <>
                <Card onClick={clickbeta}>
                    <Descriptions align="left">
                        <Descriptions.Item itemKey="应用名称">铸造字识别系统</Descriptions.Item>
                        <Descriptions.Item itemKey="构建日期">{getSettings('buile_time')}</Descriptions.Item>
                        <Descriptions.Item itemKey="服务器地址"><Text link={{
                            href: getServer(),
                            target: '_blank'
                        }}>{getSettings('server_ip')}</Text></Descriptions.Item>
                    </Descriptions>
                </Card>
                <br/>
                <Card
                    onClick={logchange}
                    shadows='hover'
                    style={{cursor: "pointer"}}
                    bodyStyle={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Meta
                        avatar={
                            <IconFile style={{color: 'var(--semi-color-primary)'}}/>
                        }
                        title="日志查看器"
                        description={"查看前端所有的日志信息"}
                    />
                    <IconChevronRight style={{color: 'var(--semi-color-primary)'}}/>
                </Card>
                <br/>
                <Card
                    onClick={upchange}
                    shadows='hover'
                    style={{cursor: "pointer"}}
                    bodyStyle={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Meta
                        avatar={
                            <IconCloud style={{color: 'var(--semi-color-primary)'}}/>
                        }
                        title="更新日志"
                        description={"查看当前和往期版本更新信息"}
                    />
                    <IconChevronRight style={{color: 'var(--semi-color-primary)'}}/>
                </Card>
                <br/>
                <Card
                    onClick={betaPchange}
                    shadows='hover'
                    style={{cursor: "pointer",visibility:betavisible}}
                    bodyStyle={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                    }}
                >
                    <Meta
                        title="BetaFunctionality"
                    />
                    <IconChevronRight style={{color: 'var(--semi-color-primary)'}}/>
                </Card>

                <SideSheet style={{maxWidth: "100%"}} title="更新日志" visible={upvisible} onCancel={upchange}
                           footer={<p>{check_browser()} | Software Build
                               Time: {getSettings('buile_time').toString().slice(0, 10)}</p>}>
                    <UpdateLog></UpdateLog>
                </SideSheet>
                <SideSheet style={{maxWidth: "100%"}} title="BetaFunc" visible={betaPagevisible} onCancel={betaPchange}>
                    <BetaFunctionalityPage></BetaFunctionalityPage>
                </SideSheet>
                <SideSheet  style={{
                    width: '100%'
                }} title="事件查看器" visible={logvisible} onCancel={logchange}>
                    <Logs_Viewer></Logs_Viewer>
                </SideSheet>
            </>
        );
    }

    return (
        <>
            {/*<h2>团队成员</h2>*/}
            {/*{person('董清鑫 | Canfeng',"HTML | JavaScript | CSS | UI Design")}*/}
            {/*{person('张来康'," 演讲 | UI Design")}*/}
            <h2 style={{fontFamily: "var(--Default-font)"}}>应用信息</h2>
            {appInfo()}
        </>
    )
}