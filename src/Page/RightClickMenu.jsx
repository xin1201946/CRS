import { useEffect, useState } from 'react';
import { Button, Col, Dropdown, List, Row, SideSheet } from '@douyinfe/semi-ui';
import { IconCopy, IconRefresh } from '@douyinfe/semi-icons';
import { send_notify } from '../code/SystemToast.jsx';
import { FooterPage } from '../Footer/Footer.jsx';
import { Settings } from './Settings.jsx';
import { get_language, set_language } from "../code/language.js";
import { emit } from "../code/PageEventEmitter.js";
import { getSetTheme, setAutoTheme, setDarkTheme, setLightTheme } from "../code/theme_color.js";
import { MdHdrAuto, MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { getSettings } from "../code/Settings.js";
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/prop-types
export default function CustomContextMenu({ x, y, visible }) {
    const [settingP_visible, set_settingP_Visible] = useState(false);
    const [settingThemeIcon, set_ThemeIcon] = useState(<MdHdrAuto style={{ width: '20px', height: '20px' }} />);
    const [menuPosition, setMenuPosition] = useState({ x, y }); // 右键菜单的初始位置
    const { t } = useTranslation();
    // 初始化主题图标
    useEffect(() => {
        window.addEventListener('themeChange', initialThemeIcon);
        // 清理事件监听器
        return () => {
            window.removeEventListener('themeChange', initialThemeIcon);
        };
    }, []);

    const initialThemeIcon = () => {
        if (getSettings('theme_color') === 'light') {
            set_ThemeIcon(<MdOutlineLightMode style={{ width: '20px', height: '20px' }} />);
        } else if (getSettings('theme_color') === 'dark') {
            set_ThemeIcon(<MdOutlineDarkMode style={{ width: '20px', height: '20px' }} />);
        } else if (getSettings('theme_color') === 'auto') {
            set_ThemeIcon(<MdHdrAuto style={{ width: '20px', height: '20px' }} />);
        }
    };

    const s_side_sheet_change = () => {
        set_settingP_Visible(prevState => !prevState);
    };

    function switchDarkMode() {
        const currentTheme = getSetTheme();
        if (currentTheme === 'dark') {
            setAutoTheme();
            set_ThemeIcon(<MdHdrAuto style={{ width: '20px', height: '20px' }} />);
        } else if (currentTheme === 'light') {
            setDarkTheme();
            set_ThemeIcon(<MdOutlineDarkMode style={{ width: '20px', height: '20px' }} />);
        } else if (currentTheme === 'auto') {
            setLightTheme();
            set_ThemeIcon(<MdOutlineLightMode style={{ width: '20px', height: '20px' }} />);
        }
    }

    useEffect(() => {
        // 计算菜单位置，确保菜单不显示在视窗外
        const updateMenuPosition = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const menuWidth = 200; // 菜单宽度，根据实际菜单宽度调整
            const menuHeight = 150; // 菜单高度，根据实际菜单高度调整

            // 检查菜单是否超出右侧边界
            let newX = x;
            if (x + menuWidth > windowWidth) {
                newX = windowWidth - menuWidth - 10; // 10是边距，确保不紧贴边界
            }

            // 检查菜单是否超出下侧边界
            let newY = y;
            if (y + menuHeight > windowHeight) {
                newY = windowHeight - menuHeight - 10;
            }

            setMenuPosition({ x: newX, y: newY });
        };

        updateMenuPosition(); // 初始化时计算位置

        // 在窗口大小变化时重新计算位置
        window.addEventListener('resize', updateMenuPosition);
        return () => {
            window.removeEventListener('resize', updateMenuPosition);
        };
    }, [x, y]);

    if (!visible) {
        return null;
    }

    const langmenu = [
        { node: 'item', name: '中文', type: 'primary', active: get_language() === 1, onClick: () => set_language(1) },
        { node: 'item', name: 'English', type: 'primary', active: get_language() === 2, onClick: () => set_language(2) },
    ];

    const uimenu = [
        { node: 'item', name: t('Console'), type: 'primary', onClick: () => emit('changePage', 'console') },
        { node: 'item', name: t('Vision'), type: 'primary', onClick: () => emit('changePage', 'vision') },
        { node: 'item', name: t('Settings'), type: 'primary', onClick: () => s_side_sheet_change() },
    ];

    const handleCopy = () => {
        const selectedText = window.getSelection().toString();
        if (selectedText) {
            navigator.clipboard.writeText(selectedText)
                .then(() => {
                    send_notify(t('New_Notify_Send'), t('Copy successful'));
                })
                .catch(err => {
                    console.error('复制失败', err);
                    send_notify(t('New_Notify_Send'), t('Copy failed'));
                });
        }
    };

    return (
        <div
            className="grid"
            style={{
                position: 'absolute',
                top: menuPosition.y,
                left: menuPosition.x,
                backgroundColor: 'var(--semi-color-bg-1)',
                padding: '10px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: 'inline-block',
                minWidth: '100px',
                zIndex: 1001,
            }}
            onClick={(e) => {
                e.stopPropagation(); // 阻止事件冒泡，避免触发 onClose
            }}
        >
            <Row>
                <Col span={8}>
                    <Button theme="borderless" onClick={() => window.location.reload()} icon={<IconRefresh />} aria-label={t('Refresh')} />
                </Col>
                <Col span={8}>
                    <Button theme="borderless" onClick={handleCopy} icon={<IconCopy />} aria-label={t('Copy')} />
                </Col>
                <Col span={8}>
                    <Button theme="borderless" icon={settingThemeIcon} onClick={switchDarkMode} aria-label={t('Theme_color')} />
                </Col>
            </Row>

            <br />
            <Dropdown.Menu tabIndex={-1}>
                <Dropdown.Item style={{ borderRadius: '10px' }}>
                    <Dropdown trigger={'hover'} showTick position={'right'} menu={uimenu}>
                        <div style={{ cursor: 'pointer' }}>{t('Switch page')}</div>
                    </Dropdown>
                </Dropdown.Item>
                <Dropdown.Item style={{ borderRadius: '10px' }}>
                    <Dropdown trigger={'hover'} showTick position={'right'} menu={langmenu}>
                        <div style={{ cursor: 'pointer' }}>{t('Regional language')}</div>
                    </Dropdown>
                </Dropdown.Item>
            </Dropdown.Menu>

            <SideSheet
                closeOnEsc={true}
                style={{ maxWidth: '100%', fontFamily: 'var(--Default-font)' }}
                title="Settings"
                visible={settingP_visible}
                onCancel={s_side_sheet_change}
                footer={<FooterPage />}
            >
                <Settings />
            </SideSheet>
        </div>
    );
}
