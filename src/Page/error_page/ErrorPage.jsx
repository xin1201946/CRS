import { motion } from 'framer-motion';
import { Ghost, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import {t} from "i18next";
import PropTypes from "prop-types";

const ErrorPage = ({
                       code = 404,
                       title = "Page Not Found",
                       description = "The page you're looking for doesn't exist or has been moved.",
                       homeUrl = "/"
                   }) => {
    const navigate = useNavigate();

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

    return (
        <div className="min-h-screen bg-[semi-color-bg-2] flex items-center justify-center p-4">
            <motion.div
                className="max-w-md w-full text-center"
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
                </motion.div>
            </motion.div>
        </div>
    );
};

ErrorPage.propTypes = {
    code: PropTypes.number,
    title: PropTypes.string,
    description: PropTypes.string,
    homeUrl: PropTypes.string
};

export default ErrorPage;