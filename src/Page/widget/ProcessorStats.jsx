import React, {useEffect, useState} from "react"
import PropTypes from 'prop-types'

function ProcessorStats({
                            mainColor = "#6366f1",
                            backgroundColors = "rgb(60, 60, 60)",
                            icon = "",
                            title = "Processor",
                            content = "Intel(R) Core(TM) i5-7400 CPU",
                            percentage = 22,
                            usageLabel = "PROCESSOR USAGE",
                            bottomStats = {
                                left: "4 Cores",
                                center: "1.6 GHz",
                                right: "64-bit"
                            }
                        }) {
    const [currentPercentage, setCurrentPercentage] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentPercentage(prev => {
                if (prev < percentage) {
                    return prev + 1
                }
                if (prev > percentage) {
                    return prev - 1
                }
                clearInterval(timer)
                return prev
            })
        }, 20)

        return () => clearInterval(timer)
    }, [percentage])

    return (
        <div
            className="w-full max-w-md rounded-lg overflow-hidden"
            style={{ backgroundColor:backgroundColors }}
        >
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center" style={{ backgroundColor: mainColor }}>
                        <img
                            src={icon}
                            alt="Icon"
                            className="w-8 object-cover"
                        />
                    </div>
                    <div>
                        <h2 className="text-white text-lg font-medium">{title}</h2>
                        <p className="text-gray-300 text-sm">{content}</p>
                    </div>
                </div>

                {/* Percentage Display */}
                <div className="text-right mb-4">
                    <div className="relative inline-block">
                        <span className="text-gray-500 text-6xl font-bold absolute left-0">
                          0
                        </span>
                        <span className="text-white text-6xl font-bold ml-8">
                          {currentPercentage}
                        </span>
                        <span className="text-white text-4xl font-bold">%</span>
                    </div>
                    <br/>
                    {/* Usage Label and Progress Bar */}
                    <div className="mt-2" style={{float:"right"}}>
                        <p className="text-gray-400 text-sm tracking-wider mb-2">
                            {usageLabel}
                        </p>
                        <div className="h-1 bg-gray-700 rounded-full w-32 mx-auto">
                            <div
                                className="h-full rounded-full transition-all duration-300"
                                style={{
                                    width: `${currentPercentage}%`,
                                    backgroundColor: mainColor
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <br/>
            {/* Bottom Stats */}
            <div
                className="grid grid-cols-3 text-center py-3"
                style={{ backgroundColor: mainColor }}
            >
                <div className="text-white border-r border-white/20">
                    {bottomStats.left}
                </div>
                <div className="text-white border-r border-white/20">
                    {bottomStats.center}
                </div>
                <div className="text-white">
                    {bottomStats.right}
                </div>
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
        right: PropTypes.string
    })
}

export default ProcessorStats
