import { Space} from "@douyinfe/semi-ui"
import { emit } from "../../code/PageEventEmitter.js"
import React, { useState, useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import "./Homepage.css"
import "./animations.css"
import {t} from "i18next";
import { Layers, Fingerprint,Puzzle, LayoutTemplate } from "lucide-react";
import {detectDevice} from "../../code/check_platform.js";
import {useNavigate} from "react-router-dom";

function OcrDemo() {

    const [analysisState, setAnalysisState] = useState("initial") // initial, detecting, zoomed
    const [showthird, setshowthird] = useState(false)
    const [showConfidence, setShowConfidence] = useState(false)
    const [isVisible, setIsVisible] = useState(window.innerWidth > 1200) // 初始判断

    useEffect(() => {
        if (analysisState === "detecting") {
            setTimeout(() => {
                setAnalysisState("zoomed")
                setTimeout(() => {
                    setshowthird(true)
                    setTimeout(() => {
                        setShowConfidence(true)
                    }, 2000)
                }, 2000)
            }, 2000)
        }
    }, [analysisState])

    useEffect(() => {
        // 监听窗口变化
        const handleResize = () => {
            setIsVisible(window.innerWidth > 1300)
        }
        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize) // 组件卸载时清理
    }, [])

    if (!isVisible) return null // 小于 1200px 时不渲染组件

    return (
        <div className="relative w-[84%] mx-auto">
            <div className="relative bg-[semi-color-bg-3] p-6 rounded-xl shadow-2xl">
                {/* Background blobs */}
                <div className="absolute -top-4 -right-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
                <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-secondary/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 right-20 w-72 h-72 bg-accent/30 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
                {/* Main content */}
                <div className="relative">
                    <div className="aspect-square relative overflow-hidden rounded-lg">
                        {analysisState === "zoomed" ? (
                            <>
                                <img
                                    src={showthird ? "./HOME3.jpg" : "./HOME2.jpg"}
                                    alt="Mechanical part (zoomed)"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0" style={{ display: showConfidence ? "grid" : "none" }}>
                                    <div className="absolute top-[25%] left-[24%] w-[40%] h-[25%] border-2 border-success rounded-md">
                                        {showConfidence && (
                                            <div className="absolute -top-8 left-0 bg-success/90 text-white px-2 py-1 rounded text-sm">
                                                1 (99.8%)
                                            </div>
                                        )}
                                    </div>
                                    <div className="absolute top-[43%] left-[30%] w-[40%] h-[25%] border-2 border-success rounded-md">
                                        {showConfidence && (
                                            <div className="absolute -top-8 left-0 bg-success/90 text-white px-2 py-1 rounded text-sm">
                                                1 (99.5%)
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <img
                                src="./HOME1.jpg"
                                alt="Mechanical part"
                                className={`transition-transform duration-1000 w-full h-full object-cover ${
                                    analysisState === "detecting" ? "scale-100" : "scale-100"
                                }`}
                            />
                        )}

                        {analysisState === "detecting" && (
                            <div className="absolute inset-0">
                                <div className="absolute top-[23%] left-[33%] w-[40px] h-[30px] border-2 border-primary rounded-md transition-all duration-500 animate-pulse"></div>
                            </div>
                        )}
                    </div>

                    {analysisState === "detecting" && (
                        <div className="mt-4 h-2 bg-base-300 rounded-full overflow-hidden">
                            <div className="h-full bg-primary animate-progress"></div>
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                        <div className="text-sm text-base-content/70">
                            {analysisState === "initial" && t("Tip_Homepage_jd_1")}
                            {analysisState === "detecting" && t("Tip_Homepage_jd_2")}
                            {analysisState === "zoomed" && t("Tip_Homepage_jd_3")}
                            {showConfidence && t("Tip_Homepage_jd_4")}
                        </div>
                        {analysisState === "initial" && (
                            <button
                                onClick={() => setAnalysisState("detecting")}
                                className="btn btn-primary btn-sm gap-2"
                            >
                                {t("Tip_Homepage_jd_button")}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

function HomePage() {
    const { t } = useTranslation()
    function changeSelectKey() {
        emit("changePage", "vision")
    }
    const navigate = useNavigate();
    // 动画背景组件
    const AnimatedBackground = React.memo(function AnimatedBackground() {
        const canvasRef = useRef(null)

        useEffect(() => {
            const canvas = canvasRef.current
            const ctx = canvas.getContext("2d")
            let animationFrameId

            // 设置canvas尺寸为窗口大小
            const resizeCanvas = () => {
                canvas.width = window.innerWidth
                canvas.height = window.innerHeight
            }

            window.addEventListener("resize", resizeCanvas)
            resizeCanvas()

            // 粒子类
            class Particle {
                constructor() {
                    this.x = Math.random() * canvas.width
                    this.y = Math.random() * canvas.height
                    this.size = Math.random() * 5 + 1
                    this.speedX = Math.random() * 1 - 0.5
                    this.speedY = Math.random() * 1 - 0.5
                    this.color = `rgba(${Math.floor(Math.random() * 100) + 155}, 
                                      ${Math.floor(Math.random() * 100) + 155}, 
                                      ${Math.floor(Math.random() * 100) + 155}, 
                                      0.3)`
                }

                update() {
                    this.x += this.speedX
                    this.y += this.speedY

                    if (this.x > canvas.width) this.x = 0
                    else if (this.x < 0) this.x = canvas.width

                    if (this.y > canvas.height) this.y = 0
                    else if (this.y < 0) this.y = canvas.height
                }

                draw() {
                    ctx.fillStyle = this.color
                    ctx.beginPath()
                    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
                    ctx.fill()
                }
            }

            // 创建粒子数组
            const particlesArray = []
            const numberOfParticles = 50

            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new Particle())
            }

            // 连接粒子的函数
            function connectParticles() {
                const maxDistance = 150
                for (let a = 0; a < particlesArray.length; a++) {
                    for (let b = a; b < particlesArray.length; b++) {
                        const dx = particlesArray[a].x - particlesArray[b].x
                        const dy = particlesArray[a].y - particlesArray[b].y
                        const distance = Math.sqrt(dx * dx + dy * dy)

                        if (distance < maxDistance) {
                            const opacity = 1 - distance / maxDistance
                            ctx.strokeStyle = `rgba(200, 200, 255, ${opacity * 0.2})`
                            ctx.lineWidth = 1
                            ctx.beginPath()
                            ctx.moveTo(particlesArray[a].x, particlesArray[a].y)
                            ctx.lineTo(particlesArray[b].x, particlesArray[b].y)
                            ctx.stroke()
                        }
                    }
                }
            }

            // 动画循环
            const animate = () => {
                ctx.clearRect(0, 0, canvas.width, canvas.height)

                // 绘制渐变背景
                const gradient = ctx.createRadialGradient(
                    canvas.width / 2,
                    canvas.height / 2,
                    0,
                    canvas.width / 2,
                    canvas.height / 2,
                    canvas.width / 2,
                )
                gradient.addColorStop(0, "rgba(70, 90, 180, 0.05)")
                gradient.addColorStop(0.5, "rgba(60, 70, 130, 0.03)")
                gradient.addColorStop(1, "rgba(40, 50, 100, 0.01)")

                ctx.fillStyle = gradient
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                // 更新和绘制粒子
                particlesArray.forEach((particle) => {
                    particle.update()
                    particle.draw()
                })

                connectParticles()

                animationFrameId = requestAnimationFrame(animate)
            }

            animate()

            return () => {
                window.removeEventListener("resize", resizeCanvas)
                cancelAnimationFrame(animationFrameId)
            }
        }, [])

        return (
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none"
                style={{
                    zIndex: -1,
                    opacity: 0.7,
                }}
            />
        )
    })

    const CombinedPage = React.memo(function CombinedPage() {
        return (
            <div className=" flex flex-col" style={{height:"100vh"}}>
                {/* 上半部分：HeroSection */}
                <section id="hero" className=" flex-1 flex  justify-between px-14" style={{marginTop:"6%"}}>
                    <div className={" text-left"}>
                        <h1 className="text-5xl md:text-6xl font-bold mb-6">
                            <span>{t("Tip_Homepage_title_1")}</span>
                            <p className="text-primary">{t("Tip_Homepage_title_2")}</p>
                        </h1>
                        <div className="text-left">
                            <div style={{
                                display: "grid",
                                gridTemplateColumns: detectDevice() === "PC" ?"repeat(2, minmax(280px, 1fr))":"repeat(1, minmax(280px, 1fr))", // 强制 2 列
                                gap: "16px",
                                maxWidth: "1200px",
                                margin: "0 auto"
                            }}>
                                <FeatureCard title={t("Advantage1")} icon={Puzzle} />
                                <FeatureCard title={t("Advantage2")} icon={Layers} />
                                <FeatureCard title={t("Advantage3")} icon={Fingerprint} />
                                <FeatureCard title={t("Advantage4")} icon={LayoutTemplate} />
                            </div>
                        </div>
                        <div className="flex gap-4" style={{marginTop:"20px"}}>
                            <Space wrap={true}>
                                <button className="btn btn-primary" onClick={changeSelectKey}>
                                    {t("Start_OCR")}
                                </button>
                                <button className="btn btn-ghost gap-2" onClick={()=>{navigate("/settings/home")}}>
                                    {t("Change_Settings")}
                                </button>
                                <button className="btn btn-ghost gap-2" onClick={()=>{navigate("/settings/logs")}}>
                                    {t("Check_logs")}
                                </button>
                            </Space>
                        </div>
                    </div>
                    {detectDevice() === "PC" && (
                        <div className="flex">
                            <OcrDemo />
                        </div>
                    )}
                </section>
            </div>
        );
    });


    // Features 区块
    const FeaturesSection = React.memo(function FeaturesSection() {
        return (
            <section id="features" className="py-20 bg-auto relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">{t("Features")}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <Cards title={t("Advantage5")} icon="⚙️">
                            {" "}
                            {t("Tip_Homepage_1")}
                        </Cards>
                        <Cards title={t("Advantage6")} icon="🎯">
                            {t("Tip_Homepage_2")}
                        </Cards>
                        <Cards title={t("Advantage7")} icon="🚀">
                            {t("Tip_Homepage_3")}
                        </Cards>
                    </div>
                </div>
            </section>
        )
    })

    // 单个 Feature 卡片
    // eslint-disable-next-line react/prop-types
    function FeatureCard({ title, icon, children }) {
        const IconComponent = icon;
        return (
            <div
                className="card bg-[--semi-color-bg-1] shadow-xl p-4"
                style={{
                    height: "110px",
                    width: "100%", // 改为100%以适应容器宽度
                    maxWidth: "400px", // 设置最大宽度限制
                    minWidth: "280px"  // 设置最小宽度
                }}
            >
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-primary text-[--semi-color-bg-1] rounded-full">
                        <IconComponent className="w-6 h-6" />
                    </div>
                    <h2 className="card-title">{title}</h2>
                </div>
                <div className="mt-2 text-sm text-gray-600">{children}</div>
            </div>
        );
    }

    // eslint-disable-next-line react/prop-types
    function Cards({ title, icon, children }) {
        return (
            <div className="card bg-[--semi-color-bg-1] shadow-xl p-4 w-80 flex flex-col items-center">
                <div className="flex items-center justify-center p-4 text-[--semi-color-bg-1] rounded-full text-4xl">
                    {icon}
                </div>
                <h2 className="card-title">{title}</h2>
                <div className="mt-2 text-sm text-gray-600">{children}</div>
            </div>
        );
    }

    function NewHomePage() {
        return (
            <div className="scroll-smooth">
                {/* 页面内容 */}
                <AnimatedBackground />
                <CombinedPage/>
                {/*<HeroSection />*/}
                <FeaturesSection />
                {/* 页脚 */}
                <footer className="footer footer-center p-10 semi-color-text-0">
                    <aside>
                        <p>Copyright © {new Date().getFullYear()} - All rights reserved by CCRS Team</p>
                        <p className="textarea-sm text-gray-300 ">{t("Tip_Homepage_footer")}</p>
                    </aside>
                </footer>
            </div>
        )
    }

    return (
        <>
            <NewHomePage></NewHomePage>
        </>
    )
}

export default HomePage

