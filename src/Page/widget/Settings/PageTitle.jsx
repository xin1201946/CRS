import React from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import {detectDevice} from "../../../code/check_platform.js";

const PageTitle = ({ title, scrollContainer }) => {
    const scrollYValue = useMotionValue(0); // 使用 MotionValue 跟踪滚动位置

    React.useEffect(() => {
        const containerElement = scrollContainer?.current;
        if (!containerElement) {
            return;
        }

        const handleScroll = () => {
            const scrollTop = containerElement.scrollTop;
            scrollYValue.set(scrollTop);
        };

        console.log('Adding scroll listener');
        containerElement.addEventListener('scroll', handleScroll);
        return () => {
            containerElement.removeEventListener('scroll', handleScroll);
        };
    }, [scrollContainer]);

    // 主标题：0-100px 逐渐消失
    const normalTitleOpacity = useTransform(scrollYValue, [0, 50], [1, 0]);
    const stickyTitleOpacity = useTransform(scrollYValue, [50, 150], [0, 1], { clamp: true });
    // 容器高度：0-200px 从 40vh 缩小到 10vh
    const containerHeight = useTransform(scrollYValue, [0, 200], ['15vh', '10vh']);
    const calculateLeftOffset = (title, device) => {
        if (device === "Phone") {
            return `calc(44% - ${title.length}px)`;
        } else {
            return "50%";
        }
    };
    const leftOffset = calculateLeftOffset(title, detectDevice());
    return (
        <>
            {/* 占位容器 */}
            <motion.div
                style={{
                    height: containerHeight,
                    position: 'relative',
                    pointerEvents: 'none',
                    zIndex: 10
                }}
            >
                {/* 主标题：居中显示 */}
                <motion.h1
                    style={{
                        position: 'absolute',
                        top: '60%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        margin: 0,
                        fontSize: '2rem',
                        opacity: normalTitleOpacity,
                        whiteSpace: 'nowrap',
                        textAlign: 'left' // 可选，确保文字左对齐
                    }}
                >
                    {title}
                </motion.h1>
            </motion.div>
            {/* 次级标题：相对于容器左上角定位 */}
            <motion.h1
                style={{
                    position: 'absolute', // 改为 absolute，相对于 Content 容器
                    top: 16, // 距离容器顶部 16px
                    left: detectDevice() === "Phone" ?leftOffset:"50%", // 距离容器左侧 24px
                    margin: 0,
                    opacity: stickyTitleOpacity,
                    zIndex: 9999,
                    pointerEvents: 'none',
                    textAlign: 'center' // 确保左对齐
                }}
                className="text-sm"
            >
                {title}
            </motion.h1>
        </>
    );
};

export default PageTitle;