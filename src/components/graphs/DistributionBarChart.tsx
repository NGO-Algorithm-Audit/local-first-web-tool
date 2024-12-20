import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';

interface DistributionBarChartProps {
    column: string;
    realData: number[];
    syntheticData: number[];
}

// Define margins for the chart
const margin = { top: 10, right: 50, bottom: 40, left: 50 };
// Define height for the chart, adjusting for margins
const height = 300 - margin.top - margin.bottom;

// Define width of bars and adjust for screenwidth
// const barWidth = 0.05 * window.innerWidth < 40 ? 40 : 0.05 * window.innerWidth;
// const barGap = 5;

const DistributionBarChart = ({
    column,
    realData,
    syntheticData,
}: DistributionBarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null); // Reference to the SVG element
    const containerRef = useRef<HTMLDivElement>(null); // Reference to the container div
    const [containerWidth, setContainerWidth] = useState(800); // Default container width

    // Create x-axis scale using d3.scaleBand, with padding for spacing between bars
    // const x0 = useMemo(
    //     () =>
    //         d3
    //             .scaleBand()
    //             .domain(data.map(d => d.name))
    //             .range([
    //                 0,
    //                 Math.max(
    //                     containerWidth - margin.right,
    //                     data.length * (barWidth + barGap)
    //                 ),
    //             ])
    //             .padding(0.2),
    //     [data, containerWidth]
    // );

    // // Create y-axis scale using d3.scaleLinear, with a range from the height to 0
    // const y = useMemo(
    //     () =>
    //         d3
    //             .scaleLinear()
    //             .domain([
    //                 d3.min(data, d => d.values) ?? 0, // Minimum value in the dataset (or 0 if undefined)
    //                 d3.max(data, d => d.values) ?? 0, // Maximum value in the dataset (or 0 if undefined)
    //             ])
    //             .nice() // Rounds the domain to nice round values
    //             .range([height, 0]),
    //     [data]
    // );

    useEffect(() => {
        const plotWidth = containerWidth - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        const combinedData = [...realData, ...syntheticData];
        const xScale = d3
            .scaleLinear()
            .domain([d3.min(combinedData) || 0, d3.max(combinedData) || 1])
            .range([0, plotWidth]);

        const binsReal = d3
            .bin()
            .domain(xScale.domain() as [number, number])
            .thresholds(30)(realData);

        const binsSynthetic = d3
            .bin()
            .domain(xScale.domain() as [number, number])
            .thresholds(30)(syntheticData);

        const yScale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max([...binsReal, ...binsSynthetic], d => d.length) || 1,
            ])
            .range([plotHeight, 0]);

        // Clear any previous SVG content to avoid overlapping elements
        d3.select(svgRef.current).selectAll('*').remove();

        // Create the SVG container and set its dimensions
        const svg = d3
            .select(svgRef.current)
            .attr('class', `min-h-[${height}px]`)
            .attr('width', containerWidth)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        // Add axes
        svg.append('g')
            .attr('transform', `translate(0, ${plotHeight})`)
            .call(d3.axisBottom(xScale));
        svg.append('g').call(d3.axisLeft(yScale));

        svg.append('defs')
            .append('style')
            .attr('type', 'text/css')
            .text(
                "@import url('https://fonts.googleapis.com/css2?family=Avenir:wght@600');"
            );

        // Draw real data histogram
        svg.selectAll('.bar-real')
            .data(binsReal)
            .enter()
            .append('rect')
            .attr('class', 'bar-real')
            .attr('x', d => xScale(d.x0 || 0))
            .attr('y', d => yScale(d.length))
            .attr('width', d => xScale(d.x1 || 0) - xScale(d.x0 || 0) - 1)
            .attr('height', d => plotHeight - yScale(d.length))
            .style('fill', 'steelblue')
            .style('opacity', 0.5);

        // Draw synthetic data histogram
        svg.selectAll('.bar-synthetic')
            .data(binsSynthetic)
            .enter()
            .append('rect')
            .attr('class', 'bar-synthetic')
            .attr('x', d => xScale(d.x0 || 0))
            .attr('y', d => yScale(d.length))
            .attr('width', d => xScale(d.x1 || 0) - xScale(d.x0 || 0) - 1)
            .attr('height', d => plotHeight - yScale(d.length))
            .style('fill', 'orange')
            .style('opacity', 0.5);

        // Add title
        svg.append('text')
            .attr('x', plotWidth / 2)
            .attr('y', 10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(`Distribution for ${column}`);

        // Add a legend label for the mean line
    }, [containerWidth, column, realData, syntheticData]);

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

export default DistributionBarChart;
