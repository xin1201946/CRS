// eslint-disable-next-line no-unused-vars
import {Avatar, Card, Descriptions, Toast, Typography, Space, Button, SideSheet} from "@douyinfe/semi-ui";
// import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {getSettings} from "../../code/Settings.js";
import {useState} from "react";
import {UpdateLog} from "./UpdateLog.jsx"
import {Logs_Viewer} from "./Logs_Viewer.jsx"
import {check_browser} from "../../code/browserCheck.js"
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {IconChevronRight} from "@douyinfe/semi-icons";
import {getServer} from "../../code/get_server.js";


export  default  function AboutWE(){
    const { Text } = Typography;
    const [upvisible, setupVisible] = useState(false);
    const [logvisible, setlogVisible] = useState(false);
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
                <Card>
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
                        title="日志查看器"
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
                        title="更新日志"
                    />
                    <IconChevronRight style={{color: 'var(--semi-color-primary)'}}/>
                </Card>


                <SideSheet style={{maxWidth: "100%"}} title="更新日志" visible={upvisible} onCancel={upchange}
                           footer={<p>{check_browser()} | Software Build
                               Time: {getSettings('buile_time').toString().slice(0, 10)}</p>}>
                    <UpdateLog></UpdateLog>
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