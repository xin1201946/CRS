import {
    useCallback,
    useContext,
    useMemo,
    useSyncExternalStore,
    createContext,
    useEffect
} from "react";
import {ConfigProvider} from "@douyinfe/semi-ui";
import {Moon, Palette, Sun, SunMoon} from "lucide-react";
import {getSettings, setSettings} from "./Settings.js";
import {add_log} from "./log.js";
import PropTypes from "prop-types";

const hasWindow = typeof window !== "undefined";
const hasDocument = typeof document !== "undefined";

const defaultThemeConfig = {
    themeMode: "auto", // light | dark | auto
    primaryColor: "#415CF7",
    backgroundColor: "#f5f7fb",
    backgroundImage: "",
    iconSet: "lucide", // lucide | emoji
    presetTheme: "default",
    allowModeSwitch: true,
};

const THEME_PRESETS = {
    default: {
        label: "Default",
        allowModeSwitch: true,
        defaultMode: "auto",
        config: {
            primaryColor: "#415CF7",
            backgroundColor: "#f5f7fb",
            backgroundImage: "",
            iconSet: "lucide",
        },
    },
    halloween: {
        label: "Halloween",
        allowModeSwitch: false,
        defaultMode: "dark",
        config: {
            primaryColor: "#f97316",
            backgroundColor: "#0b0b0f",
            backgroundImage: "",
            iconSet: "emoji",
        },
    },
    "new-year": {
        label: "New Year",
        allowModeSwitch: true,
        defaultMode: "light",
        config: {
            primaryColor: "#d00000",
            backgroundColor: "#fff7e6",
            backgroundImage: "",
            iconSet: "lucide",
        },
    },
};

const HOLIDAY_MAP = {
    "12-25": {id: "christmas", className: "holiday-christmas", label: "Christmas"},
    "01-01": {id: "new-year", className: "holiday-new-year", label: "New Year"},
    "02-10": {id: "spring-festival", className: "holiday-spring", label: "Spring Festival"},
};

const iconSets = {
    lucide: {
        Auto: SunMoon,
        Sun,
        Moon,
        Primary: Palette,
    },
    emoji: {
        Auto: (props) => <span aria-hidden {...props}>🌗</span>,
        Sun: (props) => <span aria-hidden {...props}>☀️</span>,
        Moon: (props) => <span aria-hidden {...props}>🌙</span>,
        Primary: (props) => <span aria-hidden {...props}>🎨</span>,
    }
};

const subscribers = new Set();
const mediaQuery = hasWindow ? window.matchMedia("(prefers-color-scheme: dark)") : {
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
};
let mediaAttached = false;

function safeMergeThemeConfig(base, patch = {}) {
    const presetName = patch.presetTheme || base.presetTheme || defaultThemeConfig.presetTheme;
    const preset = THEME_PRESETS[presetName] || THEME_PRESETS.default;
    const nextMode =
        patch.themeMode ??
        (preset.allowModeSwitch ? (base.themeMode ?? defaultThemeConfig.themeMode) : preset.defaultMode);
    const merged = {
        ...preset.config,
        ...base,
        ...patch,
        themeMode: nextMode,
        presetTheme: presetName,
        allowModeSwitch: preset.allowModeSwitch,
    };
    return {
        ...merged,
        iconSet: merged.iconSet && iconSets[merged.iconSet] ? merged.iconSet : defaultThemeConfig.iconSet,
    };
}

function hydrateThemeConfig() {
    const saved = getSettings("theme_config", true);
    if (saved && typeof saved === "object") {
        const merged = safeMergeThemeConfig(defaultThemeConfig, saved);
        return {
            ...merged,
            backgroundColor: merged.backgroundColor?.startsWith("var(") ? defaultThemeConfig.backgroundColor : merged.backgroundColor,
        };
    }
    const legacyMode = getSettings("theme_color");
    if (legacyMode) {
        return safeMergeThemeConfig(defaultThemeConfig, {themeMode: legacyMode});
    }
    return {...defaultThemeConfig};
}

let currentConfig = hydrateThemeConfig();
let resolvedMode = resolveMode(currentConfig);
let holidayInfo = detectHoliday();
let snapshot = createSnapshot();

function resolveMode(config) {
    if (config.themeMode === "auto") {
        return mediaQuery.matches ? "dark" : "light";
    }
    return config.themeMode === "dark" ? "dark" : "light";
}

