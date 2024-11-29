// eslint-disable-next-line no-unused-vars
import {Avatar, Card, Descriptions, Toast, Typography, Space, Button, SideSheet} from "@douyinfe/semi-ui";
// import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {getSettings} from "../../code/Settings.js";
import {useState} from "react";
import {Logs_Viewer} from "./Logs_Viewer.jsx"
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {IconChevronRight, IconFile} from "@douyinfe/semi-icons";
import {getServer} from "../../code/get_server.js";
import {BetaFunctionalityPage} from "./BetaFunctionality.jsx";


export  default  function AboutWE(){
    const { Text } = Typography;
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
    const logchange = () => {
        setlogVisible(!logvisible);
    };
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
            <h2 style={{fontFamily: "var(--Default-font)"}}>应用信息</h2>
            {appInfo()}
        </>
    )
}