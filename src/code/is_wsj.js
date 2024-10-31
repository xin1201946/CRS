export const isHalloweenPeriod = () => {
        const now = new Date();
        const halloween = new Date(now.getFullYear(), 9, 31);  // 万圣节日期
        const halloweenStart = new Date(halloween.getTime() - 15 * 24 * 60 * 60 * 1000);  // 万圣节前15天
        const halloweenEnd = new Date(halloween.getTime() + 15 * 24 * 60 * 60 * 1000);    // 万圣节后15天
        return now >= halloweenStart && now <= halloweenEnd;
};