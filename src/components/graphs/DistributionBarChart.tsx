import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';

interface DistributionBarChartProps {
    column: string;
    dataType: string;
    realData: (string | number)[];
    syntheticData: (string | number)[];
}

const margin = { top: 30, right: 50, bottom: 60, left: 80 }; // Increased bottom margin for rotated labels
const height = 380 - margin.top - margin.bottom;

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

    const formatTickAsPercentage = (value: number) => {
        return `${(value * 100).toFixed(1)}%`;
    };

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
            .padding(0.2); // Increased padding between category groups

        // Create inner scale for the two bars
        const innerScale = d3
            .scaleBand()
            .domain(['real', 'synthetic'])
            .range([0, xScale.bandwidth()])
            .padding(0.05); // Small padding between real and synthetic bars

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
            .attr('x', d => (xScale(String(d.key)) || 0) + innerScale('real')!)
            .attr('y', d => yScale(d.value))
            .attr('width', innerScale.bandwidth())
            .attr('height', d => plotHeight - yScale(d.value))
            .style('fill', 'steelblue');

        // Draw synthetic data bars
        svg.selectAll('.bar-synthetic')
            .data(processedSyntheticData)
            .enter()
            .append('rect')
            .attr('class', 'bar-synthetic')
            .attr(
                'x',
                d => (xScale(String(d.key)) || 0) + innerScale('synthetic')!
            )
            .attr('y', d => yScale(d.value))
            .attr('width', innerScale.bandwidth())
            .attr('height', d => plotHeight - yScale(d.value))
            .style('fill', 'orange');

        // Calculate means for both datasets
        const realMean = d3.mean(processedRealData, d => d.value) || 0;
        const syntheticMean =
            d3.mean(processedSyntheticData, d => d.value) || 0;

        // Add horizontal mean lines
        // Real data mean line
        svg.append('line')
            .attr('x1', 0)
            .attr('x2', plotWidth)
            .attr('y1', yScale(realMean))
            .attr('y2', yScale(realMean))
            .style('stroke', 'steelblue')
            .style('stroke-width', 1.5)
            .style('stroke-dasharray', '5,5');

        // Synthetic data mean line
        svg.append('line')
            .attr('x1', 0)
            .attr('x2', plotWidth)
            .attr('y1', yScale(syntheticMean))
            .attr('y2', yScale(syntheticMean))
            .style('stroke', 'orange')
            .style('stroke-width', 1.5)
            .style('stroke-dasharray', '5,5');

        // Add mean labels on the right side
        svg.append('text')
            .attr('x', plotWidth + 5)
            .attr('y', yScale(realMean))
            .attr('dy', '0.35em')
            .style('font-size', '10px')
            .style('fill', 'steelblue')
            .text(`Mean: ${(realMean * 100).toFixed(1)}%`);

        svg.append('text')
            .attr('x', plotWidth + 5)
            .attr('y', yScale(syntheticMean))
            .attr('dy', '0.35em')
            .style('font-size', '10px')
            .style('fill', 'orange')
            .text(`Mean: ${(syntheticMean * 100).toFixed(1)}%`);

        // Add axes
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
                .ticks(5) // Reduce number of ticks
                .tickFormat(d => formatTickAsPercentage(d as number))
        );

        // Add title
        svg.append('text')
            .attr('x', plotWidth / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(`${t('distribution.distributionFor')} ${column}`);

        // Add y-axis label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -50) // Adjust position from left edge
            .attr('x', -plotHeight / 2) // Center vertically
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(t('distribution.percentage'));

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
            .style('fill', 'steelblue');

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
            .style('fill', 'orange');

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
