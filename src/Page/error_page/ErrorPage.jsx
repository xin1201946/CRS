import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {t} from "i18next";

const ErrorPage = ({
                       code = 404,
                       title = "Page Not Found",
                       description = "The page you're looking for doesn't exist or has been moved."
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

    return (
        <div className="min-h-screen bg-[semi-color-bg-2] flex items-center justify-center p-4">
            <motion.div
                className="max-w-md w-full text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div variants={itemVariants} className="mb-8">
                    <AlertCircle className="w-24 h-24 mx-auto text-error" />
                </motion.div>

                <motion.h1
                    variants={itemVariants}
                    className="text-7xl font-bold text-error mb-4"
                >
                    {code}
                </motion.h1>

                <motion.h2
                    variants={itemVariants}
                    className="text-2xl font-semibold mb-4"
                >
                    {title}
                </motion.h2>

                <motion.p
                    variants={itemVariants}
                    className="text-base-content/70 mb-8"
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
                        onClick={() => navigate('/')}
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

export default ErrorPage;