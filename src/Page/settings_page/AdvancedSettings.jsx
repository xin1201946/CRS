import {
    Banner,
    Button,
    Card,
    Input,
    Popconfirm,
    Popover,
    SideSheet,
    Space,
    Switch,
    Typography
} from "@douyinfe/semi-ui";
import {getSettings, setSettings} from "../../code/Settings.js";
import {IconInfoCircle} from "@douyinfe/semi-icons";
import {useState} from "react";
import {getAPI, setAPIJ, setDefaultAPI} from "../../code/server_api_settings.js";
import BaseSPage from "./BaseS.jsx";
import Logs_Viewer from "./Logs_Viewer.jsx";
import {useTranslation} from "react-i18next";

function AdvancedSettingsPage() {
    const { t } = useTranslation();
    const [httpschecked, sethttpsChecked] = useState(getSettings('use_https')==='true');
    const { Text } = Typography;
    const [advanSvisible, setadvanSVisible] = useState(false);
    const advanSchange = () => {
        setadvanSVisible(!advanSvisible);
    };
    const [LogsPvisible, setLogsPVisible] = useState(false);
    const LogsPchange = () => {
        setLogsPVisible(!LogsPvisible);
    };
    const onhttpschange = (e) =>{
        sethttpsChecked(e)
        setSettings('use_https',e);
    }
    const onsave_api=()=>{
        const resultJson={
            "api_upload":document.getElementById('upload').value,
            "api_clear":document.getElementById('clear').value,
            "api_start":document.getElementById('start').value,
            "api_test":document.getElementById('test').value,
        }
        setAPIJ(resultJson);
        window.location.reload()
    }
    const changeDefaultapi=()=>{
        setDefaultAPI()
        window.location.reload()
    }
    return (
        <>
            <Card
                header={<Text>{t('HTTPS_Service_Setting')}</Text>}
            >
                <Banner fullMode={false} type="info" bordered icon={null} closeIcon={null}
                        title={<div style={{
                            fontWeight: 600,
                            fontSize: '14px',
                            lineHeight: '20px'
                        }}>{t('Tip_unknow_http_service')}</div>}
                        description={<div>{t('Tip_try_off_https')}<br/> {t('Tip_please_turn_off')}<Text
                            link={{href: window.location}}>{t('Refresh')}</Text>{t('Tip_update_state')}</div>}
                />
                <br/>
                <Space>
                    {t('Use_https')}
                    <Popover
                        showArrow
                        position={'top'}
                        content={
                            <article>
                                {getSettings('use_https') === 'true' ? t('Tip_you_open_https') : t('Tip_you_open_https')}
                            </article>
                        }
                    >
                        <IconInfoCircle style={{color: 'var(--semi-color-primary)'}}></IconInfoCircle>
                    </Popover>
                    <Switch checked={httpschecked} onChange={onhttpschange} aria-label=""></Switch>
                </Space>
                <br/>
                <br/>
                <Space>
                    {t('Https_state')} {getSettings('use_https')}
                    <Popover
                        showArrow
                        position={'top'}
                        content={
                            <article>
                                {getSettings('use_https') === 'true' ? t('Tip_send_by_https') : t('Tip_send_by_http')}
                            </article>
                        }
                    >
                        <IconInfoCircle style={{color: 'var(--semi-color-primary)'}}></IconInfoCircle>
                    </Popover>
                </Space>
            </Card>
            <br/>
            <Card
                header={<Text>{t('API_Settings')}</Text>}
            >
                <Banner fullMode={false} icon={null} type="danger" bordered closeIcon={null}
                        title={<div style={{fontWeight: 600, fontSize: '14px', lineHeight: '20px'}}>⚠ {t('Warning')}</div>}
                        description={
                            <div>{t('Tip_seem_api')}<br/> {t('Tip_please_turn_off')}<Text
                                link={{href: window.location}}>{t('Refresh')}</Text>{t('Tip_update_state')}</div>}
                >
                    <div className="semi-modal-footer">
                        <Popconfirm
                            title={t('Save_change')}
                            content={t("Tip_can_recover_set")}
                            position={"bottomRight"}
                            onConfirm={onsave_api}
                        >
                            <Button className="semi-button semi-button-tertiary semi-button-light"
                                    type="button">{t("Save_setting")}</Button>
                        </Popconfirm>
                        <Popconfirm
                            title={t('Save_change')}
                            content={t('Tip_loss_all_set')}
                            position={"bottomRight"}
                            onConfirm={changeDefaultapi}
                        >
                            <Button className="semi-button semi-button-warning" type="button">{t('Restore_default_settings')}</Button>
                        </Popconfirm>
                    </div>
                </Banner>
                <br/>
                <Space id={'api_input_box'} vertical align={'left'}>
                    <Space  spacing={'medium'}>
                        <Text style={{width:'50%'}}>{t('Upload_pic')}</Text>
                        <Input id={'upload'} style={{width:'50%'}} defaultValue={getAPI("upload")}></Input>
                    </Space>
                    <Space  spacing={'medium'}>
                        <Text style={{width:'50%'}}>{t('Del_pic')}</Text>
                        <Input id={'clear'} style={{width:'50%'}} defaultValue={getAPI("clear")}></Input>
                    </Space>
                    <Space  spacing={'medium'}>
                        <Text style={{width:'50%'}}>{t('Send_start')}</Text>
                        <Input id={'start'} style={{width:'50%'}} defaultValue={getAPI("start")}></Input>
                    </Space>
                    <Space  spacing={'medium'}>
                        <Text style={{width:'50%'}}>{t('Test_can_use')}</Text>
                        <Input id={'test'} style={{width:'50%'}} defaultValue={getAPI("test")}></Input>
                    </Space>
                </Space>
            </Card>
            <br/>
            <Card style={{backgroundColor: 'var( --semi-color-fill-0)'}}>
                <Space spacing={'medium'} vertical align='left'>
                    <Text style={{
                        fontSize: 'medium',
                        fontWeight: "bold",
                        color: "var( --semi-color-text-2)"
                    }}>{t('Look_other_set')}</Text>
                    <Text onClick={advanSchange}
                          style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>{t('Server_IP')}</Text>
                    <Text onClick={advanSchange}
                          style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>{t('Theme_color')}</Text>
                    <Text onClick={advanSchange}
                          style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>{t('UI_set')}</Text>
                    <Text onClick={LogsPchange}
                          style={{color: 'var( --semi-color-link)', cursor: 'pointer'}}>{t('Log_viewer')}</Text>
                </Space>
            </Card>
            <br/>
            <SideSheet style={{maxWidth: "100%"}} closeOnEsc={true} title={t('Base_Settings')} visible={advanSvisible}
                       onCancel={advanSchange}>
                <BaseSPage></BaseSPage>
            </SideSheet>
            <SideSheet style={{width: "100%"}} closeOnEsc={true} title={t('Log_viewer')} visible={LogsPvisible}
                       onCancel={LogsPchange}>
                <Logs_Viewer></Logs_Viewer>
            </SideSheet>
            <br/>
        </>
    )
}
export default  AdvancedSettingsPage