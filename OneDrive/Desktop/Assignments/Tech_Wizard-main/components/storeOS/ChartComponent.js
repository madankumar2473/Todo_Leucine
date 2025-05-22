import React, { useRef, useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { Chart as ChartJS, registerables } from 'chart.js'
import { Line, Bar, Pie } from 'react-chartjs-2'

// Register Chart.js modules
ChartJS.register(...registerables)

const ChartComponent = ({ type, data, options, height, width, visible }) => {
    const chartRef = useRef(null)
    const containerRef = useRef(null)
    const [isChartReady, setIsChartReady] = useState(true)

    useEffect(() => {
        // Check visibility and resize chart when visible
        if (visible) {
            setTimeout(() => {
                if (chartRef.current && chartRef.current.chartInstance) {
                    chartRef.current.chartInstance.resize()
                }
                setIsChartReady(true) // Mark chart as ready once visibility and resize are handled
            }, 100) // Small delay to ensure container is fully rendered
        } else {
            setIsChartReady(false) // Mark chart as not ready when invisible
        }
    }, [visible])

    useEffect(() => {
        const resizeObserver = new ResizeObserver(() => {
            if (chartRef.current && chartRef.current.chartInstance) {
                chartRef.current.chartInstance.resize()
            }
        })

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current)
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current)
            }
        }
    }, [])

    const renderChart = () => {
        const chartProps = {
            data,
            options,
            ref: chartRef,
        }

        switch (type) {
            case 'line':
                return <Line {...chartProps} />
            case 'bar':
                return <Bar {...chartProps} />
            case 'pie':
                return <Pie {...chartProps} />
            default:
                return <p>Unsupported chart type</p>
        }
    }

    return (
        <div
            ref={containerRef}
            className={`p-4 bg-white shadow-md rounded-lg flex justify-center items-center ${height} ${width}`}
        >
            {isChartReady ? renderChart() : <p>Loading chart...</p>}
        </div>
    )
}

ChartComponent.propTypes = {
    type: PropTypes.oneOf(['line', 'bar', 'pie']).isRequired, // Chart type
    data: PropTypes.object.isRequired, // Chart data
    options: PropTypes.object, // Chart options
    height: PropTypes.string, // Height class from Tailwind
    width: PropTypes.string, // Width class from Tailwind
    visible: PropTypes.bool, // Visibility of the chart
}

ChartComponent.defaultProps = {
    options: {},
    height: 'h-80',
    width: 'w-full',
    visible: true,
}

export default ChartComponent
