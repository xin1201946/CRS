
import {Toast, Col, Row, Upload, Button, Descriptions, Spin} from '@douyinfe/semi-ui';
import {getSettings} from "../../code/Settings.js";
import {IconPlus} from "@douyinfe/semi-icons";
import {useState} from "react";


export function Step1() {
    const [b1en,setb1en]=useState(true);
    const [datas,setdata]=useState([]);
    const [loading, toggleLoading] = useState(false);
    let action = "http://"+getSettings('server_ip')+'/upload';
    let clearfile = "http://"+getSettings('server_ip')+'/clear';
    let imageOnly = '.png,.jpeg,.jpg,.bmp';
    function setLoading(bool){
        toggleLoading(bool);
    }
    function setEnable(bool){
        setb1en(bool);
    }
    async function get_result() {
        setLoading(true)
        try {
            const response = await fetch("http://"+getSettings('server_ip') + '/start');
            const data = await response.json(); // 根据需要解析数据
            update(data); // 调用 update 函数处理数据
        } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false)
        }
    }

    function update(data) {
        // 处理获取到的数据
        let desiderata=[]
        if ( data[0] === ""){
            desiderata = [
                { key: '未能识别到文本', value: data[0] },
            ];
            showTotst('未能识别到文本 '+data[0])
        }else{
            desiderata = [
                { key: '识别到的文本', value: data[0] },
            ];
            showTotst('识别到的文本 '+data[0])
        }
        setdata(desiderata)
        setLoading(false)
        console.log(data);
    }
    function showTotst(message){
        let opts = {
            content:message,
            duration: 3,
            stack: true,
        };
        return(
            Toast.info(opts)
        )
    }


    return(
        <>
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
                                <Button   style={{marginTop:'20px'}}  onClick={get_result} disabled={b1en}>开始处理</Button>
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