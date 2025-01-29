
import {
    Card,
    Descriptions,
    Typography,
    Space,
    SideSheet,
    Popover, Modal, Table, Button, Banner
} from "@douyinfe/semi-ui";
import {getSettings} from "../../code/Settings.js";
import {useState} from "react";
import {Logs_Viewer} from "./Logs_Viewer.jsx"
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {IconChevronRight, IconFile, IconInfoCircle} from "@douyinfe/semi-icons";
import {getServer} from "../../code/get_server.js";
import {BetaFunctionalityPage} from "./BetaFunctionality.jsx";
import {useTranslation} from "react-i18next";
import Column from "@douyinfe/semi-ui/lib/es/table/Column.js";


export  default  function AboutWE(){
    const { t } = useTranslation();
    const { Text } = Typography;
    const [logvisible, setlogVisible] = useState(false);
    const [beta, setbeta] = useState(0);
    const [betavisible, setbetaVisible] = useState('hidden');
    const [betaPagevisible, setbetaPageVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const showDialog = () => {
        setVisible(true);
    };
    const handleOk = () => {
        setVisible(false);
    };
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

    const data = [
        {
            class: t('OS version'),
            value: 'Windows ≥ 10, MacOS ≥ 13(Ventura),Linux',
        },
        {
            class: t('Browser Support'),
            value: 'Chrome Canary | Chrome Dev',
        },
        {
            class: t('minChromeVersion'),
            value: '128.0.6545.0',
        },
        {
            class: t('Storage'),
            value: t('Tip_AI_require_Disk'),
        },
        {
            class: 'GPU',
            value: t('Tip_AI_require_GPU'),
        },
        {
            class: t('Video RAM'),
            value: t('Tip_AI_require_GPU_M'),
        },
        {
            class: t('Network connection'),
            value: t('Tip_AI_require_Network'),
        },
    ];


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
                                    <IconInfoCircle onClick={showDialog} style={{color: 'var(--semi-color-primary)'}}/>
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
            <Modal
                title={t('Generative AI operational requirements')}
                visible={visible}
                closeOnEsc={true}
                fullScreen
                onCancel={handleOk}
                footer={
                <Button type={'primary'} onClick={handleOk}>{t('Done')}</Button>
                }
            >
                <div style={{height:'100%',overflowY:'auto'}}>
                    {t('data source')}: <Text link={{target:'_blank',href:'https://docs.google.com/document/d/1VG8HIyz361zGduWgNG7R_R8Xkv0OOJ8b5C9QKeCjU0c/edit?tab=t.0#heading=h.cwc2ewfrtynq'}}>Google Built-in AI Early Preview Program - Update 1</Text>
                    <br />
                    <Table dataSource={data} pagination={false}>
                        <Column title={t('Type')} dataIndex="class" key="class" />
                        <Column title={t('content')} dataIndex="value" key="value" />
                    </Table>
                    <br/>
                    <Banner fullMode={false} type="warning" bordered icon={null} closeIcon={null}
                            title={<div style={{ fontWeight: 600, fontSize: '14px', lineHeight: '20px' }}>{t('Warning')}</div>}
                            description={
                        <Space vertical align={'start'}>
                            <div>{t('Tip_AI_require_1')}</div>
                            <div>{t('Tip_AI_require_2')}</div>
                        </Space>
                    }
                    />
                </div>
            </Modal>
        </>
    )
}