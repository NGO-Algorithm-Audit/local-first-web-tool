import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';

interface Data {
    name: string;
    values: number;
}

interface SingleBarChartProps {
    title: string;
    data: Data[];
}

// Define margins for the chart
const margin = { top: 20, right: 250, bottom: 40, left: 50 };
// Define height for the chart, adjusting for margins
const height = 500 - margin.top - margin.bottom;

const barWidth = 80;
const barGap = 5;

const SingleBarChart = ({ title, data }: SingleBarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null); // Reference to the SVG element
    const containerRef = useRef<HTMLDivElement>(null); // Reference to the container div
    const [containerWidth, setContainerWidth] = useState(800); // Default container width

    // Create x-axis scale using d3.scaleBand, with padding for spacing between bars
    const x0 = useMemo(
        () =>
            d3
                .scaleBand()
                .domain(data.map(d => d.name))
                .range([
                    0,
                    Math.max(
                        containerWidth - margin.right,
                        data.length * (barWidth + barGap)
                    ),
                ])
                .padding(0.2),
        [data, containerWidth]
    );

    // Create y-axis scale using d3.scaleLinear, with a range from the height to 0
    const y = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([
                    d3.min(data, d => d.values) ?? 0, // Minimum value in the dataset (or 0 if undefined)
                    d3.max(data, d => d.values) ?? 0, // Maximum value in the dataset (or 0 if undefined)
                ])
                .nice() // Rounds the domain to nice round values
                .range([height, 0]),
        [data]
    );

    useEffect(() => {
        // Clear any previous SVG content to avoid overlapping elements
        d3.select(svgRef.current).selectAll('*').remove();

        // Create the SVG container and set its dimensions
        const svg = d3
            .select(svgRef.current)
            .attr('class', 'min-h-[500px]')
            .attr(
                'width',
                Math.max(containerWidth, data.length * (barWidth + barGap)) +
                    margin.left
            )
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Draw bars for the chart using the data provided
        svg.selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', d => x0(d.name) ?? 0) // Set the x position of each bar
            .attr('y', d => height - y(d.values)) // Set the y position based on the value
            .attr('width', Math.max(x0.bandwidth(), barWidth) - barGap) // Set the width of each bar
            .attr('height', d => y(d.values)) // Set the height of each bar based on the value
            .attr(
                'fill',
                (_d, index) => (index === 0 ? '#fdf3d0' : 'steelblue') // Fill the first bar with a different color
            );

        // Calculate the mean of all bar values
        const meanValue = d3.mean(data, d => d.values) ?? 0;

        // Draw a dotted line representing the mean value
        svg.append('line')
            .attr('x1', 0)
            .attr(
                'x2',
                Math.max(
                    containerWidth - margin.right,
                    data.length * (barWidth + barGap)
                )
            )
            .attr('y1', y(meanValue))
            .attr('y2', y(meanValue))
            .attr('stroke', 'black')
            .attr('stroke-width', 2)
            .attr('stroke-dasharray', '4 4') // Make the line dotted
            .attr('opacity', 0.8)
            .attr('class', 'mean-line');

        // Add a label for the mean line
        svg.append('text')
            .attr('x', margin.left + 30)
            .attr('y', y(meanValue) - 5)
            .attr('text-anchor', 'end')
            .attr('fill', 'black')
            .style('font-size', '12px')
            .text(`Mean: ${y.tickFormat(100, 's')(meanValue)}`);
        // Append x-axis to the SVG container
        const xAxis = svg
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x0).tickSize(0)); // Create the x-axis using the x0 scale
        xAxis.selectAll('text').style('text-anchor', 'middle'); // Center-align the x-axis labels
        // Highlight the first column label by underlining it
        const xAxisFirstColumnLabel = xAxis.select('text');
        xAxisFirstColumnLabel.style('text-decoration', 'underline');

        // Append y-axis to the SVG container
        svg.append('g').call(d3.axisLeft(y).ticks(10, 's')); // Create the y-axis using the y scale

        // Add a legend label for the mean line
    }, [data, x0, y, title, containerWidth]);

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
            className="min-h-[fit-content] flex-col"
        >
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default SingleBarChart;
