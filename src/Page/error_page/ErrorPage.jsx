import { motion } from 'framer-motion';
import { Ghost, ArrowLeft, Home, Copy,ArrowBigDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import {t} from "i18next";
import PropTypes from "prop-types";
import {add_log, saveLogsToTxt} from "../../code/log.js";

const ErrorPage = ({
                       code = 404,
                       title = "Page Not Found",
                       description = "The page you're looking for doesn't exist or has been moved.",
                       homeUrl = "/",
                       stackTrace = null // 新增可选的调用堆栈参数
                   }) => {
    const navigate = useNavigate();
    const [copied, setCopied] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.6,
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
    };

    const ghostVariants = {
        float: {
            y: [0, -20, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const handleCopy = () => {
        if (stackTrace) {
            navigator.clipboard.writeText(stackTrace);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const download_logs = () => {
        add_log("Error:","error","===========================================")
        add_log("userDownloadLogs:","info")
        add_log("stackTrace:","error",stackTrace?stackTrace:"NO ANY STACKTRACE FOUND")
        saveLogsToTxt()
    }

    return (
        <div className="min-h-screen bg-[semi-color-bg-2] flex items-center justify-center p-4">
            <motion.div
                className="max-w-2xl w-full text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    variants={ghostVariants}
                    animate="float"
                    className="mb-8 relative"
                >
                    <Ghost className="w-32 h-32 mx-auto text-primary" />
                    <motion.div
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl font-bold"
                        animate={{
                            rotate: [0, 10],
                        }}
                    >
                        {code}
                    </motion.div>
                </motion.div>

                <motion.h2
                    variants={itemVariants}
                    className="text-2xl font-semibold mb-4"
                >
                    {title}
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className="text-base-content/70 mb-8 text-semi-color-text-3"
                >
                    {description}
                </motion.p>

                {stackTrace && (
                    <motion.div
                        variants={itemVariants}
                        className="mb-8 max-w-xl mx-auto"
                    >
                        <div>
                            <p className="text-semi-color-text-3 mb-2">
                                {t("error_stackTrace")}
                            </p>
                        </div>
                        <div className="relative bg-gray-100  p-4 rounded-lg">
                            <div className="mockup-code w-full">
                                <pre data-prefix="$"><code>{stackTrace}</code></pre>
                            </div>
                            <button
                                onClick={handleCopy}
                                className="absolute top-2 right-2 btn btn-ghost btn-sm"
                            >
                                <Copy size={16} style={{color:"white"}}/>
                                {copied && (
                                    <span className="ml-1 text-xs">{t("Copied!")}</span>
                                )}
                            </button>
                        </div>
                    </motion.div>
                )}

                <motion.div
                    variants={itemVariants}
                    className="flex gap-4 justify-center"
                >
                    <button
                        onClick={() => navigate(-1)}
                        className="btn btn-outline gap-2"
                    >
                        <ArrowLeft size={20} />
                        {t("Go_Back")}
                    </button>

                    <button
                        onClick={() => navigate(homeUrl)}
                        className="btn btn-primary gap-2"
                    >
                        <Home size={20} />
                        {t("Home")}
                    </button>

                    <button
                        onClick={download_logs}
                        className="btn btn-primary gap-2"
                    >
                        <ArrowBigDown size={20} />
                        {t("Log_download")}
                    </button>
                </motion.div>
            </motion.div>
        </div>
    );
};

ErrorPage.propTypes = {
    code: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    homeUrl: PropTypes.string,
    stackTrace: PropTypes.string // 添加 stackTrace 的 prop 类型
};

export default ErrorPage;