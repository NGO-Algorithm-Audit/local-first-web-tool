import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { useTranslation } from 'react-i18next';

interface ViolinChartProps {
    categoricalColumn: string;
    numericColumn: string;
    realData: Array<{ [key: string]: any }>;
    syntheticData: Array<{ [key: string]: any }>;
}

const margin = { top: 30, right: 50, bottom: 60, left: 80 };
const height = 380 - margin.top - margin.bottom;

const ViolinChart = ({
    categoricalColumn,
    numericColumn,
    realData,
    syntheticData,
}: ViolinChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800);
    const { t } = useTranslation();

    useEffect(() => {
        const plotWidth = containerWidth - margin.left - margin.right;
        const plotHeight = height - margin.top - margin.bottom;

        // Get unique categories
        const categories = Array.from(
            new Set([
                ...realData.map(d => d[categoricalColumn]),
                ...syntheticData.map(d => d[categoricalColumn]),
            ])
        );

        // Process data for violin plots
        const violinData = categories.map(category => {
            const realValues = realData
                .filter(d => d[categoricalColumn] === category)
                .map(d => +d[numericColumn]);
            const syntheticValues = syntheticData
                .filter(d => d[categoricalColumn] === category)
                .map(d => +d[numericColumn]);

            return {
                category,
                real: realValues,
                synthetic: syntheticValues,
            };
        });

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
            .domain(categories)
            .range([0, plotWidth])
            .padding(0.1);

        const yScale = d3
            .scaleLinear()
            .domain([
                d3.min([
                    ...realData.map(d => +d[numericColumn]),
                    ...syntheticData.map(d => +d[numericColumn]),
                ]) || 0,
                d3.max([
                    ...realData.map(d => +d[numericColumn]),
                    ...syntheticData.map(d => +d[numericColumn]),
                ]) || 0,
            ])
            .range([plotHeight, 0]);

        // Create violin plot for each category
        violinData.forEach(({ category, real, synthetic }) => {
            const xPos = xScale(category);
            if (xPos === undefined) return;

            const bandwidth = xScale.bandwidth() / 2;

            // Function to create violin path
            const createViolin = (values: number[], side: 'left' | 'right') => {
                // Create properly typed bin generator
                const binGenerator = d3
                    .bin<number, number>()
                    .domain(yScale.domain() as [number, number])
                    .thresholds(20);

                const bins = binGenerator(values);

                // Now bins is properly typed as d3.Bin<number, number>[]
                const maxCount = d3.max(bins, d => d.length) || 0;
                const widthScale = d3
                    .scaleLinear()
                    .domain([0, maxCount / values.length])
                    .range([0, bandwidth]);

                const area = d3
                    .area<d3.Bin<number, number>>()
                    .x0(d => {
                        const width = widthScale(d.length / values.length);
                        return side === 'left' ? -width : 0;
                    })
                    .x1(d => {
                        const width = widthScale(d.length / values.length);
                        return side === 'left' ? 0 : width;
                    })
                    .y(d => yScale((d.x0! + d.x1!) / 2))
                    .curve(d3.curveCatmullRom);

                return area(bins);
            };

            // Draw real data violin (left side)
            if (real.length > 0) {
                svg.append('path')
                    .attr('d', createViolin(real, 'left'))
                    .attr('transform', `translate(${xPos + bandwidth}, 0)`)
                    .style('fill', 'steelblue')
                    .style('opacity', 0.5);
            }

            // Draw synthetic data violin (right side)
            if (synthetic.length > 0) {
                svg.append('path')
                    .attr('d', createViolin(synthetic, 'right'))
                    .attr('transform', `translate(${xPos + bandwidth}, 0)`)
                    .style('fill', 'orange')
                    .style('opacity', 0.5);
            }
        });

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
            .text(
                `${t('distribution.distributionOf')} ${numericColumn} ${t(
                    'distribution.by'
                )} ${categoricalColumn}`
            );

        // Add y-axis label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -50)
            .attr('x', -plotHeight / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(numericColumn);

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
    }, [
        containerWidth,
        categoricalColumn,
        numericColumn,
        realData,
        syntheticData,
    ]);

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

export default ViolinChart;
