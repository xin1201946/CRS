import { useState } from 'react';
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
                               onClose, id,
                           }) {
    const notify_id=id
    const controls = useAnimation()
    const result = extra === null || typeof extra === 'undefined' ? (
        <Space style={{width: '100%'}}>
            <Space style={{width: '90%'}}>
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
            </Space>
            <IconButton theme={'borderless'} icon={<IconClose style={{ color: 'orangered' }} />} onClick={() => onClose(notify_id)}></IconButton>
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
        await animationSequenceout()
        setShowMessage(prevShowMessage => {
            const newShowMessage = !prevShowMessage;
            updateMessage(newShowMessage);
            return newShowMessage;
        })
        await animationSequencein()
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
                    onPanEnd={(e, info) => {
                        if (info.offset.x > 100) {
                            // 向右滑动，移出屏幕
                            controls.start({ x: window.innerWidth, opacity: 0 }).then(() => onClose(notify_id));
                        } else if (info.offset.x < -100) {
                            // 向左滑动，移出屏幕
                            controls.start({ x: -window.innerWidth, opacity: 0 }).then(() => onClose(notify_id));
                        } else {
                            // 回弹回原位
                            controls.start({ x: 0 });
                        }
                    }}
                >

                <Card
                        bordered={true}
                        style={{ margin: '10px' }}
                        shadows={true}
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
    onClose: PropTypes.func
};

CustomNotifyPanel.defaultProps = {
    extra: null
};

