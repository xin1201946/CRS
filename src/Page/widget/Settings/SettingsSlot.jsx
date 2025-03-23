import React, {Suspense} from 'react';
import { Spin } from '@douyinfe/semi-ui';
import { motion, AnimatePresence } from 'framer-motion';

const LoadingFallback = () => (
    <div className="flex items-center justify-center h-full">
        <Spin size="large" />
    </div>
);

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="p-8 text-center">
                    <h3 className="text-xl text-red-500 mb-4">ERROR</h3>
                    <p className="text-gray-600">Page Rendering Error</p>
                </div>
            );
        }
        return this.props.children;
    }
}

const SettingsSlot = ({
                          component: Component,
                          transition = true,
                          backgroundColor = 'white',
                          textColor = 'black',
                      }) => {
    const pageTransition = {
        initial: { opacity: 0, y: 50 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 30,
                mass: 1
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.2
            }
        }
    };

    return (
        <div>
            <ErrorBoundary>
                <Suspense fallback={<LoadingFallback />}>
                    <AnimatePresence mode="wait">
                        <motion.div
                            {...(transition ? pageTransition : {})}
                            style={{
                                backgroundColor,
                                color: textColor,
                                margin:"10px",
                                height: '80vh',
                            }}
                            className="bg-white rounded-lg shadow-sm"

                        >
                            <Component />
                        </motion.div>
                    </AnimatePresence>
                </Suspense>

            </ErrorBoundary>
        </div>
    );
};

export default SettingsSlot;