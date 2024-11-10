import {SideSheet,Card, Carousel, Col, Row, Space} from "@douyinfe/semi-ui";
import {IconArrowRight, IconFile, IconLink, IconScan, IconSetting} from "@douyinfe/semi-icons";
import Meta from "@douyinfe/semi-ui/lib/es/card/meta.js";
import {emit} from "../../code/PageEventEmitter.js";
import React, {useState} from "react";
import {Settings} from "../Settings.jsx";
import {Logs_Viewer} from "../settings_page/Logs_Viewer.jsx";
import {detectDevice} from "../../code/check_platform.js";

export function HomePage() {
    const [setPagevisible, setPagechange] = useState(false);
    const setchange = () => {
        setPagechange(!setPagevisible);
    };
    const [Logvisible, setlogPagechange] = useState(false);
    const logchange = () => {
        setlogPagechange(!Logvisible);
    };
    function changeSelectKey(){
        emit('changePage', 'vision')
    }
    function link(link){
        window.open(link, "_blank");
    }
    function openPage(page){
        if (page==='1'){
            setlogPagechange(!Logvisible);
        }else{
            setPagechange(!setPagevisible);
        }
    }
    const style = {
        display: detectDevice()==='Phone'?"none":'',
        width: 'auto',
        height: window.innerHeight-200,
        zIndex:'0'
    };
    const LinkCard=(title,func,can1='',icon=<IconArrowRight />)=> {
        const fun = () => {
            func(can1)
        }
        return (
            <>
                <Card

                    onClick={fun}
                    shadows={'hover'}
                    style={{maxWidth: 330,margin:"5px"}}
                    bodyStyle={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                    }}
                >
                    <Meta
                        title={title}
                    />
                    {icon}
                </Card>
            </>
        )
    };
    const imgList = [
        './bannerimg1.jpg',
        './bannerimg2.jpg',
        './bannerimg3.jpg',
    ];


    return (
        <>
            <div className="grid" >
                <Carousel  style={style} arrowType={'hover'} theme='dark'>
                    {
                        imgList.map((src, index) => {
                            return (
                                <div key={index} style={{backgroundSize: 'cover', backgroundImage: `url('${src}')`}}>
                                </div>
                            );
                        })
                    }
                </Carousel>

                <br/>
                <div className="grid">
                    <Space wrap={true} style={{width:"100%"}}>
                        <Row justify="center" type="flex" style={{width:"100%"}}>
                                <Col style={{minWidth:'150px'}} span={6} order={1}>
                                    {LinkCard('开始识别', changeSelectKey, '', <IconScan/>)}
                                </Col>
                                <br/>
                                <Col style={{minWidth:'150px'}} span={6} order={2}>
                                    {LinkCard('访问官网', link, 'https://www.dicastal.com/', <IconLink></IconLink>)}
                                </Col>
                                <br/>
                                <Col  style={{minWidth:'150px'}} span={6} order={3}>
                                    {LinkCard('修改设置', openPage, "0", <IconSetting/>)}
                                </Col>
                                <br/>
                                <Col style={{minWidth:'150px'}} span={6} order={4}>
                                    {LinkCard('查看日志', openPage, '1', <IconFile/>)}
                                </Col>

                        </Row>
                    </Space>
                </div>
                <SideSheet style={{maxWidth:"100%"}} title='设置' visible={setPagevisible} onCancel={setchange} placement={'right'}>
                    <Settings/>
                </SideSheet>
                <SideSheet style={{width:'100%'}} title='日志查看器' visible={Logvisible} onCancel={logchange} placement={'right'}>
                    <Logs_Viewer/>
                </SideSheet>
            </div>
        </>

    );
}