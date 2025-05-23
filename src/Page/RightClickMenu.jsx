import { useEffect, useRef, useState } from 'react';
import { ChevronRight } from 'lucide-react';
import './RightClickMenu.css';

// eslint-disable-next-line react/prop-types
const MenuList = ({ items, isSubmenu = false, onClose }) => {
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const timeoutRef = useRef();
    const menuRef = useRef(null);
    const [submenuPosition, setSubmenuPosition] = useState('right');

    // 检查子菜单位置并设置最佳显示方向
    const checkSubmenuPosition = () => {
        if (menuRef.current && isSubmenu) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const windowWidth = window.innerWidth;
            const submenuWidth = 200; // 子菜单的最小宽度

            if (menuRect.right + submenuWidth > windowWidth) {
                setSubmenuPosition('left');
            } else {
                setSubmenuPosition('right');
            }
        }
    };

    // 在组件挂载和更新时检查子菜单位置
    useEffect(() => {
        checkSubmenuPosition();
    }, []);

    const handleMouseEnter = (index) => {
        clearTimeout(timeoutRef.current);
        setActiveSubmenu(index);
    };

    const handleMouseLeave = () => {
        timeoutRef.current = setTimeout(() => {
            setActiveSubmenu(null);
        }, 100);
    };

    const handleClick = (e, item) => {
        e.stopPropagation(); // 阻止事件冒泡
        // 只有当点击的项目没有子菜单且有onClick处理函数时才执行
        if (!item.subItems && item.onClick) {
            item.onClick();
            onClose();
        }
    };

    return (
        <div
            ref={menuRef}
            className={` bg-[--semi-color-bg-1]  text-sm rounded-lg shadow-lg py-2 min-w-[200px] ${isSubmenu ? submenuPosition === 'right' ? 'absolute left-full top-0 ml-1' : 'absolute right-full top-0 mr-1' : ''}`}
        >
            {items.map((item, index) => (
                <div
                
                    key={index}
                    className="relative"
                    onMouseEnter={() => handleMouseEnter(index)}
                    onMouseLeave={handleMouseLeave}
                >
                    <div
                        className="px-4 py-2 hover:bg-[--semi-color-fill-0] flex items-center cursor-pointer"
                        onClick={(e) => handleClick(e, item)}
                    >
                        <div className="w-5 h-5 mr-3 flex items-center justify-center">
                            {item.icon}
                        </div>
                        <span className="flex-grow" style={{ color: 'var(--semi-color-text-0)' }}>
                            {item.label}
                        </span>
                        {item.rightElement && <div className="ml-4">{item.rightElement}</div>}
                        {item.subItems && (
                            <ChevronRight 
                                className={`w-4 h-4 ml-2 text-gray-400 ${submenuPosition === 'left' ? 'transform rotate-180' : ''}`} 
                            />
                        )}
                    </div>
                    {item.subItems && activeSubmenu === index && (
                        <MenuList items={item.subItems} isSubmenu={true} onClose={onClose} />
                    )}
                </div>
            ))}
        </div>
    );
};

// eslint-disable-next-line react/prop-types
function RightClickMenu({ items, x, y, onClose }) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    // 获取窗口的宽度和高度
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // 获取菜单的宽度和高度
    const [menuDimensions, setMenuDimensions] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (menuRef.current) {
            setMenuDimensions({
                width: menuRef.current.offsetWidth,
                height: menuRef.current.offsetHeight,
            });
        }
    }, [items]); // 如果 items 更新了，则重新计算菜单的宽高

    // 计算菜单的最终位置，确保不超出屏幕
    const adjustedX = Math.min(x, windowWidth - menuDimensions.width);
    const adjustedY = Math.min(y, windowHeight - menuDimensions.height);

    return (
        <div
            ref={menuRef}
            className="context-menu-animation "
            style={{
                textAlign: 'left',
                position: 'fixed',
                left: adjustedX,
                top: adjustedY,
                zIndex: 99999,
            }}
            onClick={(e) => e.stopPropagation()} // 阻止点击事件冒泡
        >
            <MenuList items={items} onClose={onClose} />
        </div>
    );
}

export default RightClickMenu;
