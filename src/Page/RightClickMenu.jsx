import { useEffect, useState } from 'react';
import { Button, Col, Dropdown, Row, SideSheet } from '@douyinfe/semi-ui';
import { IconCopy, IconRefresh, IconEdit, IconDelete } from '@douyinfe/semi-icons';
import { send_notify } from '../code/SystemToast.jsx';
import { FooterPage } from '../Footer/Footer.jsx';
import { Settings } from './Settings.jsx';
import { get_language, set_language } from "../code/language.js";
import { emit } from "../code/PageEventEmitter.js";
import { getSetTheme, setAutoTheme, setDarkTheme, setLightTheme } from "../code/theme_color.js";
import { MdHdrAuto, MdOutlineDarkMode, MdOutlineLightMode } from "react-icons/md";
import { getSettings } from "../code/Settings.js";
import { useTranslation } from 'react-i18next';
import { useContextMenu } from '../contexts/ContextMenuContext';

export default function CustomContextMenu() {
    const { contextMenu} = useContextMenu();
    const [settingP_visible, set_settingP_Visible] = useState(false);
    const [settingThemeIcon, set_ThemeIcon] = useState(<MdHdrAuto style={{ width: '20px', height: '20px' }} />);
    const { t } = useTranslation();

    useEffect(() => {
        window.addEventListener('themeChange', initialThemeIcon);
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

    if (!contextMenu.visible) {
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
        const selectedText = window.getSelection()?.toString();
        if (selectedText) {
            navigator.clipboard.writeText(selectedText)
                .then(() => {
                    send_notify(t('New_Notify_Send'), t('Copy successful'));
                })
                .catch(err => {
                    send_notify(t('Copy failed'), err);
                });
        }
    };

    const handleCut = () => {
        const selectedText = window.getSelection()?.toString();
        if (selectedText && contextMenu.target instanceof HTMLInputElement) {
            navigator.clipboard.writeText(selectedText)
                .then(() => {
                    const start = contextMenu.target.selectionStart || 0;
                    const end = contextMenu.target.selectionEnd || 0;
                    contextMenu.target.setRangeText('', start, end, 'end');
                    send_notify(t('New_Notify_Send'), t('Cut successful'));
                })
                .catch(err => {
                    send_notify(t('Cut failed'),err);
                });
        }
    };

    const handlePaste = () => {
        if (contextMenu.target instanceof HTMLInputElement) {
            navigator.clipboard.readText()
                .then(text => {
                    const start = contextMenu.target.selectionStart || 0;
                    const end = contextMenu.target.selectionEnd || 0;
                    contextMenu.target.setRangeText(text, start, end, 'end');
                    send_notify(t('New_Notify_Send'), t('Paste successful'));
                })
                .catch(err => {
                    send_notify(t('Paste failed'), err);
                });
        }
    };

    const getDynamicMenuItems = () => {
        if (contextMenu.target instanceof HTMLInputElement || contextMenu.target instanceof HTMLTextAreaElement) {
            return [
                { node: 'item', name: t('Cut'), icon: <IconDelete />, onClick: handleCut },
                { node: 'item', name: t('Copy'), icon: <IconCopy />, onClick: handleCopy },
                { node: 'item', name: t('Paste'), icon: <IconEdit />, onClick: handlePaste },
            ];
        }
        return [

        ];
    };

    return (
        <div
            className="grid"
            style={{
                position: 'fixed',
                top: `${contextMenu.y}px`,
                left: `${contextMenu.x}px`,
                backgroundColor: 'var(--semi-color-bg-1)',
                padding: '10px',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                display: contextMenu.visible ? 'inline-block' : 'none',
                minWidth: '100px',
                zIndex: 1001,
            }}
            onClick={(e) => {
                e.stopPropagation();
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
                {getDynamicMenuItems().map((item, index) => (
                    <Dropdown.Item key={index} style={{ borderRadius: '10px' }} icon={item.icon} onClick={item.onClick}>
                        {item.name}
                    </Dropdown.Item>
                ))}
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