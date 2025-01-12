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
const height = 480 - margin.top - margin.bottom;

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

        // Reserve space for legend (120px width + 20px padding)
        const legendWidth = 140;
        const plotWidth =
            containerWidth - margin.left - margin.right - legendWidth;

        // Create scales
        const xScale = d3
            .scaleBand()
            .domain(categories)
            .range([0, plotWidth])
            .padding(0.1);

        // Limit the bandwidth to 200px max (100px per side)
        const bandwidth = Math.min(xScale.bandwidth() / 2, 50);

        // Calculate min and max with 10% padding on top
        const minValue =
            d3.min([
                ...realData.map(d => +d[numericColumn]),
                ...syntheticData.map(d => +d[numericColumn]),
            ]) || 0;
        const maxValue =
            d3.max([
                ...realData.map(d => +d[numericColumn]),
                ...syntheticData.map(d => +d[numericColumn]),
            ]) || 0;
        const paddedMaxValue = maxValue + (maxValue - minValue) * 0.2;

        const yScale = d3
            .scaleLinear()
            .domain([minValue, paddedMaxValue])
            .range([plotHeight, 0]);

        // Create violin plot for each category
        violinData.forEach(({ category, real, synthetic }) => {
            const xPos = xScale(category);
            if (xPos === undefined) return;

            // Function to create violin path
            const createViolin = (values: number[], side: 'left' | 'right') => {
                // Skip if no values
                if (values.length === 0) return null;

                // Calculate Scott's rule for bandwidth
                const std = Math.sqrt(d3.variance(values) || 0);
                // Adjust bandwidth calculation to be more suitable for visualization
                const bw = 1.06 * std * Math.pow(values.length, -0.2);

                // Create kernel density estimation with Gaussian kernel
                const kde = kernelDensityEstimator(
                    v => kernelGaussian(v, bw),
                    yScale.ticks(100)
                );
                const density: [number, number][] = kde(values);

                // Scale the density values
                const maxDensity = d3.max(density, d => d[1]) || 0;
                const normalizedDensity = density.map(
                    d =>
                        [d[0], (d[1] / maxDensity) * bandwidth] as [
                            number,
                            number,
                        ]
                );

                const widthScale = d3
                    .scaleLinear()
                    .domain([0, d3.max(normalizedDensity, d => d[1]) || 0])
                    .range([0, bandwidth]);

                const area = d3
                    .area<[number, number]>()
                    .x0(d => {
                        const width = widthScale(d[1]);
                        return side === 'left' ? -width : 0;
                    })
                    .x1(d => {
                        const width = widthScale(d[1]);
                        return side === 'left' ? 0 : width;
                    })
                    .y(d => yScale(d[0]))
                    .curve(d3.curveBasis);

                return area(normalizedDensity);
            };

            // Kernel functions
            function kernelDensityEstimator(
                kernel: (v: number) => number,
                X: number[]
            ): (V: number[]) => [number, number][] {
                return function (V: number[]) {
                    return X.map(x => [x, d3.mean(V, v => kernel(x - v)) || 0]);
                };
            }

            function kernelGaussian(v: number, bandwidth: number) {
                return (
                    Math.exp(-0.5 * Math.pow(v / bandwidth, 2)) /
                    (bandwidth * Math.sqrt(2 * Math.PI))
                );
            }

            // Calculate center position for the violin plot
            const centerPos = xPos + xScale.bandwidth() / 2;

            // Function to calculate quartiles
            const calculateQuartiles = (values: number[]) => {
                const sorted = [...values].sort((a, b) => a - b);
                return {
                    q1: d3.quantile(sorted, 0.25) || 0,
                    q2: d3.quantile(sorted, 0.5) || 0,
                    q3: d3.quantile(sorted, 0.75) || 0,
                };
            };

            // Function to draw quartile lines
            const drawQuartileLines = (
                values: number[],
                side: 'left' | 'right',
                color: string
            ) => {
                const quartiles = calculateQuartiles(values);
                const maxWidth = bandwidth;

                // Draw lines for each quartile
                Object.values(quartiles).forEach(q => {
                    svg.append('line')
                        .attr('x1', side === 'left' ? -maxWidth : 0)
                        .attr('x2', side === 'left' ? 0 : maxWidth)
                        .attr('y1', yScale(q))
                        .attr('y2', yScale(q))
                        .attr('transform', `translate(${centerPos}, 0)`)
                        .style('stroke', color)
                        .style('stroke-width', 2)
                        .style('stroke-dasharray', '3,3');
                });
            };

            // Draw real data violin (left side)
            if (real.length > 0) {
                const path = createViolin(real, 'left');
                if (path) {
                    svg.append('path')
                        .attr('d', path)
                        .attr('transform', `translate(${centerPos}, 0)`)
                        .style('fill', 'steelblue')
                        .style('opacity', 0.5);

                    drawQuartileLines(real, 'left', 'steelblue');
                }
            }

            // Draw synthetic data violin (right side)
            if (synthetic.length > 0) {
                const path = createViolin(synthetic, 'right');
                if (path) {
                    svg.append('path')
                        .attr('d', path)
                        .attr('transform', `translate(${centerPos}, 0)`)
                        .style('fill', 'orange')
                        .style('opacity', 0.5);

                    drawQuartileLines(synthetic, 'right', 'orange');
                }
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

        // Add legend at fixed position relative to plot area
        const legend = svg
            .append('g')
            .attr('class', 'legend')
            .attr('transform', `translate(${plotWidth + 20}, 30)`);

        // No need to adjust SVG width since we reserved space for legend

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
