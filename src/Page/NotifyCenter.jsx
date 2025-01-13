import { useState, useEffect } from 'react';
import { Banner, IconButton } from '@douyinfe/semi-ui';
import { get_notify_list, clear_notify } from "../code/SystemToast.jsx";
import { useTranslation } from "react-i18next";
import { IconClose } from "@douyinfe/semi-icons";
import './notifycenter.css';

export default function NotifyCenter() {
    const [notifys, setNotifys] = useState([]); // 通知列表
    const [removing, setRemoving] = useState([]); // 正在移除的通知 ID 列表
    const { t } = useTranslation();

    // 加载通知列表
    const fetchNotifyList = () => {
        const updatedNotifys = get_notify_list();
        setNotifys(updatedNotifys);
    };

    // 初始化加载通知列表
    useEffect(() => {
        fetchNotifyList();
    }, []);

    // 关闭单个通知
    const handleClose = (id) => {
        setRemoving((prev) => [...prev, id]); // 将通知标记为移除状态
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
            {notifys.length > 0 ? (
                notifys.map(({ id, title, content }) => (
                    <Banner
                        key={id}
                        fullMode={false}
                        title={title}
                        description={content}
                        type="info"
                        onClose={() => handleClose(id)}
                        className={removing.includes(id) ? 'slide-out' : ''} // 应用滑动动画
                        style={{ marginBottom: '12px', transition: 'all 0.3s ease' }}
                    />
                ))
            ) : (
                <p style={{ textAlign: 'center', color: 'var(--semi-color-text-2)' }}>
                    {t('No_notifications_available')}
                </p>
            )}

            {/* 清除全部按钮 */}
            {notifys.length > 0 && (
                <div
                    className="clear-all-button"
                    style={{
                        position: 'fixed',
                        bottom: '10%',
                        left: '15%',
                        transform: 'translateX(-50%)',
                        zIndex: 99999,
                    }}
                >
                    <IconButton
                        theme="light"
                        icon={<IconClose />}
                        style={{ borderRadius: '20px' }}
                        onClick={handleClearAll}
                    />
                </div>
            )}
        </div>
    );
}
