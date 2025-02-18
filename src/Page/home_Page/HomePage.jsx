import {SideSheet, Space} from "@douyinfe/semi-ui";
import {emit} from "../../code/PageEventEmitter.js";
import React, {useState} from "react";
import {Settings} from "../Settings.jsx";
import Logs_Viewer from "../settings_page/Logs_Viewer.jsx";
import {useTranslation} from 'react-i18next';
import "./Homepage.css"


function HomePage() {
    const { t } = useTranslation();
    const [setPagevisible, setPagechange] = useState(false);
    const setchange = () => {
        setPagechange(!setPagevisible);
    };
    const [Logvisible, setlogPagechange] = useState(false);
    const logchange = () => {
        setlogPagechange(!Logvisible);
    };
    function changeSelectKey() {
        emit('changePage', 'vision')
    }
    function NewHomePage() {


        return (
            <div className="scroll-smooth">

                {/* 页面内容 */}
                <HeroSection />
                <FeaturesSection />
                {/* 页脚 */}
                <footer   className="footer footer-center p-10  semi-color-text-0">
                    <aside>
                        <p>Copyright © {new Date().getFullYear()} - All rights reserved by CCRS Team</p>
                        <p className="textarea-sm text-gray-300 ">
                            {t('Tip_Homepage_footer')}
                        </p>
                    </aside>
                </footer>

            </div>
        );
    }


// Hero 区块
    const HeroSection = React.memo(function HeroSection() {

        return (
            <section id="hero" className="min-h-screen flex items-center justify-center">
                <div
                    className="fixed inset-0 flex items-center justify-center pointer-events-none"
                    style={{
                        zIndex: -1, // 确保背景在内容之下
                    }}
                >
                    <div
                        className="w-[300px] h-[300px] rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 blur-[200px]"
                        style={{
                            position: "fixed",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                        }}
                    ></div>
                </div>
                <div className="text-center max-w-4xl px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <Space vertical>
                            <span>{t('Tip_Homepage_title_1')} </span>
                            <p className="text-primary"> {t('Tip_Homepage_title_2')}</p>
                        </Space>
                    </h1>
                    <p className="text-xl text-gray-500 mb-8">
                        {t('Tip_Homepage_title_3')}
                    </p>
                    <Space vertical>
                        <button className="btn  btn-primary btn-lg" onClick={changeSelectKey}>{t('Start_OCR')}</button>
                        <Space>
                            <button className="btn btn-ghost" onClick={setchange}>{t('Change_Settings')}</button>
                            <button className="btn btn-ghost" onClick={logchange}>{t('Check_logs')}</button>
                        </Space>
                    </Space>
                </div>
            </section>
        );
    });

// Features 区块
    const FeaturesSection = React.memo(function FeaturesSection() {
        return (
            <section id="features" className="py-20 bg-auto relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">{t('Features')}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            title={t('Model tunable training')}
                            icon="⚙️"
                        >   {t('Tip_Homepage_1')}
                        </FeatureCard>
                        <FeatureCard
                            title={t('High recognition accuracy')}
                            icon="🎯"
                        >
                            {t('Tip_Homepage_2')}
                        </FeatureCard>
                        <FeatureCard
                            title={t('Fast image recognition')}
                            icon="🚀"
                        >
                            {t('Tip_Homepage_3')}
                        </FeatureCard>
                    </div>
                </div>
            </section>
        );
    });

// 单个 Feature 卡片
    // eslint-disable-next-line react/prop-types
    function FeatureCard({ title, icon, children }) {

        return (
            <div className="card semi-color-bg-4 shadow-xl">
                <div className="card-body items-center text-center">
                    <div className="text-6xl mb-4">{icon}</div>
                    <h3 className="card-title text-2xl mb-2">{title}</h3>
                    <p>{children}</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <NewHomePage></NewHomePage>
            <br/>
            <br/>
            <SideSheet style={{maxWidth:"100%"}} title={t('Settings')} visible={setPagevisible} onCancel={setchange} placement={'right'}>
                <Settings/>
            </SideSheet>
            <SideSheet style={{width:'100%'}} title={t('Log_viewer')} visible={Logvisible} onCancel={logchange} placement={'right'}>
                <Logs_Viewer/>
            </SideSheet>
        </>

    );
}
export default HomePage