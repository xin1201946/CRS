import {Workbox} from "workbox-window";

const register = () => {
    if (import.meta.env.MODE !== "production") return;  // 判断当前是否为生产环境

    if (navigator?.serviceWorker) {
        const wb = new Workbox(`${import.meta.env.BASE_URL}/service-worker.js`);
        const checkForUpdate = () => {
            const isUpdate = window.confirm("New Update Available. Click OK to update");
            if (isUpdate) {
                wb.messageSkipWaiting();
            }
        };
        wb.addEventListener("waiting", checkForUpdate);
        wb.register();
    }
};

export default register;
