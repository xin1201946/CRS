import {createHandlerBoundToURL, precacheAndRoute} from "workbox-precaching";
import {clientsClaim} from "workbox-core";
import {registerRoute} from "workbox-routing";
import {CacheFirst, StaleWhileRevalidate} from "workbox-strategies";
import {ExpirationPlugin} from "workbox-expiration";
import {CacheableResponsePlugin} from "workbox-cacheable-response";

clientsClaim();

const CACHE_VERSION = 'v2';  // 缓存版本控制
const imageCacheName = `images-cache-${CACHE_VERSION}`;
const apiCacheName = `api-cache-${CACHE_VERSION}`;

// 预缓存并路由
precacheAndRoute(self.__WB_MANIFEST);

// 文件扩展名正则表达式
const fileExtensionRegexp = new RegExp("/[^/?]+\\.[^/]+$");

// 路由匹配导航请求并返回 index.html
registerRoute(({ request, url }) => {
    if (request.mode !== "navigate") {
        return false;
    }
    if (url.pathname.startsWith("/_")) {
        return false;
    }
    if (url.pathname.match(fileExtensionRegexp)) {
        return false;
    }
    return true;
}, createHandlerBoundToURL(import.meta.env.BASE_URL + "/index.html")); // 使用 Vite 的 BASE_URL

// 图片缓存策略
registerRoute(
    ({ url }) => {
        const formatImages = [".jpeg", ".jpg", ".png", ".svg", ".gif"];
        const ifImage = formatImages.some((i) => url.pathname.endsWith(i));
        return url.origin === self.location.origin && ifImage;
    },
    new StaleWhileRevalidate({
        cacheName: imageCacheName,
        plugins: [new ExpirationPlugin({ maxEntries: 100 })], // 增加缓存条目
    })
);

// API 缓存策略
registerRoute(
    ({ url }) => url.origin === self.location.origin,
    new CacheFirst({
        cacheName: apiCacheName,
        plugins: [
            new CacheableResponsePlugin({
                statuses: [200],
            }),
        ],
    })
);

// 更新事件：跳过等待，立即激活
self.addEventListener("message", (event) => {
    if (event.data && event.data.type === "SKIP_WAITING") {
        self.skipWaiting();
    }
});
