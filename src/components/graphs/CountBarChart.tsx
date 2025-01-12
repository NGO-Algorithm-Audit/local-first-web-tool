import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';

interface CountBarChartProps {
    column: string;
    realData: (string | number)[];
}

const margin = { top: 30, right: 50, bottom: 60, left: 50 }; // Increased bottom margin for rotated labels
const height = 380 - margin.top - margin.bottom;

const CountBarChart = ({ column, realData }: CountBarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800);
    const { t } = useTranslation();

    const formatTick = (value: number) => {
        if (value >= 1000000) {
            return `${(value / 1000000).toFixed(1)}M`;
        } else if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
    };

    useEffect(() => {
        const plotWidth = containerWidth - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        // Determine if data is categorical or numerical
        const isNumerical = realData.every(d => typeof d === 'number');

        // Process data based on type
        let processedData;
        if (isNumerical) {
            // For numerical data, create bins
            const numericData = realData as number[];
            const bins = d3
                .bin()
                .domain(d3.extent(numericData) as [number, number])
                .thresholds(10)(numericData);

            processedData = bins.map(bin => ({
                key: `${bin.x0?.toFixed(2)} - ${bin.x1?.toFixed(2)}`,
                value: bin.length,
            }));
        } else {
            // For categorical data, count occurrences
            const counts = d3.rollup(
                realData,
                v => v.length,
                d => d
            );
            processedData = Array.from(counts, ([key, value]) => ({
                key,
                value,
            }));
        }

        // Clear previous content
        d3.select(svgRef.current).selectAll('*').remove();

        // Create SVG
        const svg = d3
            .select(svgRef.current)
            .attr('width', containerWidth)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Create scales
        const xScale = d3
            .scaleBand()
            .domain(processedData.map(d => String(d.key)))
            .range([0, plotWidth])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([0, d3.max(processedData, d => d.value) || 0])
            .range([plotHeight, 0]);

        // Add bars
        svg.selectAll('.bar')
            .data(processedData)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('x', d => xScale(String(d.key)) || 0)
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => plotHeight - yScale(d.value))
            .style('fill', 'steelblue')
            .style('opacity', 0.5);

        // Add axes with formatted ticks
        svg.append('g')
            .attr('transform', `translate(0,${plotHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em');

        svg.append('g').call(
            d3
                .axisLeft(yScale)
                .ticks(5)
                .tickFormat(d => formatTick(d as number))
        );

        // Add y-axis label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -40) // Adjust position from left edge
            .attr('x', -plotHeight / 2) // Center vertically
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(t('distribution.frequency'));

        // Add title
        svg.append('text')
            .attr('x', plotWidth / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(`${t('distribution.countFor')} ${column}`);
    }, [containerWidth, column, realData]);

    useEffect(() => {
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || entries.length === 0) return;
            const { width } = entries[0].contentRect;
            if (width > 0) {
                setContainerWidth(width);
            }
        });

        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            if (containerRef.current) {
                resizeObserver.unobserve(containerRef.current);
            }
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ width: '100%', display: 'flex', overflowX: 'auto' }}
            className={`chart-container min-h-[${height}px] flex-col`}
        >
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default CountBarChart;
