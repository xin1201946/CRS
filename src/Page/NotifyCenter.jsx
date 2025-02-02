import { useState, useEffect } from 'react';
import { Banner, Collapse, IconButton, Space, Tag } from '@douyinfe/semi-ui';
import { get_notify_list, clear_notify } from "../code/SystemToast.jsx";
import { useTranslation } from "react-i18next";
import { IconClock, IconClose } from "@douyinfe/semi-icons";
import './notifycenter.css';
import { getSettings } from "../code/Settings.js";
import CustomNotifyPanel from "./widget/CustomNotifyPanel.jsx";
import { motion } from 'framer-motion';
export default function NotifyCenter() {
    const [notifys, setNotifys] = useState([]);
    const [removing, setRemoving] = useState([]);
    const { t } = useTranslation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

    // 加载通知列表
    const fetchNotifyList = () => {
        const updatedNotifys = get_notify_list();
        setNotifys(updatedNotifys);
        renderNotifications();
    };

    // 初始化加载通知列表
    useEffect(() => {
        fetchNotifyList();
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        // 监听窗口大小变化事件
        window.addEventListener('resize', handleResize);

        // 在组件卸载时移除事件监听器，避免内存泄漏
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // 关闭单个通知
    const handleClose = (id) => {
        setRemoving((prev) => [...prev, id]);
        setTimeout(() => {
            const isCleared = clear_notify(id);
            if (isCleared) {
                fetchNotifyList(); // 更新通知列表
            }
            setRemoving((prev) => prev.filter((removingId) => removingId !== id));
            renderNotifications();
        }, 300);
    };

    const handleClearAll = () => {
        setRemoving(notifys.map((notify) => notify.id));
        setTimeout(() => {
            setNotifys([]);
            setRemoving([]);
            clear_notify();
        }, 300);
    };

    const renderNotifications = () => (
        <Collapse className={'Notify_center_Conner'} accordion>
            <motion.div
                initial={{ opacity: 0, y: 20 }} // 初始位置和透明度
                animate={{ opacity: 1, y: 0 }} // 动画结束时的位置
                exit={{ opacity: 0, y: 20 }}  // 退出时的动画
                transition={{ duration: 0.3, ease: 'easeOut' }}
            >
            {notifys.length > 0 ? (
                notifys.map(({ id, title, content, type, time }) => (
                    getSettings('notify_card') === '1' ? (
                        // eslint-disable-next-line react/jsx-key
                            <Collapse.Panel
                                header={title}
                                itemKey={id}
                                showArrow={false}
                                className={removing.includes(id) ? 'slide-out' : ''}
                                extra={
                                    <Space>
                                        <Tag color="violet" type={'ghost'} style={{ margin: 0 }}>
                                            {type}
                                        </Tag>
                                        <Tag color="cyan" prefixIcon={<IconClock style={{ color: 'cyan' }} />} type={'ghost'} style={{ margin: 0 }}>
                                            {time}
                                        </Tag>
                                    </Space>
                                }
                            >
                                <Banner
                                    key={id}
                                    fullMode={false}
                                    title={title}
                                    description={<Space vertical={true}>{content}</Space>}
                                    type={type}
                                    onClose={() => handleClose(id)}
                                    className={removing.includes(id) ? 'slide-out' : ''}
                                    style={{ marginBottom: '12px', transition: 'all 0.3s ease' }}
                                />
                            </Collapse.Panel>

                    ) : (
                        // eslint-disable-next-line react/jsx-key
                        <CustomNotifyPanel
                            title={title}
                            message={content}
                            showTime={time}
                            type={type}
                            id={id}
                            onClose={() => handleClose(id)}
                        />
                    )
                ))
            ) : (
                <p style={{ textAlign: 'center', color: 'var(--semi-color-text-2)' }}>
                    {t('No_notifications_available')}
                </p>
            )}
            </motion.div>
        </Collapse>
    );

    return (
        <div style={{ padding: '16px', position: 'relative' }}>
            {renderNotifications()}
            {notifys.length > 0 && (
                <IconButton
                    theme="light"
                    icon={<IconClose />}
                    style={{ left: windowWidth / 2 - 20, bottom: '10%', zIndex: 9999, position: 'fixed', borderRadius: '20px', backgroundColor: 'var(--semi-color-bg-4)' }}
                    onClick={handleClearAll}
                />
            )}
        </div>
    );
}
