import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

const ContextMenuContext = createContext(undefined);

export const ContextMenuProvider = ({ children }) => {
    const [contextMenu, setContextMenu] = useState({ x: 0, y: 0, visible: false, target: null });

    const showContextMenu = (event) => {
        event.preventDefault();
        const { clientX, clientY } = event;
        const { innerWidth, innerHeight } = window;

        // 假设菜单的宽度为200px，高度为300px
        const menuWidth = 200;
        const menuHeight = 300;

        // 调整 x 和 y 坐标以确保菜单不会超出屏幕边界
        const x = Math.min(clientX, innerWidth - menuWidth);
        const y = Math.min(clientY, innerHeight - menuHeight);

        setContextMenu({ x, y, visible: true, target: event.target });
    };

    const hideContextMenu = () => {
        setContextMenu(prev => ({ ...prev, visible: false }));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (contextMenu.visible && !event.target.closest('.context-menu')) {
                hideContextMenu();
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => {
            document.removeEventListener('click', handleClickOutside);
        };
    }, [contextMenu.visible]);

    return (
        <ContextMenuContext.Provider value={{ contextMenu, showContextMenu, hideContextMenu }}>
            {children}
        </ContextMenuContext.Provider>
    );
};

ContextMenuProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export const useContextMenu = () => {
    const context = useContext(ContextMenuContext);
    if (context === undefined) {
        throw new Error('useContextMenu must be used within a ContextMenuProvider');
    }
    return context;
};

