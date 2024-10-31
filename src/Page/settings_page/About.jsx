// eslint-disable-next-line no-unused-vars
import {Avatar, Card, Descriptions, Toast, Typography, Space, Button, SideSheet} from "@douyinfe/semi-ui";
// import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import { Lottie } from '@douyinfe/semi-ui';
import {isHalloweenPeriod} from '../../code/is_wsj.js'
import {getSettings,setSettings} from "../../code/Settings.js";
import React, {useState} from "react";
import {UpdateLog} from "./UpdateLog.jsx"
import {check_browser} from "../../code/browserCheck.js"
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {IconInfoCircle} from "@douyinfe/semi-icons";
export  default  function AboutWE(){
    const { Text } = Typography;
    const [visible, setVisible] = useState(false);
    const change = () => {
        setVisible(!visible);
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
    const [clickCount, setClickCount] = useState(0);  // 点击次数
    const [jsonURL, setjsonURL] = useState('');
    const handleClick = () => {
        setClickCount(clickCount + 1);  // 增加点击次数
        if (clickCount === 5 && isHalloweenPeriod() ) {  // 判断是否点击了10次
          setSettingss();  // 调用setSettings函数
          setClickCount(0);  // 重置点击次数
        }
    };

    const setSettingss = () => {
        let opts = {
        content: (
            <Space>
                <Text style={{ fontFamily:"var(--Default-font)"}}>万圣节快乐🎃</Text>
                <Button theme={'borderless'} onClick={function(){setSettings('is_wsj','true');location.reload()}}> 加载主题 </Button>
            </Space>
        ),
        duration: 3,
        stack: true,
        };
        Toast.info(opts)
    };

    React.useEffect(() => {
    const isHalloween = isHalloweenPeriod();
    setjsonURL(isHalloween && getSettings('is_wsj')==='true' ? 'https://lottie.host/48eb12ed-79f0-4f7f-a940-5eb6416d14ec/kQrzuHP1Ue.json' : '');
    }, []);
    function appInfo(){
        return (
            <>
            <Lottie params={{ path: jsonURL }} width={'auto'}  height={'200'} />
            <Card  onClick={handleClick}>
                <Descriptions  align="left" >
                <Descriptions.Item itemKey="应用名称">铸造字识别系统</Descriptions.Item>
                <Descriptions.Item itemKey="构建日期">{getSettings('buile_time')}</Descriptions.Item>
                <Descriptions.Item itemKey="服务器地址"><Text link={{href:"http://"+getSettings('server_ip'),target:'_blank'}}>{getSettings('server_ip')}</Text></Descriptions.Item>
                </Descriptions>
            </Card>
                <br/>
            <Card
                onClick={change}
                shadows='hover'
                style={{cursor:"pointer"}}
                bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}
            >
                <Meta
                    title="更新日志"
                />
                <IconInfoCircle style={{ color: 'var(--semi-color-primary)' }}/>
            </Card>
                <SideSheet style={{maxWidth:"100%"}} title="更新日志" visible={visible} onCancel={change} footer={<p>{check_browser()} | Software Build Time: {getSettings('buile_time').toString().slice(0,10)}</p>}>
                <UpdateLog></UpdateLog>
            </SideSheet>
            </>
        );
    }
    return (
        <>
            {/*<h2>团队成员</h2>*/}
            {/*{person('董清鑫 | Canfeng',"HTML | JavaScript | CSS | UI Design")}*/}
            {/*{person('张来康'," 演讲 | UI Design")}*/}
            <h2 style={{ fontFamily:"var(--Default-font)"}}>应用信息</h2>
            {appInfo()}
        </>
    )
}