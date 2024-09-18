import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';

interface Data {
    name: string;
    values: { value: number; name: string }[];
}

interface GroupBarChartProps {
    title: string;
    data: Data[];
}

const margin = { top: 20, right: 250, bottom: 40, left: 50 };
const height = 500 - margin.top - margin.bottom;

const GroupBarChart = ({ title, data }: GroupBarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800); // Default width
    console.log('SingleBarChart', title, data);
    const fx = useMemo(
        () =>
            d3
                .scaleBand()
                .domain(new Set(data.map(d => d.name)))
                .range([0, containerWidth - margin.right])
                .padding(0.2),
        [data, containerWidth]
    );
    const flattenData = data.flatMap(d => d.values);

    const groupbarNames = new Set(flattenData.map(d => d.name));
    console.log('groupbarNames', groupbarNames);
    const x0 = d3
        .scaleBand()
        .domain(groupbarNames)
        .rangeRound([0, fx.bandwidth()])
        .padding(0.05);

    const color = d3
        .scaleOrdinal()
        .domain(groupbarNames)
        .range(d3.schemeSpectral[Math.max(Math.min(groupbarNames.size, 11), 3)])
        .unknown('#ccc');

    const y = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([0, d3.max(flattenData, d => d.value) ?? 0])
                .nice()
                .range([height, 0]),
        [data]
    );

    useEffect(() => {
        d3.select(svgRef.current).selectAll('*').remove();

        const svg = d3
            .select(svgRef.current)
            .attr('width', containerWidth)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Append x-axis
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(fx).tickSizeOuter(0));

        // Append y-axis
        svg.append('g').call(d3.axisLeft(y));

        // Draw bars
        svg.selectAll('rect')
            .data(data)
            .join('g')
            .attr('transform', d => `translate(${fx(d.name)},0)`)
            .selectAll()
            .data(d => d.values)
            .join('rect')
            .attr('x', d => x0(d.name) ?? 0)
            .attr('y', d => y(d.value) ?? 0)
            .attr('width', x0.bandwidth())
            .attr('height', d => y(0) - y(d.value))
            .attr('fill', d => color(d.name)?.toString() ?? '#ccc');

        // Append legend
        const legend = svg
            .append('g')
            .attr(
                'transform',
                `translate(${containerWidth - margin.left - margin.right + 20}, 0)`
            );

        // Append title to the legend
        legend
            .append('text')
            .attr('x', 0)
            .attr('y', 0) // Position title above the legend items
            .style('font-weight', 'bold')
            .text(title);

        // Append legend color boxes and text labels
        const legendItems = legend
            .selectAll('.legend-item')
            .data(groupbarNames)
            .join('g')
            .attr('class', 'legend-item')
            .attr('transform', (_, i) => `translate(0, ${i * 20 + 20})`);

        legendItems
            .append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', d => color(d) as string);

        legendItems
            .append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(d => d);
    }, [data, x0, y, color, title]);

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

export default GroupBarChart;
