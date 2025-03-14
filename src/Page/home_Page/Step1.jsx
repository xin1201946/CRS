import {Button, Descriptions, Spin, Upload, Card, Space, Typography, Banner} from '@douyinfe/semi-ui';
import { IconPlus } from "@douyinfe/semi-icons";
import { useState } from "react";
import { getServer } from "../../code/get_server.js";
import { getAPI } from "../../code/server_api_settings.js";
import { useTranslation } from 'react-i18next';
import { send_notify } from "../../code/SystemToast.jsx";
import { add_log } from "../../code/log.js";
import { getSettings } from "../../code/Settings.js";

const { Title } = Typography;

function Step1() {
    const { t } = useTranslation();
    const [b1en, setb1en] = useState(true);
    const [datas, setdata] = useState([]);
    const [loading, toggleLoading] = useState(false);

    const action = `${getServer()}${getAPI('upload')}?uuid=${getSettings('uuid')}`;
    const clearfile = `${getServer()}${getAPI('clear')}`;
    const imageOnly = '.png,.jpeg,.jpg';

    const setLoading = (bool) => toggleLoading(bool);
    const setEnable = (bool) => setb1en(bool);

    async function get_result() {
        setLoading(true);
        try {
            const response = await fetch(`${getServer()}${getAPI('start')}?uuid=${getSettings('uuid')}`);
            const data = await response.json();
            update(data);
        } catch (error) {
            add_log('Fetch Error', 'error', error);
            setLoading(false);
        }
    }

    function update(data) {
        let desiderata = [];
        if (data[0] === "") {
            desiderata = [{ key: t('Failed_OCR'), value: data[0] }];
            showTotst(`${t('Failed_OCR')}${data[0]}`);
        } else {
            desiderata = [{ key: t('Success_OCR_Text'), value: data[0] }];
            showTotst(`${t('Success_OCR_Text')}${data[0]}`);
        }
        setdata(desiderata);
        setLoading(false);
    }

    function showTotst(message) {
        send_notify(t('New_Notify_Send'), message);
    }

    return (
        <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
            <Card
                title={<Title heading={3}>{t('Image_OCR_Tool')}</Title>}
                style={{
                    borderRadius: '12px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                }}
            >
                <Space vertical align="center" spacing="loose" style={{ width: '100%' }}>
                    <Upload
                        action={action}
                        picHeight={140}
                        picWidth={140}
                        listType="picture"
                        accept={imageOnly}
                        enctype="multipart/form-data"
                        limit={1}
                        onError={() => setEnable(true)}
                        onSuccess={() => setEnable(false)}
                        onClear={() => {
                            fetch(`${clearfile}?filename=${getSettings("uuid")}`).then();
                            setEnable(true);
                            setdata([]);
                        }}
                        onRemove={() => {
                            fetch(`${clearfile}?filename=${getSettings("uuid")}`).then();
                            setEnable(true);
                            setdata([]);
                        }}
                    >
                        <div style={{ textAlign: 'center' }}>
                            <IconPlus size="extra-large" style={{ color: '#666' }} />
                            <p style={{ margin: '8px 0 0', color: '#666' }}>
                                {t('Click_or_Drag_to_Upload')}
                            </p>
                        </div>
                    </Upload>

                    <Spin delay={100} spinning={loading}>
                        <Button
                            theme="solid"
                            type="primary"
                            size="large"
                            onClick={get_result}
                            disabled={b1en}
                            style={{
                                marginTop: '16px',
                                padding: '0 32px',
                                borderRadius: '8px'
                            }}
                        >
                            {t('Start_OCR')}
                        </Button>
                    </Spin>
                    {datas.length > 0 && (
                        <Descriptions
                            data={datas}
                            style={{
                                width: '100%',
                                backgroundColor:"var(--semi-color-bg-1)",
                                padding: '16px',
                                borderRadius: '8px',
                                marginTop: '16px'
                            }}
                            row
                        />
                    )}
                    <Banner style={{textAlign:"start",width:"100%",backgroundColor:"var(--semi-color-bg-1)"}} fullMode={false} icon={null} closeIcon={null}
                            title={<div style={{ fontWeight: 600, fontSize: '14px', lineHeight: '20px' }}>{t("How_use")}</div>}
                            description={
                                <div>
                                    <ui>
                                        <li>{t("Tip_Step1_Upload")}</li>
                                        <li>{t("Tip_Step1_wait")}</li>
                                        <li>{t("Tip_Step1_Click_Button")}</li>
                                        <li>{t("Tip_Step1_Wait_result")}</li>
                                    </ui>
                                </div>
                            }
                    />
                </Space>
            </Card>
        </div>
    );
}

export default Step1;