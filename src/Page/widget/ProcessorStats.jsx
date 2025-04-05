import { useEffect, useState, useRef } from "react"
import PropTypes from "prop-types";


export default function ProcessorStats({
                                           mainColor = "orange",
                                           backgroundColors = "rgb(60, 60, 60)",
                                           icon = "",
                                           title = "Processor",
                                           content = "Intel(R) Core(TM) i5-7400 CPU",
                                           percentage = 22,
                                           usageLabel = "PROCESSOR USAGE",
                                           bottomStats = {
                                               left: "4 Cores",
                                               center: "1.6 GHz",
                                               right: "64-bit",
                                           },
                                           chart_color = "#ffffff",
                                           chart_data = {
                                               values: [
                                                   {
                                                       type: ["00:00:01"],
                                                       value: [100],
                                                   },
                                               ],
                                           },
                                           animationDuration = 1000, // 默认动画持续时间为1秒
                                       }) {
    const [currentPercentage, setCurrentPercentage] = useState(0)
    const canvasRef = useRef(null)
    const [currentData, setCurrentData] = useState([])
    const [targetData, setTargetData] = useState([])
    const animationRef = useRef(null)
    const lastUpdateTimeRef = useRef(0)

    // 处理图表数据
    useEffect(() => {
        // 确保至少有两个数据点，如果只有一个，则复制它
        let newTargetData = chart_data?.values?.map((item) => ({
            value: Array.isArray(item.value) ? item.value[0] : item.value,
        })) || [{ value: 0 }]

        // 如果只有一个数据点，复制它以确保至少有两个点
        if (newTargetData.length === 1) {
            newTargetData = [{ value: newTargetData[0].value }, { value: newTargetData[0].value }]
        }

        setTargetData(newTargetData)

        // 如果当前数据为空，立即设置为目标数据（初始化）
        if (currentData.length === 0) {
            setCurrentData(newTargetData)
        }
    }, [chart_data])

    // 动画效果
    useEffect(() => {
        if (currentData.length === 0 || targetData.length === 0) return

        // 确保当前数据和目标数据长度一致
        if (currentData.length !== targetData.length) {
            setCurrentData([...targetData])
            return
        }

        const startAnimation = (timestamp) => {
            if (!lastUpdateTimeRef.current) {
                lastUpdateTimeRef.current = timestamp
            }

            const elapsed = timestamp - lastUpdateTimeRef.current
            const progress = Math.min(elapsed / animationDuration, 1)

            // 计算插值后的数据
            const newData = currentData.map((item, index) => {
                const startValue = item.value
                const endValue = targetData[index].value
                return {
                    value: startValue + (endValue - startValue) * progress,
                }
            })

            setCurrentData(newData)

            if (progress < 1) {
                animationRef.current = requestAnimationFrame(startAnimation)
            } else {
                lastUpdateTimeRef.current = 0
            }
        }

        // 开始动画
        animationRef.current = requestAnimationFrame(startAnimation)

        // 清理函数
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current)
            }
        }
    }, [targetData, animationDuration])

    // 绘制图表
    useEffect(() => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height)

        const data = currentData
        if (data.length === 0) return

        // Find max value for scaling
        const maxValue = Math.max(...data.map((d) => d.value), 1)

        // Calculate points
        const points = data.map((d, i) => ({
            x: (i / (data.length - 1)) * canvas.width,
            y: canvas.height - (d.value / maxValue) * canvas.height * 0.8,
        }))

        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)

        // Parse the chart_color to RGB components
        let r = 255,
            g = 255,
            b = 255
        if (chart_color.startsWith("#")) {
            const hex = chart_color.substring(1)
            if (hex.length === 3) {
                r = Number.parseInt(hex[0] + hex[0], 16)
                g = Number.parseInt(hex[1] + hex[1], 16)
                b = Number.parseInt(hex[2] + hex[2], 16)
            } else if (hex.length === 6) {
                r = Number.parseInt(hex.substring(0, 2), 16)
                g = Number.parseInt(hex.substring(2, 4), 16)
                b = Number.parseInt(hex.substring(4, 6), 16)
            }
        }

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0.8)`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        // 检查是否有足够的点来绘制曲线
        if (points.length >= 2) {
            // Draw area
            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)

            // Draw smooth curve
            for (let i = 0; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2
                const yc = (points[i].y + points[i + 1].y) / 2
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
            }

            // Last point
            ctx.quadraticCurveTo(
                points[points.length - 2].x,
                points[points.length - 2].y,
                points[points.length - 1].x,
                points[points.length - 1].y,
            )

            // Complete the area
            ctx.lineTo(canvas.width, canvas.height)
            ctx.lineTo(0, canvas.height)
            ctx.closePath()

            // Fill with gradient
            ctx.fillStyle = gradient
            ctx.fill()

            // Draw line on top
            ctx.beginPath()
            ctx.moveTo(points[0].x, points[0].y)

            for (let i = 0; i < points.length - 1; i++) {
                const xc = (points[i].x + points[i + 1].x) / 2
                const yc = (points[i].y + points[i + 1].y) / 2
                ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc)
            }

            ctx.quadraticCurveTo(
                points[points.length - 2].x,
                points[points.length - 2].y,
                points[points.length - 1].x,
                points[points.length - 1].y,
            )

            ctx.strokeStyle = chart_color
            ctx.lineWidth = 2
            ctx.stroke()
        } else if (points.length === 1) {
            // 如果只有一个点，绘制一个圆点
            ctx.beginPath()
            ctx.arc(points[0].x, points[0].y, 3, 0, Math.PI * 2)
            ctx.fillStyle = chart_color
            ctx.fill()

            // 绘制一个简单的区域
            ctx.beginPath()
            ctx.moveTo(0, canvas.height)
            ctx.lineTo(points[0].x, points[0].y)
            ctx.lineTo(canvas.width, canvas.height)
            ctx.closePath()
            ctx.fillStyle = gradient
            ctx.fill()
        }
    }, [currentData, chart_color])

    // 百分比动画
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentPercentage((prev) => {
                if (prev < percentage) return prev + 1
                if (prev > percentage) return prev - 1
                clearInterval(timer)
                return prev
            })
        }, 20)
        return () => clearInterval(timer)
    }, [percentage])

    return (
        <div className="w-full max-w-md rounded-lg overflow-hidden" style={{ backgroundColor: backgroundColors }}>
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: mainColor }}
                    >
                        {icon && (
                            <img src={icon || "/placeholder.svg"} alt="Icon" className="w-8 object-cover" crossOrigin="anonymous" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-white text-lg font-medium">{title}</h2>
                        <p className="text-gray-300 text-sm">{content}</p>
                    </div>
                </div>

                {/* Chart and Percentage */}
                <div className="flex items-center mb-4 gap-4">
                    <div className="w-[60%] h-[80px]">
                        <canvas ref={canvasRef} width={300} height={80} className="w-full h-full" />
                    </div>

                    <div className="text-right flex-1">
                        <div className="flex items-baseline justify-end">
                            <span className="text-gray-500 text-6xl font-bold mr-2">0</span>
                            <span className="text-white text-6xl font-bold">{currentPercentage}</span>
                            <span className="text-white text-4xl font-bold">%</span>
                        </div>
                        <div className="mt-2">
                            <p className="text-gray-400 text-sm tracking-wider mb-2">{usageLabel}</p>
                            <div className="h-1 bg-gray-700 rounded-full w-32 ml-auto">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ width: `${currentPercentage}%`, backgroundColor: mainColor }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Stats */}
            <div className="grid grid-cols-3 text-center py-3" style={{ backgroundColor: mainColor }}>
                <div className="text-white border-r border-white/20">{bottomStats.left}</div>
                <div className="text-white border-r border-white/20">{bottomStats.center}</div>
                <div className="text-white">{bottomStats.right}</div>
            </div>
        </div>
    )
}

ProcessorStats.propTypes = {
    mainColor: PropTypes.string,
    backgroundColors: PropTypes.string,
    icon: PropTypes.string,
    title: PropTypes.string,
    content: PropTypes.string,
    percentage: PropTypes.number,
    usageLabel: PropTypes.string,
    bottomStats: PropTypes.shape({
        left: PropTypes.string,
        center: PropTypes.string,
        right: PropTypes.string,
    }),
    chart_color: PropTypes.string,
    chart_data: PropTypes.shape({
        values: PropTypes.arrayOf(
            PropTypes.shape({
                type: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
                value: PropTypes.oneOfType([PropTypes.number, PropTypes.arrayOf(PropTypes.number)]),
            })
        ),
    }),
    animationDuration: PropTypes.number,
};