import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface HeatMapChartProps {
    title: string;
    data: number[][];
}

// Define margins for the chart
const margin = { top: 10, right: 0, bottom: 40, left: 0 };
// Define height for the chart, adjusting for margins
const height = 300 - margin.top - margin.bottom;

const HeatMapChart = ({ title, data }: HeatMapChartProps) => {
    const svgRef = useRef(null); // Reference to the SVG element
    const containerRef = useRef(null); // Reference to the container div
    const [containerWidth, setContainerWidth] = useState(800); // Default container width

    useEffect(() => {
        // Clear any previous SVG content to avoid overlapping elements
        d3.select(svgRef.current).selectAll('*').remove();

        const barWidth = Math.max(
            10,
            Math.floor(Math.min(containerWidth, 500) / data[0].length)
        );
        const barHeight = barWidth;
        // Create the SVG container and set its dimensions
        const svg = d3
            .select(svgRef.current)
            .attr('width', containerWidth)
            .attr('height', data.length * barHeight)
            .append('g');
        //.attr('transform', `translate(${margin.left},${margin.top})`);

        svg.append('defs')
            .append('style')
            .attr('type', 'text/css')
            .text(
                "@import url('https://fonts.googleapis.com/css2?family=Avenir:wght@600');"
            );

        const colorScale = d3
            .scaleSequential()
            .domain([-1, 1])
            .interpolator(d3.interpolateBlues);

        data.forEach((dataRow, rowIndex) => {
            dataRow.forEach((dataCell, cellIndex) => {
                svg.append('rect')
                    .attr('x', cellIndex * barWidth)
                    .attr('y', rowIndex * barHeight)
                    .attr('width', barWidth)
                    .attr('height', barHeight)
                    .style('fill', function () {
                        return colorScale(dataCell);
                    });
            });
        });
    }, [data, title, containerWidth]);

    useEffect(() => {
        // Set up the ResizeObserver to track changes in the container's size
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || entries.length === 0) return;
            const { width } = entries[0].contentRect;
            setContainerWidth(width); // Update the state with the new container width
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current); // Start observing the container
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current); // Cleanup on component unmount
            }
        };
    }, []);

    // Render the chart container and SVG element with horizontal scroll if needed
    return (
        <div
            ref={containerRef}
            style={{ width: '100%', display: 'flex', overflowX: 'auto' }}
            className={`min-h-[${height}px] flex-col`}
        >
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default HeatMapChart;
