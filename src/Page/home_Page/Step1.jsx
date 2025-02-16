import {Button, Col, Descriptions, Row, Spin, Upload} from '@douyinfe/semi-ui';
import {IconPlus} from "@douyinfe/semi-icons";
import {useState} from "react";
import {getServer} from "../../code/get_server.js";
import {getAPI} from "../../code/server_api_settings.js";
import {useTranslation} from 'react-i18next';
import {send_notify} from "../../code/SystemToast.jsx";
import {add_log} from "../../code/log.js";

function Step1() {
    const { t } = useTranslation();
    const [b1en,setb1en]=useState(true);
    const [datas,setdata]=useState([]);
    const [loading, toggleLoading] = useState(false);
    let action = getServer()+getAPI('upload');
    let clearfile = getServer()+getAPI('clear');
    let imageOnly = '.png,.jpeg,.jpg';
    function setLoading(bool){
        toggleLoading(bool);
    }
    function setEnable(bool){
        setb1en(bool);
    }
    async function get_result() {
        setLoading(true)
        try {
            const response = await fetch(getServer() + getAPI('start'));
            const data = await response.json(); // 根据需要解析数据
            update(data); // 调用 update 函数处理数据
        } catch (error) {
            add_log('Fetch Error','error',error)
            setLoading(false)
        }
    }

    function update(data) {
        // 处理获取到的数据
        let desiderata=[]
        if ( data[0] === ""){
            desiderata = [
                { key: t('Failed_OCR'), value: data[0] },
            ];
            showTotst(t('Failed_OCR')+data[0])
        }else{
            desiderata = [
                { key: t('Success_OCR_Text'), value: data[0] },
            ];
            showTotst(t('Success_OCR_Text')+data[0])
        }
        setdata(desiderata)
        setLoading(false)
    }
    function showTotst(message){
        send_notify(t('New_Notify_Send'),message);
    }


    return(
        <>
            <br/>
            <div className="grid" style={{margin:"7px"}}>
                <Row type="flex" justify="center">
                    <Col>
                        <Upload
                            action={action}
                            listType={'picture'}
                            accept={imageOnly}
                            enctype="multipart/form-data"
                            limit={1}
                            onError={function(){setEnable(true)}}
                            onSuccess={function(){setEnable(false)}}
                            onClear={function(){fetch(clearfile).then();setEnable(true);setdata({ key: '', value: '' })}}
                            onRemove={function (e){fetch(clearfile+'?filename='+e.name).then();setEnable(true);setdata({ key: '', value: '' })}}
                        >
                            <IconPlus size="extra-large" />
                        </Upload>
                    </Col>
                </Row>
                <Row type="flex" justify="center">
                    <Spin delay={100} spinning={loading}>
                                <Button   style={{marginTop:'20px'}}  onClick={get_result} disabled={b1en}>{t('Start_OCR')}</Button>
                    </Spin>
                </Row>
                <Row type="flex" justify="center">
                    <Col>
                        <Descriptions style={{marginTop:'20px'}}  data={datas} />
                    </Col>
                </Row>
            </div>
        </>
    )
}
export default  Step1