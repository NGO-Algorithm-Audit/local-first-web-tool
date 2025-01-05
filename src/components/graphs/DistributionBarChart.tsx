import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';

interface DistributionBarChartProps {
    column: string;
    dataType: string;
    realData: (string | number)[];
    syntheticData: (string | number)[];
}

const margin = { top: 30, right: 50, bottom: 60, left: 50 }; // Increased bottom margin for rotated labels
const height = 300 - margin.top - margin.bottom;

const DistributionBarChart = ({
    column,
    dataType,
    realData,
    syntheticData,
}: DistributionBarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800);
    const { t } = useTranslation();

    useEffect(() => {
        const plotWidth = containerWidth - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        let processedRealData;
        let processedSyntheticData;

        if (dataType === 'float') {
            // Process numerical data using bins
            const combinedData = [...realData, ...syntheticData] as number[];
            const extent = d3.extent(combinedData) as [number, number];
            const binGenerator = d3.bin().domain(extent).thresholds(30);

            const binsReal = binGenerator(realData as number[]);
            const binsSynthetic = binGenerator(syntheticData as number[]);

            const realDensityFactor = 1 / realData.length;
            const syntheticDensityFactor = 1 / syntheticData.length;

            processedRealData = binsReal.map(bin => ({
                key: `${bin.x0?.toFixed(2)} - ${bin.x1?.toFixed(2)}`,
                value: bin.length * realDensityFactor,
            }));

            processedSyntheticData = binsSynthetic.map(bin => ({
                key: `${bin.x0?.toFixed(2)} - ${bin.x1?.toFixed(2)}`,
                value: bin.length * syntheticDensityFactor,
            }));
        } else {
            // Process categorical data using counts
            const realCounts = d3.rollup(
                realData,
                v => v.length / realData.length, // Convert to proportions
                d => d
            );
            const syntheticCounts = d3.rollup(
                syntheticData,
                v => v.length / syntheticData.length, // Convert to proportions
                d => d
            );

            // Get all unique categories
            const allCategories = new Set(
                [...realData, ...syntheticData].map(String)
            );

            // Create processed data with all categories
            processedRealData = Array.from(allCategories, category => ({
                key: category,
                value: realCounts.get(category) || 0,
            }));

            processedSyntheticData = Array.from(allCategories, category => ({
                key: category,
                value: syntheticCounts.get(category) || 0,
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
            .domain(processedRealData.map(d => String(d.key)))
            .range([0, plotWidth])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([
                0,
                d3.max([
                    ...processedRealData.map(d => d.value),
                    ...processedSyntheticData.map(d => d.value),
                ]) || 0,
            ])
            .range([plotHeight, 0]);

        // Draw real data bars
        svg.selectAll('.bar-real')
            .data(processedRealData)
            .enter()
            .append('rect')
            .attr('class', 'bar-real')
            .attr('x', d => xScale(String(d.key)) || 0)
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => plotHeight - yScale(d.value))
            .style('fill', 'steelblue')
            .style('opacity', 0.5);

        // Draw synthetic data bars
        svg.selectAll('.bar-synthetic')
            .data(processedSyntheticData)
            .enter()
            .append('rect')
            .attr('class', 'bar-synthetic')
            .attr('x', d => xScale(String(d.key)) || 0)
            .attr('y', d => yScale(d.value))
            .attr('width', xScale.bandwidth())
            .attr('height', d => plotHeight - yScale(d.value))
            .style('fill', 'orange')
            .style('opacity', 0.5);

        // Add axes
        svg.append('g')
            .attr('transform', `translate(0,${plotHeight})`)
            .call(d3.axisBottom(xScale))
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end')
            .attr('dx', '-.8em')
            .attr('dy', '.15em');

        svg.append('g').call(d3.axisLeft(yScale));

        // Add title
        svg.append('text')
            .attr('x', plotWidth / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(`${t('distribution.distributionFor')} ${column}`);

        // Add legend
        const legend = svg
            .append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${plotWidth - 120}, 30)`);

        // Add background rectangle for legend
        legend
            .append('rect')
            .attr('x', -10)
            .attr('y', -10)
            .attr('width', 110)
            .attr('height', 55)
            .attr('rx', 5)
            .style('fill', 'white')
            .style('opacity', 0.7)
            .style('stroke', '#e2e8f0')
            .style('stroke-width', 1);

        // Add legend items
        legend
            .append('rect')
            .attr('x', 0)
            .attr('y', 0)
            .attr('width', 15)
            .attr('height', 15)
            .style('fill', 'steelblue')
            .style('opacity', 0.5);

        legend
            .append('text')
            .attr('x', 20)
            .attr('y', 12)
            .style('font-size', '12px')
            .text(t('distribution.realData'));

        legend
            .append('rect')
            .attr('x', 0)
            .attr('y', 20)
            .attr('width', 15)
            .attr('height', 15)
            .style('fill', 'orange')
            .style('opacity', 0.5);

        legend
            .append('text')
            .attr('x', 20)
            .attr('y', 32)
            .style('font-size', '12px')
            .text(t('distribution.syntheticData'));
    }, [containerWidth, column, realData, syntheticData, dataType]);

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

export default DistributionBarChart;
