"use client"

import { SideSheet, Space } from "@douyinfe/semi-ui"
import { emit } from "../../code/PageEventEmitter.js"
import React, { useState, useEffect, useRef } from "react"
import { Settings } from "../Settings.jsx"
import Logs_Viewer from "../settings_page/Logs_Viewer.jsx"
import { useTranslation } from "react-i18next"
import "./Homepage.css"

function HomePage() {
    const { t } = useTranslation()
    const [setPagevisible, setPagechange] = useState(false)
    const setchange = () => {
        setPagechange(!setPagevisible)
    }
    const [Logvisible, setlogPagechange] = useState(false)
    const logchange = () => {
        setlogPagechange(!Logvisible)
    }
    function changeSelectKey() {
        emit("changePage", "vision")
    }

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

    // Hero 区块
    const HeroSection = React.memo(function HeroSection() {
        return (
            <section id="hero" className="min-h-screen flex items-center justify-center">
                <div className="text-center max-w-4xl px-4">
                    <h1 className="text-5xl md:text-6xl font-bold mb-6">
                        <Space vertical>
                            <span>{t("Tip_Homepage_title_1")} </span>
                            <p className="text-primary"> {t("Tip_Homepage_title_2")}</p>
                        </Space>
                    </h1>
                    <p className="text-xl text-gray-500 mb-8">{t("Tip_Homepage_title_3")}</p>
                    <Space vertical>
                        <button className="btn btn-primary btn-lg" onClick={changeSelectKey}>
                            {t("Start_OCR")}
                        </button>
                        <Space>
                            <button className="btn btn-ghost" onClick={setchange}>
                                {t("Change_Settings")}
                            </button>
                            <button className="btn btn-ghost" onClick={logchange}>
                                {t("Check_logs")}
                            </button>
                        </Space>
                    </Space>
                </div>
            </section>
        )
    })

    // Features 区块
    const FeaturesSection = React.memo(function FeaturesSection() {
        return (
            <section id="features" className="py-20 bg-auto relative overflow-hidden">
                <div className="max-w-6xl mx-auto px-4">
                    <h2 className="text-4xl font-bold text-center mb-16">{t("Features")}</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <FeatureCard title={t("Model tunable training")} icon="⚙️">
                            {" "}
                            {t("Tip_Homepage_1")}
                        </FeatureCard>
                        <FeatureCard title={t("High recognition accuracy")} icon="🎯">
                            {t("Tip_Homepage_2")}
                        </FeatureCard>
                        <FeatureCard title={t("Fast image recognition")} icon="🚀">
                            {t("Tip_Homepage_3")}
                        </FeatureCard>
                    </div>
                </div>
            </section>
        )
    })

    // 单个 Feature 卡片
    function FeatureCard({ title, icon, children }) {
        return (
            <div className="card semi-color-bg-4 shadow-xl">
                <div className="card-body items-center text-center">
                    <div className="text-6xl mb-4">{icon}</div>
                    <h3 className="card-title text-2xl mb-2">{title}</h3>
                    <p>{children}</p>
                </div>
            </div>
        )
    }

    function NewHomePage() {
        return (
            <div className="scroll-smooth">
                {/* 页面内容 */}
                <AnimatedBackground />
                <HeroSection />
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
            <br />
            <br />
            <SideSheet
                style={{ maxWidth: "100%" }}
                title={t("Settings")}
                visible={setPagevisible}
                onCancel={setchange}
                placement={"right"}
            >
                <Settings />
            </SideSheet>
            <SideSheet
                style={{ width: "100%" }}
                title={t("Log_viewer")}
                visible={Logvisible}
                onCancel={logchange}
                placement={"right"}
            >
                <Logs_Viewer />
            </SideSheet>
        </>
    )
}

export default HomePage

