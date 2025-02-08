
import {Card,SideSheet} from "@douyinfe/semi-ui";
import {
    IconArrowRight,
    IconBeaker,
    IconChevronRight,
    IconFile,
    IconInfoCircle,
    IconLanguage,
    IconSetting
} from "@douyinfe/semi-icons";
import {useState} from "react";
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import BaseSPage from "./settings_page/BaseS.jsx";
import AboutWE from "./settings_page/About.jsx";
import {AdvancedSettingsPage} from "./settings_page/AdvancedSettings.jsx";
import { useTranslation } from 'react-i18next';
import {LanguagePage} from "./settings_page/LanguagePage.jsx";
import {Logs_Viewer} from "./settings_page/Logs_Viewer.jsx";

export function Settings(){
    const { t } = useTranslation();
    const [baseSvisible, setbaseSVisible] = useState(false);
    const baseSchange = () => {
        setbaseSVisible(!baseSvisible);
    };
    const [advanSvisible, setadvanSVisible] = useState(false);
    const advanSchange = () => {
        setadvanSVisible(!advanSvisible);
    };
    const [advisible, setadVisible] = useState(false);
    const adchange = () => {
        setadVisible(!advisible);
    };
    const [lanvisible, setlanvisible] = useState(false);
    const lanchange = () => {
        setlanvisible(!lanvisible);
    };
    const [logvisible, setlogVisible] = useState(false);
    const logchange = () => {
        setlogVisible(!logvisible);
    };
    return(
        <>
            <Card
                shadows='hover'
                style={{cursor: "pointer"}}
                bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                onClick={baseSchange}
            >
                <Meta
                    avatar={
                        <IconSetting style={{color: 'var(--semi-color-primary)'}}/>
                    }
                    title={t('Base_Settings')}
                    description={t('Server_IP')}
                />
                <IconArrowRight style={{color: 'var(--semi-color-primary)'}}/>
            </Card>
            <br/>
            <Card
                shadows='hover'
                style={{cursor: "pointer"}}
                bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                onClick={advanSchange}
            >
                <Meta
                    avatar={
                        <IconBeaker style={{color: 'var(--semi-color-primary)'}}/>
                    }
                    title={t('Advanced_Settings')}
                    description={t('API_port') + ',' + t('HTTPS_Service')}
                />
                <IconArrowRight style={{color: 'var(--semi-color-primary)'}}/>
            </Card>
            <br/>
            <Card
                shadows='hover'
                style={{cursor: "pointer"}}
                bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                onClick={lanchange}
            >
                <Meta
                    avatar={
                        <IconLanguage style={{color: 'var(--semi-color-primary)'}}/>
                    }
                    title="语言/Language"
                    description={t('Toggle_display_language')}
                />
                <IconArrowRight style={{color: 'var(--semi-color-primary)'}}/>
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
                shadows='hover'
                style={{cursor: "pointer"}}
                bodyStyle={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
                onClick={adchange}
            >
                <Meta
                    avatar={
                        <IconInfoCircle style={{color: 'var(--semi-color-primary)'}}/>
                    }
                    title={t('About')}
                    description={t('AppInfo')}
                />
                <IconArrowRight style={{color: 'var(--semi-color-primary)'}}/>
            </Card>

            <SideSheet style={{maxWidth: "100%"}} closeOnEsc={true} title={t('Base_Settings')} visible={baseSvisible}
                       onCancel={baseSchange}>
                <BaseSPage></BaseSPage>
            </SideSheet>
            <SideSheet style={{maxWidth: "100%"}} closeOnEsc={true} title={t('Advanced_Settings')}
                       visible={advanSvisible} onCancel={advanSchange}>
                <AdvancedSettingsPage></AdvancedSettingsPage>
            </SideSheet>
            <SideSheet style={{maxWidth: "100%"}} closeOnEsc={true} title="语言/Language" visible={lanvisible}
                       onCancel={lanchange}>
                <LanguagePage></LanguagePage>
            </SideSheet>

            <SideSheet  style={{
                width: '100%'
            }} title={t('Log_viewer')} visible={logvisible} onCancel={logchange}>
                <Logs_Viewer></Logs_Viewer>
            </SideSheet>

            <SideSheet style={{maxWidth: "100%"}} closeOnEsc={true} title={t('About')} visible={advisible}
                       onCancel={adchange}>
                <AboutWE></AboutWE>
            </SideSheet>

        </>
    )
}