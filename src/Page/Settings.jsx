
import {Card,SideSheet} from "@douyinfe/semi-ui";
import {IconArrowRight, IconBeaker, IconInfoCircle, IconSetting} from "@douyinfe/semi-icons";
import {useState} from "react";
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import BaseSPage from "./settings_page/BaseS.jsx";
import AboutWE from "./settings_page/About.jsx";
import {AdvancedSettingsPage} from "./settings_page/AdvancedSettings.jsx";

export function Settings(){
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
    return(
        <>
            <Card
                shadows='hover'
                style={{cursor:"pointer"}}
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
                    title="基本设置"
                    description="服务器IP"
                />
                <IconArrowRight style={{ color: 'var(--semi-color-primary)' }}/>
            </Card>
            <br/>
            <Card
                shadows='hover'
                style={{cursor:"pointer"}}
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
                    title="高级设置"
                    description="API端口，HTTPS服务"
                />
                <IconArrowRight style={{ color: 'var(--semi-color-primary)' }}/>
            </Card>
            <br/>
            <Card
                shadows='hover'
                style={{ cursor:"pointer"}}
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
                    title="关于"
                    description="应用信息"
                />
                <IconArrowRight style={{ color: 'var(--semi-color-primary)' }}/>
            </Card>

            <SideSheet mask={false} disableScroll={false} style={{maxWidth:"100%"}} closeOnEsc={true} title="基本设置" visible={baseSvisible} onCancel={baseSchange}>
                <BaseSPage></BaseSPage>
            </SideSheet>
            <SideSheet mask={false} disableScroll={false} style={{maxWidth:"100%"}}  closeOnEsc={true} title="高级设置" visible={advanSvisible} onCancel={advanSchange}>
                <AdvancedSettingsPage></AdvancedSettingsPage>
            </SideSheet>
            <SideSheet mask={false} disableScroll={false} style={{maxWidth:"100%"}} closeOnEsc={true} title="关于" visible={advisible} onCancel={adchange}>
                <AboutWE></AboutWE>
            </SideSheet>
        </>
    )
}