import {useState} from 'react';
import {Card, IconButton, Space, Tag} from "@douyinfe/semi-ui";
import {IconClock, IconClose} from "@douyinfe/semi-icons";
import PropTypes from 'prop-types';
import './customNotifyPanel.css';
import {AnimatePresence, motion, useAnimation} from "framer-motion";

export default function CustomNotifyPanel({
                                              title,
                                              message,
                                              showTime,
                                              type,
                                              extra = null,
                                              onClose=null, id, newTagList=[],noOffsetScreen=false
                                          }) {
    const notify_id=id
    const controls = useAnimation()
    const [iconButtonColor, setIconButtonColor] = useState('gray');
    const [isDragging, setIsDragging] = useState(false);  // 新增拖拽状态
    const closeNotify = () => {
        if (onClose !== null){
            setIsDragging(true)
            onClose(notify_id)
        }
    }
    const result = extra === null || typeof extra === 'undefined' ? (
        <Space className={'CustomNotify_Footer_Space'} style={{width: '100%'}} >
            <Space style={{width: '90%'}} wrap={true}>
                <Tag color={type==='warning'?"yellow":type==='danger'?'red':type==='success'?'green':"violet"} type="ghost" style={{ margin: 0 }}>
                    {' '}
                    {type}
                    {' '}
                </Tag>
                <Tag
                    color="cyan"
                    prefixIcon={<IconClock style={{ color: 'cyan' }} />}
                    type="ghost"
                    style={{ margin: 0 }}
                >
                    {' '}
                    {showTime}
                    {' '}
                </Tag>
                {
                    newTagList.length > 0 ? (
                        newTagList.map(({ msg, icon, color, type }) => (
                            // eslint-disable-next-line react/jsx-key
                            <Tag
                                color={color===null||color===undefined?'green':color}
                                prefixIcon={icon===null||icon===undefined?null:icon}
                                type={type===null||type===undefined?'ghost':type}
                                style={{ margin: 0 }}
                            >
                                {''}
                                {msg}
                                {''}
                            </Tag>
                        ))
                    ) : (
                        <></>
                    )
                }
            </Space>
            <IconButton
                onMouseEnter={() => setIconButtonColor('orangered')}
                onMouseLeave={() => setIconButtonColor('gray')}
                className="CustomNotify_Footer_Space_IconButton"
                theme="borderless"
                icon={<IconClose style={{ color: iconButtonColor }} />}
                onClick={closeNotify}
            />
        </Space>

    ) : extra;

    const [showMessage, setShowMessage] = useState(false);
    const [dynamicMessage, setDynamicMessage] = useState(<>
        {message===null || message===undefined || message===<></> || typeof(message)==='object'?title:message} {result}
    </>);
    const animationSequenceout = async () => {
        await controls.start({ opacity: 0, transition: { duration: 0.3 } })
    }
    const animationSequencein = async () => {
        await controls.start({ opacity: 1, transition: { duration: 0.3 } })
    }
    const showMessageP = async () => {
        if (!isDragging){
            await animationSequenceout()
            setShowMessage(prevShowMessage => {
                const newShowMessage = !prevShowMessage;
                updateMessage(newShowMessage);
                return newShowMessage;
            })
            await animationSequencein()
        }else{
            setIsDragging(false);
        }
    };

    const updateMessage = (newShowMessage) => {
        setDynamicMessage(newShowMessage ? message : <>
            {message===null || message===undefined || message===<></> || typeof(message)==='object'?title:message} {result}
        </>);
    };
    return (
        <>
            <AnimatePresence>
                <motion.div
                    initial={{ opacity: 1, x: 0 }}
                    animate={controls}
                    exit={{ opacity: 1 }}
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.2}
                    onPanStart={() => {setIsDragging(true)}}
                    onPanEnd={(e, info) => {
                        setIsDragging(false)
                        if (onClose===null){
                            controls.start({ x: 0 });
                        } else if (noOffsetScreen){
                            controls.start({ x: 0 }).then(closeNotify);
                        }  else if (info.offset.x > 200) {
                            // 向右滑动，移出屏幕
                            controls.start({ x: window.innerWidth, opacity: 0 }).then(closeNotify);
                        } else if (info.offset.x < -200) {
                            // 向左滑动，移出屏幕
                            controls.start({ x: -window.innerWidth, opacity: 0 }).then(closeNotify);
                        } else {
                            // 回弹回原位
                            controls.start({ x: 0 });
                        }
                    }}
                >

                    <Card
                        bordered={true}
                        style={{ margin: '10px' }}
                        shadows={"hover"}
                        title={showMessage ? title : null}
                        footerLine={false}
                        footer={showMessage ? result : null}
                        headerLine={false}
                        onClick={showMessageP}
                    >
                        {dynamicMessage}
                    </Card>
                </motion.div>
            </AnimatePresence>

        </>
    );
}

// 定义 propTypes 和 defaultProps
CustomNotifyPanel.propTypes = {
    title: PropTypes.string.isRequired,
    message: PropTypes.node.isRequired,
    showTime: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    extra: PropTypes.node,
    id:PropTypes.string,
    onClose: PropTypes.func,
    newTagList:PropTypes.array,
    noOffsetScreen:PropTypes.bool
};

CustomNotifyPanel.defaultProps = {
    extra: null,
    newTagList:[],
    onClose:null,
    noOffsetScreen:false,
};

