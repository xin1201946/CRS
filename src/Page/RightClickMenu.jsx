import {useEffect, useRef, useState} from 'react';
import {ChevronRight} from 'lucide-react';
import "./RightClickMenu.css"

// eslint-disable-next-line react/prop-types
const MenuList = ({ items, isSubmenu = false, onClose }) => {
    const [activeSubmenu, setActiveSubmenu] = useState(null);
    const timeoutRef = useRef();

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
        <div className={`bg-[--semi-color-bg-0] text-sm rounded-lg shadow-lg py-2 min-w-[200px] ${
            isSubmenu ? 'absolute left-full top-0 ml-1' : ''
        }`}
        >
            {/* eslint-disable-next-line react/prop-types */}
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
                        <span className="flex-grow" style={{color:"var(--semi-color-text-0)"}}>{item.label}</span>
                        {item.rightElement && (
                            <div className="ml-4">{item.rightElement}</div>
                        )}
                        {item.subItems && (
                            <ChevronRight className="w-4 h-4 ml-2 text-gray-400" />
                        )}
                    </div>
                    {item.subItems && activeSubmenu === index && (
                        <MenuList
                            items={item.subItems}
                            isSubmenu={true}
                            onClose={onClose}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

// eslint-disable-next-line react/prop-types
function RightClickMenu ({ items, x, y, onClose }) {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };

        // 使用 mousedown 而不是 click，以确保在拖动时也能正确处理
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [onClose]);

    return (
        <div
            ref={menuRef}
            className="context-menu-animation"
            style={{
                textAlign: 'left',
                position: 'fixed',
                left: x,
                top: y,
                zIndex: 99999,
            }}
            onClick={(e) => e.stopPropagation()} // 阻止点击事件冒泡
        >
            <MenuList items={items} onClose={onClose} />
        </div>
    );
};

export default RightClickMenu