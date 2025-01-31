import { useState, useEffect } from 'react';
import {Banner, Collapse, IconButton, Space, Tag} from '@douyinfe/semi-ui';
import {get_notify_list, clear_notify, subscribeToNotifications} from "../code/SystemToast.jsx";
import { useTranslation } from "react-i18next";
import {IconClock, IconClose} from "@douyinfe/semi-icons";
import './notifycenter.css';
import {getSettings} from "../code/Settings.js";
import CustomNotifyPanel from "./widget/CustomNotifyPanel.jsx";

export default function NotifyCenter() {
    const [notifys, setNotifys] = useState([]); // 通知列表
    const [removing, setRemoving] = useState([]); // 正在移除的通知 ID 列表
    const { t } = useTranslation();
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    // 加载通知列表
    const fetchNotifyList = (list) => {
        if (list) {
            const updatedNotifys = get_notify_list();
            setNotifys(updatedNotifys);
        }
        const updatedNotifys = get_notify_list();
        setNotifys(updatedNotifys);
    };

    // 初始化加载通知列表
    useEffect(() => {
        fetchNotifyList();
        subscribeToNotifications(fetchNotifyList)
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
        setRemoving((prev) => [...prev, id]); // 将通知标记为移除状态
        console.log(id)
        setTimeout(() => {
            const isCleared = clear_notify(id); // 清除通知
            if (isCleared) {
                fetchNotifyList(); // 更新通知列表
            }
            setRemoving((prev) => prev.filter((removingId) => removingId !== id)); // 移除标记
        }, 300); // 动画持续时间
    };

    const handleClearAll = () => {
        setRemoving(notifys.map((notify) => notify.id)); // 标记所有通知为移除状态

        // 延迟清空通知列表和调用 clear_notify，等待动画完成
        setTimeout(() => {
            setNotifys([]); // 清空通知列表
            setRemoving([]); // 清空移除标记
            clear_notify();  // 动画完成后清空通知数据
        }, 300); // 动画持续时间 (与 CSS 动画时长保持一致)
    };


    return (
        <div style={{ padding: '16px', position: 'relative' }}>
            <Collapse accordion>
                {notifys.length > 0 ? (
                    notifys.map(({ id, title, content,type,time }) => (
                        getSettings('notify_card')==='1'?
                            <Collapse.Panel  header={title} itemKey={id} key={id} showArrow={false}
                                             className={removing.includes(id) ? 'slide-out' : ''} // 应用滑动动画
                                             extra={
                                                 <Space>
                                                     <Tag color="violet" type={'ghost'} style={{ margin: 0 }}>
                                                         {' '}
                                                         {type}
                                                         {' '}
                                                     </Tag>
                                                     <Tag color="cyan" prefixIcon={<IconClock style={{color:'cyan'}} />} type={'ghost'} style={{ margin: 0 }}>
                                                         {' '}
                                                         {time}
                                                         {' '}
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
                                    className={removing.includes(id) ? 'slide-out' : ''} // 应用滑动动画
                                    style={{ marginBottom: '12px', transition: 'all 0.3s ease' }}
                                />
                            </Collapse.Panel>:
                            // eslint-disable-next-line react/jsx-key
                            <CustomNotifyPanel  className={removing.includes(id) ? 'slide-out' : ''} title={title} message={content} showTime={time} type={type} id={id} onClose={(id) => handleClose(id)} />
                    ))
                ) : (
                    <p style={{ textAlign: 'center', color: 'var(--semi-color-text-2)' }}>
                        {t('No_notifications_available')}
                    </p>
                )}
            </Collapse>


            {/* 清除全部按钮 */}
            {notifys.length > 0 && (
                <IconButton
                    theme="light"
                    icon={<IconClose />}
                    style={{left:windowWidth/2-20,bottom: '10%',zIndex: 9999, position: 'fixed',borderRadius: '20px',backgroundColor:'var(--semi-color-bg-4)' }}
                    onClick={handleClearAll}
                />
            )}
        </div>
    );
}
