import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';

interface Data {
    name: string;
    values: number[];
}

interface GroupedBarChartProps {
    title: string;
    data: Data[];
}

const margin = { top: 20, right: 250, bottom: 40, left: 50 };
const height = 300 - margin.top - margin.bottom;
const maxBuckets = 10; // Maximum number of buckets per group

const GroupedBarChart = ({ title, data }: GroupedBarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800); // Default width

    console.log('GroupedBarChart', title, data);
    const { groups, buckets, formattedData, flattenedData } = useMemo(() => {
        // Extract groups
        const groups = data.map(d => d.name);

        // Determine the value range and define the buckets
        const allValues = data.flatMap(d => d.values);
        const uniqueNumbers = [...new Set(allValues)];
        const minValue = Math.min(...allValues);
        const maxValue = Math.max(...allValues);
        let buckets: any[] = [];

        if (uniqueNumbers.length <= maxBuckets) {
            // If there are fewer unique numbers than the maximum number of buckets,
            // we can use the unique numbers as buckets
            buckets = uniqueNumbers.map(num => ({
                min: num,
                max: num,
            }));
        } else {
            // Create buckets based on the range of values
            const bucketSize = (maxValue - minValue) / maxBuckets;
            buckets = Array.from({ length: maxBuckets }, (_, i) => ({
                min: minValue + i * bucketSize,
                max: minValue + (i + 1) * bucketSize,
            }));
        }

        // Assign each value to a bucket
        const formattedData = data.map(d => ({
            name: d.name,
            buckets: buckets.map(bucket => ({
                range: `${bucket.min.toFixed(1)} - ${bucket.max.toFixed(1)}`,
                count: d.values.filter(
                    (value: number) => value >= bucket.min && value < bucket.max
                ).length,
            })),
        }));

        // Flatten data for easier processing
        const flattenedData = formattedData.flatMap(d =>
            d.buckets.map(bucket => ({
                group: d.name,
                range: bucket.range,
                count: bucket.count,
            }))
        );

        return { groups, buckets, formattedData, flattenedData };
    }, [data]);

    const x0 = useMemo(
        () =>
            d3
                .scaleBand()
                .domain(groups)
                .range([0, containerWidth - margin.right])
                .padding(0.2),
        [groups, containerWidth]
    );
    const x1 = useMemo(
        () =>
            d3
                .scaleBand()
                .domain(buckets.map(b => b.min.toFixed(1)))
                .range([0, x0.bandwidth()])
                .padding(0.05),
        [buckets, x0]
    );
    const y = useMemo(
        () =>
            d3
                .scaleLinear()
                .domain([0, d3.max(flattenedData, d => d.count) ?? 0])
                .range([height, 0]),
        [flattenedData]
    );
    const color = useMemo(
        () =>
            d3
                .scaleOrdinal()
                .domain(buckets.map(b => b.min.toFixed(1)))
                .range(d3.schemeCategory10),
        [buckets]
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
        svg.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x0).tickSize(0))
            .selectAll('text')
            .style('text-anchor', 'middle');

        // Append y-axis
        svg.append('g').call(d3.axisLeft(y));

        // Draw bars for each bucket
        const barGroups = svg
            .selectAll('.bar-group')
            .data(formattedData)
            .join('g')
            .attr('class', 'bar-group')
            .attr('transform', d => `translate(${x0(d.name)},0)`);

        barGroups
            .selectAll('rect')
            .data(d => d.buckets)
            .join('rect')
            .attr('x', d => x1(d.range.split(' - ')[0]) ?? 0) // Align based on the lower range value
            .attr('y', d => y(d.count))
            .attr('width', x1.bandwidth())
            .attr('height', d => height - y(d.count))
            .attr('fill', d => color(d.range.split(' - ')[0]) as string);

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
            .data(buckets)
            .join('g')
            .attr('class', 'legend-item')
            .attr('transform', (_, i) => `translate(0, ${i * 20 + 20})`);

        legendItems
            .append('rect')
            .attr('width', 15)
            .attr('height', 15)
            .attr('fill', d => color(d.min.toFixed(1)) as string);

        legendItems
            .append('text')
            .attr('x', 20)
            .attr('y', 12)
            .text(d =>
                d.min === d.max
                    ? d.min
                    : `${d.min.toFixed(1)} - ${d.max.toFixed(1)}`
            );
    }, [formattedData, x0, x1, y, color, title]);

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

export default GroupedBarChart;
