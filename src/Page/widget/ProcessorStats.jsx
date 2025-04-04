import { useEffect, useState, useRef, useMemo } from "react";
import PropTypes from "prop-types";
import VChart from "@visactor/vchart";
import { Space } from "@douyinfe/semi-ui";

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
                                right: "64-bit",
                            },
                            UsageData = [
                                {
                                    type: ["17:59:46"],
                                    value: [0.7]
                                }
                            ],
                        }) {
    const [currentPercentage, setCurrentPercentage] = useState(0);
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);

    // Memoize chart configuration
    const chartSpec = useMemo(() => ({
        type: "area",
        data: [
            {
                id: 'usage',
                values: []
            }
        ],
        stack: true,
        title: {
            visible: false,
        },
        axes: [],
        xField: "type",
        yField: "value",
        line: { style: { curveType: "monotone" } },
        seriesField: "total",
        legends: { visible: false },
        point: { visible: false },
        tooltip: {
            dimension: {
                updateContent: (data) => {
                    let sum = 0;
                    data.forEach((datum) => (sum += +datum.value || 0));
                    data.push({ hasShape: "false", key: "Total", value: sum });
                    return data;
                },
            },
        },
    }), []);

    // Transform data for VChart
    const transformedData = useMemo(() => {
        return UsageData;
    }, [UsageData]);

    // Percentage animation effect
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentPercentage((prev) => {
                if (prev < percentage) return prev + 1;
                if (prev > percentage) return prev - 1;
                clearInterval(timer);
                return prev;
            });
        }, 20);

        return () => clearInterval(timer);
    }, [percentage]);

    // 初始化图表：只在组件挂载时执行一次
    useEffect(() => {
        if (!chartRef.current) return;

        try {
            const spec = {
                ...chartSpec,
                data: transformedData
            };
            chartInstanceRef.current = new VChart(spec, {
                mode: "desktop-browser",
                dom: chartRef.current
            });
            chartInstanceRef.current.renderSync();
        } catch (error) {
            console.error("Error rendering VChart:", error);
        }

        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.release();
                chartInstanceRef.current = null;
            }
        };
    }, []);

    // 更新图表数据：当 transformedData 变化时执行
    useEffect(() => {
        if (chartInstanceRef.current && transformedData) {
            try {
                chartInstanceRef.current.updateDataSync('usage', transformedData);
            } catch (error) {
                console.error("Error updating VChart data:", error);
            }
        }
    }, [transformedData]);

    return (
        <div
            className="w-full max-w-md rounded-lg overflow-hidden"
            style={{ backgroundColor: backgroundColors }}
        >
            <div className="p-4">
                {/* Header */}
                <div className="flex items-center gap-3 mb-4">
                    <div
                        className="w-12 h-12 rounded-full overflow-hidden flex items-center justify-center"
                        style={{ backgroundColor: mainColor }}
                    >
                        <img src={icon} alt="Icon" className="w-8 object-cover" />
                    </div>
                    <div>
                        <h2 className="text-white text-lg font-medium">{title}</h2>
                        <p className="text-gray-300 text-sm">{content}</p>
                    </div>
                </div>

                {/* Chart and Percentage */}
                <div className="flex items-center mb-4">
                    {/* Area Chart */}
                    <Space className="w-full h-full">
                        <div
                            ref={chartRef}
                            className="w-[50%] mr-4"

                            style={{ backgroundColor: "transparent",height:"130px" }}
                        ></div>

                        {/* Percentage Display */}
                        <div className="flex-1 text-right">
                            <div className="flex items-baseline justify-end">
                                <span className="text-gray-500 text-6xl font-bold mr-2">0</span>
                                <span className="text-white text-6xl font-bold">
                                    {currentPercentage}
                                </span>
                                <span className="text-white text-4xl font-bold">%</span>
                            </div>
                            <div className="mt-2">
                                <p className="text-gray-400 text-sm tracking-wider mb-2">
                                    {usageLabel}
                                </p>
                                <div className="h-1 bg-gray-700 rounded-full w-32 ml-auto">
                                    <div
                                        className="h-full rounded-full transition-all duration-300"
                                        style={{
                                            width: `${currentPercentage}%`,
                                            backgroundColor: mainColor,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Space>
                </div>
            </div>

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
                <div className="text-white">{bottomStats.right}</div>
            </div>
        </div>
    );
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
    UsageData: PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.arrayOf(PropTypes.string),
            value: PropTypes.arrayOf(PropTypes.number)
        })
    ),
};

export default ProcessorStats;

export { ProcessorStats }