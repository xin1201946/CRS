// eslint-disable-next-line no-unused-vars
import React, { useState, useEffect } from 'react';
import { Banner } from '@douyinfe/semi-ui';
import { get_notify_list, clear_notify } from "../code/SystemToast.jsx";
import { useTranslation } from "react-i18next";

export default function NotifyCenter() {
    const [notifys, setNotifys] = useState([]);
    const { t } = useTranslation();

    // 加载通知列表
    const fetchNotifyList = () => {
        const updatedNotifys = get_notify_list();
        setNotifys(updatedNotifys);
    };

    // 初始加载通知列表
    useEffect(() => {
        fetchNotifyList();
    }, []);

    // 处理关闭通知
    const handleClose = async (id) => {
        try {
            const isCleared = await clear_notify(id);
            if (isCleared) {
                fetchNotifyList();
            }
        } catch (error) {
            console.error('清除通知出错:', error);
            // 可以在这里根据业务需求添加更友好的用户提示逻辑，比如弹出提示框告知用户清除失败等
        }
    };

    return (
        <div style={{ padding: '16px' }}>
            {notifys.length > 0 ? (
                notifys.map(({ id, time, title, content }) => (
                    <Banner
                        key={id}
                        fullMode={false}
                        title={title}
                        description={content}
                        type="info"
                        onClose={() => handleClose(id)}
                        style={{ marginBottom: '12px' }}
                    />
                ))
            ) : (
                <p style={{ textAlign: 'center', color: "var(--semi-color-text-2)" }}>
                    {t('No_notifications_available')}
                </p>
            )}
        </div>
    );
}
