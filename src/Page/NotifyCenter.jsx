"use client"

import {useCallback, useEffect, useState} from "react"
import {Banner, Collapse, IconButton, Space, Tag} from "@douyinfe/semi-ui"
import {IconClock, IconClose} from "@douyinfe/semi-icons"
import {useTranslation} from "react-i18next"
import {AnimatePresence, motion} from "framer-motion"
import {clear_notify, get_notify_list} from "../code/SystemToast.jsx"
import {getSettings} from "../code/Settings.js"
import CustomNotifyPanel from "./widget/CustomNotifyPanel.jsx"
import "./notifycenter.css"

function useNotifications() {
    const [notifys, setNotifys] = useState([])
    const [removing, setRemoving] = useState([])

    const fetchNotifyList = useCallback(() => {
        const updatedNotifys = get_notify_list()
        setNotifys(updatedNotifys)
    }, [])

    const handleClose = useCallback(
        (id) => {
            setRemoving((prev) => [...prev, id])
            setTimeout(() => {
                const isCleared = clear_notify(id)
                if (isCleared) {
                    fetchNotifyList()
                }
                setRemoving((prev) => prev.filter((removingId) => removingId !== id))
            }, 300)
        },
        [fetchNotifyList],
    )

    const handleClearAll = useCallback(() => {
        setRemoving(notifys.map((notify) => notify.id))
        setTimeout(() => {
            setNotifys([])
            setRemoving([])
            clear_notify()
        }, 300)
    }, [notifys])

    useEffect(() => {
        fetchNotifyList()
    }, [fetchNotifyList])

    return { notifys, removing, handleClose, handleClearAll, fetchNotifyList }
}

function useWindowWidth() {
    const [windowWidth, setWindowWidth] = useState(window.innerWidth)

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth)
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [])

    return windowWidth
}

function NotifyCenter() {
    const { t } = useTranslation()
    const { notifys, removing, handleClose, handleClearAll } = useNotifications()
    const windowWidth = useWindowWidth()
    const useCustomNotifyPanel = getSettings("notify_card") === "1"

    const renderNotification = ({ id, title, content, type, time }) => {
        const commonProps = {
            key: id,
            className: removing.includes(id) ? "slide-out" : "",
        }

        if (useCustomNotifyPanel) {
            return (
                <Collapse.Panel
                    {...commonProps}
                    header={title}
                    itemKey={id}
                    showArrow={false}
                    extra={
                        <Space>
                            <Tag color="violet" type="ghost" style={{ margin: 0 }}>
                                {type}
                            </Tag>
                            <Tag color="cyan" prefixIcon={<IconClock style={{ color: "cyan" }} />} type="ghost" style={{ margin: 0 }}>
                                {time}
                            </Tag>
                        </Space>
                    }
                >
                    <Banner
                        fullMode={false}
                        title={title}
                        description={<Space vertical>{content}</Space>}
                        type={type}
                        onClose={() => handleClose(id)}
                        style={{ marginBottom: "12px", transition: "all 0.3s ease" }}
                    />
                </Collapse.Panel>
            )
        } else {
            return (
                <CustomNotifyPanel
                    {...commonProps}
                    title={title}
                    message={content}
                    showTime={time}
                    type={type}
                    id={id}
                    onClose={() => handleClose(id)}
                />
            )
        }
    }

    return (
        <div style={{ padding: "16px", position: "relative" }}>
            <Collapse className="Notify_center_Conner" accordion>
                <AnimatePresence>
                    {notifys.length > 0 ? (
                        notifys.map((notify) => (
                            <motion.div
                                key={notify.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 20 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                {renderNotification(notify)}
                            </motion.div>
                        ))
                    ) : (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{ textAlign: "center", color: "var(--semi-color-text-2)" }}
                        >
                            {t("No_notifications_available")}
                        </motion.p>
                    )}
                </AnimatePresence>
            </Collapse>
            {notifys.length > 0 && (
                <IconButton
                    theme="light"
                    icon={<IconClose />}
                    style={{
                        left: windowWidth / 2 - 20,
                        bottom: "10%",
                        zIndex: 9999,
                        position: "fixed",
                        borderRadius: "20px",
                        backgroundColor: "var(--semi-color-bg-4)",
                    }}
                    onClick={handleClearAll}
                />
            )}
        </div>
    )
}

export default NotifyCenter

