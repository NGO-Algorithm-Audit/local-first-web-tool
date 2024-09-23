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

const margin = { top: 20, right: 250, bottom: 40, left: 50 };
const height = 500 - margin.top - margin.bottom;

const SingleBarChart = ({ title, data }: SingleBarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800); // Default width
    console.log('SingleBarChart', title, data);
    const x0 = useMemo(
        () =>
            d3
                .scaleBand()
                .domain(data.map(d => d.name))
                .range([0, containerWidth - margin.right])
                .padding(0.2),
        [data, containerWidth]
    );

    const y = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([
                    d3.min(data, d => d.values) ?? 0,
                    d3.max(data, d => d.values) ?? 0,
                ])
                .nice()
                .range([height, 0]),
        [data]
    );

    useEffect(() => {
        // Clear any previous SVG content
        d3.select(svgRef.current).selectAll('*').remove();

        // Create the SVG container
        const svg = d3
            .select(svgRef.current)
            .attr('width', containerWidth)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Append x-axis
        const xAxis = svg
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x0).tickSize(0));
        xAxis.selectAll('text').style('text-anchor', 'middle');

        const xAxisFirstColumnLabel = xAxis.select('text');
        xAxisFirstColumnLabel.style('text-decoration', 'underline');

        svg.append('g').call(d3.axisLeft(y).ticks(10, 's'));

        // Draw bars
        svg.selectAll('rect')
            .data(data)
            .join('rect')
            .attr('x', d => x0(d.name) ?? 0)
            .attr('y', d => height - y(d.values))
            .attr('width', x0.bandwidth())
            .attr('height', d => y(d.values))
            .attr('fill', 'steelblue');
    }, [data, x0, y, title]);

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
    return (
        <div ref={containerRef} style={{ width: '100%', display: 'flex' }}>
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default SingleBarChart;
