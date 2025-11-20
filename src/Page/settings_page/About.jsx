import {Card, Descriptions, Popover, SideSheet, Space, Typography} from "@douyinfe/semi-ui";
import {getSettings} from "../../code/Settings.js";
import {useState} from "react";
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {IconChevronRight, IconInfoCircle} from "@douyinfe/semi-icons";
import {getServer} from "../../code/get_server.js";
import BetaFunctionalityPage from "./BetaFunctionality.jsx";
import {useTranslation} from "react-i18next";
import Chrome_AI_Info from "../info_Page/Chrome_AI_Info.jsx";
import {detectDevice} from "../../code/check_platform.js";
import {send_notify} from "../../code/SystemToast.jsx";
import ServerInfo from "../info_Page/ServerInfo.jsx";
import { Tag } from '@douyinfe/semi-ui';
import { motion } from "framer-motion";

function AboutWE(){
    const { t } = useTranslation();
    const { Text } = Typography;

    const [beta, setbeta] = useState(0);
    const [betavisible, setbetaVisible] = useState('hidden');
    const [betaPagevisible, setbetaPageVisible] = useState(false);
    const [sysIngoPagevisible, setsysIngoPagevisible] = useState(false);
    const [showChromeAIInfo, setShowChromeAIInfo] = useState(false);
    const betaPchange=()=>{
        setbetaPageVisible(!betaPagevisible)
    }
    const sysIngoPagechange=()=>{
        setsysIngoPagevisible(!sysIngoPagevisible)
    }
    const handleIconClick = () => {
        if (detectDevice()==='PC'){
            setShowChromeAIInfo(true);
        }else{
            send_notify(t('Warning'),t('Tip_AI_Devices_NS'))
        }
    };
    const clickbeta = ()=>{
        if (beta >= 8){
            setbetaVisible('visible');
            setbeta(0)
        }else{
            setbeta(beta + 1);
        }

    }


    function appInfo(){
        return (
            <>
                <section className="about-hero-section">
                    <div className="about-gradient-bg"></div>
                    <motion.div
                        initial={{ opacity: 0, y: 32, filter: 'blur(10px)' }}
                        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                        transition={{ duration: 0.9, ease: [0.19, 1, 0.22, 1] }}
                        className="about-hero-card"
                    >
                        <motion.h1
                            initial={{ scale: 0.94, y: 8 }}
                            animate={{
                                scale: 1,
                                y: 0,
                                backgroundPosition: ['0% 0%', '100% 0%', '0% 0%']
                            }}
                            transition={{
                                type: 'spring',
                                stiffness: 170,
                                damping: 18,
                                delay: 0.05,
                                backgroundPosition: {
                                    duration: 10,
                                    repeat: Number.POSITIVE_INFINITY,
                                    ease: 'linear'
                                }
                            }}
                            className="about-hero-title"
                        >
                            CCRS UI
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.35, duration: 0.7, ease: 'easeOut' }}
                            className="about-hero-subtitle"
                        >
                            <Tag size="large" style={{fontSize:"15px", borderRadius: '8px', fontWeight: '600'}} type="solid" color="orange">2.0.2.1</Tag>
                        </motion.p>

                        <motion.p
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.55, duration: 0.7, ease: 'easeOut' }}
                            className="about-hero-tagline"
                        >
                            REACT · SEMIUI
                        </motion.p>
                    </motion.div>

                </section>

                <section className="about-content-section">
                    <motion.div
                        initial={{ opacity: 0, y: 32 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-80px' }}
                        transition={{ duration: 0.7, ease: 'easeOut' }}
                        className="about-content-inner"
                    >


                        <div className="about-card-stack">
                            <Card onClick={clickbeta} className="glass-card !rounded-3xl border-none" shadows='hover'>
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
                                                <IconInfoCircle onClick={handleIconClick} style={{color: 'var(--semi-color-primary)'}}/>
                                            </Popover>
                                        </Space>
                                    </Descriptions.Item>
                                </Descriptions>
                            </Card>

                            <Card
                                onClick={sysIngoPagechange}
                                className="glass-card !rounded-3xl border-none"
                                shadows='hover'
                                style={{cursor: "pointer"}}
                                bodyStyle={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '24px'
                                }}
                            >
                                <Meta
                                    title={<span className="text-lg font-medium">{t('Server Info')}</span>}
                                />
                                <IconChevronRight style={{color: 'var(--semi-color-text-2)', fontSize: '20px'}}/>
                            </Card>

                            <Card
                                onClick={betaPchange}
                                className="glass-card !rounded-3xl border-none"
                                shadows='hover'
                                style={{cursor: "pointer", visibility: betavisible}}
                                bodyStyle={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '24px'
                                }}
                            >
                                <Meta
                                    title={<span className="text-lg font-medium">BetaFunctionality</span>}
                                />
                                <IconChevronRight style={{color: 'var(--semi-color-text-2)', fontSize: '20px'}}/>
                            </Card>
                        </div>
                        <Text type="secondary" className="mt-8 opacity-60">Powered & Designed by <Text link={{href:"https://github.com/xin1201946"}} className="font-semibold">Canfeng</Text></Text>

                    </motion.div>
                </section>

                <SideSheet style={{maxWidth: "100%"}} title="BetaFunc" visible={betaPagevisible} onCancel={betaPchange}>
                    <BetaFunctionalityPage></BetaFunctionalityPage>
                </SideSheet>
                <SideSheet width={"100%"} title={t('Server Info')} visible={sysIngoPagevisible} onCancel={sysIngoPagechange}>
                    <ServerInfo></ServerInfo>
                </SideSheet>
            </>
        );
    }

    return (
        <>
            {appInfo()}
            <Chrome_AI_Info visible={showChromeAIInfo} handleOk={()=>{setShowChromeAIInfo(false)}} />
        </>
    )
}
export default AboutWE