function detectHoliday(date = new Date()) {
    const key = `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
    return HOLIDAY_MAP[key] || null;
}

function createSnapshot() {
    return {config: currentConfig, resolvedMode, holiday: holidayInfo};
}

function refreshSnapshot() {
    snapshot = createSnapshot();
}

function applyHolidayLayer(info) {
    if (!hasDocument) return;
    const body = document.body;
    if (info) {
        body.dataset.holiday = info.id;
    } else {
        delete body.dataset.holiday;
    }
}

function applyCssVariables(config) {
    if (!hasDocument) return;
    const root = document.documentElement;
    root.style.setProperty("--primary-color", config.primaryColor);
    root.style.setProperty("--semi-color-primary", config.primaryColor);
    root.style.setProperty("--app-bg", config.backgroundColor);
    root.style.setProperty("--app-bg-image", config.backgroundImage ? `url("${config.backgroundImage}")` : "none");
    document.body.style.backgroundColor = config.backgroundColor;
    document.body.style.backgroundImage = config.backgroundImage ? `url("${config.backgroundImage}")` : "";
}

function applyThemeConfig(config) {
    if (hasDocument) {
        resolvedMode === "dark"
            ? document.body.setAttribute("theme-mode", "dark")
            : document.body.removeAttribute("theme-mode");
    }
    applyCssVariables(config);
    applyHolidayLayer(holidayInfo);
    setSettings("theme_color", config.themeMode);
    setSettings("theme_config", config, true);
    if (hasWindow) {
        window.dispatchEvent(new CustomEvent("themeChange", {detail: resolvedMode}));
    }
}

function handleMediaChange(event) {
    if (currentConfig.themeMode === "auto") {
        resolvedMode = event.matches ? "dark" : "light";
        applyThemeConfig(currentConfig);
        notify();
    }
}

function ensureMediaListener() {
    if (currentConfig.themeMode === "auto" && !mediaAttached) {
        mediaQuery.addEventListener("change", handleMediaChange);
        mediaAttached = true;
    } else if (currentConfig.themeMode !== "auto" && mediaAttached) {
        mediaQuery.removeEventListener("change", handleMediaChange);
        mediaAttached = false;
    }
}

function notify() {
    subscribers.forEach((fn) => fn());
}

function subscribe(listener) {
    subscribers.add(listener);
    return () => subscribers.delete(listener);
}

function getSnapshot() {
    return snapshot;
}

function updateThemeConfig(partial = {}) {
    currentConfig = safeMergeThemeConfig(currentConfig, partial);
    resolvedMode = resolveMode(currentConfig);
    holidayInfo = detectHoliday();
    ensureMediaListener();
    applyThemeConfig(currentConfig);
    refreshSnapshot();
    add_log("ThemeManager:update", "successfully", JSON.stringify({...partial, resolvedMode}));
    notify();
    return currentConfig;
}

function getIconSet(name) {
    return iconSets[name] || iconSets.lucide;
}

function resolveIcon(name, iconSetName) {
    const set = getIconSet(iconSetName);
    return set[name] || getIconSet("lucide")[name] || Sun;
}

const ThemeContext = createContext(null);

function useThemeState() {
    const snapshot = useSyncExternalStore(subscribe, getSnapshot);
    const setThemeMode = useCallback((mode) => updateThemeConfig({themeMode: mode}), []);
    const updateTheme = useCallback((next) => updateThemeConfig(next), []);

    return useMemo(() => {
        return {
            ...snapshot,
            setThemeMode,
            updateTheme,
            icons: getIconSet(snapshot.config.iconSet),
            resolveIcon: (name) => resolveIcon(name, snapshot.config.iconSet),
        };
    }, [snapshot, setThemeMode, updateTheme]);
}

export function ThemeProvider({children, locale}) {
    const themeState = useThemeState();

    useEffect(() => {
        applyThemeConfig(currentConfig);
    }, []);

    const memoValue = useMemo(() => themeState, [themeState]);

    return (
        <ThemeContext.Provider value={memoValue}>
            <ConfigProvider
                theme={themeState.resolvedMode}
                locale={locale}
                style={{
                    "--semi-color-primary": themeState.config.primaryColor,
                    "--primary-color": themeState.config.primaryColor
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    const fallback = useThemeState();
    return context || fallback;
}

export function setDarkTheme() {
    updateThemeConfig({themeMode: "dark"});
}

export function setLightTheme() {
    updateThemeConfig({themeMode: "light"});
}

export function setAutoTheme() {
    updateThemeConfig({themeMode: "auto"});
}

export function queck_change_theme(str) {
    if (str === "light") {
        setLightTheme();
    } else if (str === "dark") {
        setDarkTheme();
    }
}

export function getTheme() {
    return resolvedMode;
}

export function getSetTheme() {
    return currentConfig.themeMode;
}

export function getThemeConfig() {
    return currentConfig;
}

export function updateTheme(partial) {
    return updateThemeConfig(partial);
}

export function getThemePresets() {
    return THEME_PRESETS;
}

applyThemeConfig(currentConfig);
ensureMediaListener();

ThemeProvider.propTypes = {
    children: PropTypes.node,
    locale: PropTypes.any
};
