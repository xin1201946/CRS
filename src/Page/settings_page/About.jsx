
import {
    Card,
    Descriptions,
    Typography,
    Space,
    SideSheet,
    Popover
} from "@douyinfe/semi-ui";
import {getSettings} from "../../code/Settings.js";
import {useState} from "react";
import {Logs_Viewer} from "./Logs_Viewer.jsx"
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {IconChevronRight, IconFile, IconInfoCircle} from "@douyinfe/semi-icons";
import {getServer} from "../../code/get_server.js";
import {BetaFunctionalityPage} from "./BetaFunctionality.jsx";
import {useTranslation} from "react-i18next";


export  default  function AboutWE(){
    const { t } = useTranslation();
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
                        <Descriptions.Item itemKey={t('App_name')}>铸造字识别系统</Descriptions.Item>
                        <Descriptions.Item itemKey={t('Build_time')}>{getSettings('buile_time')}</Descriptions.Item>
                        <Descriptions.Item itemKey={t('Server_IP')}><Text link={{
                            href: getServer(),
                            target: '_blank'
                        }}>{getSettings('server_ip')}</Text></Descriptions.Item>
                        <Descriptions.Item itemKey={t('AI_Support')}>
                            <Space>
                                <Text>{getSettings('ai_support')}</Text>
                                <Popover
                                    content={
                                        <article>
                                            <Text>{t('Click to see more information about AI')}</Text>
                                        </article>
                                    }
                                    showArrow
                                    arrowPointAtCenter
                                    position={'top'}
                                >
                                    <IconInfoCircle onClick={()=>{window.open('https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0')}} style={{color: 'var(--semi-color-primary)'}}/>
                                </Popover>
                            </Space>
                        </Descriptions.Item>
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
                        title={t('Log_viewer')}
                        description={t('Log_viewer_text')}
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
                }} title={t('Log_viewer')} visible={logvisible} onCancel={logchange}>
                    <Logs_Viewer></Logs_Viewer>
                </SideSheet>
            </>
        );
    }

    return (
        <>
            <h2 style={{fontFamily: "var(--Default-font)"}}>{t('AppInfo')}</h2>
            {appInfo()}
        </>
    )
}