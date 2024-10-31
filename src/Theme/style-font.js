export const changeFont = (newFontEN='HalloweenEN',newFontCN='HalloweenCN') => {
    document.documentElement.style.setProperty('--Theme-font', newFontEN);
    document.documentElement.style.setProperty('--Default-font', newFontCN);
};