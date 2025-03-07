import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { autoBandwidth, extentLinear, seriesSvgBar } from 'd3fc';
interface HeatMapChartProps {
    title: string;
    data: number[][];
    columns: string[];
    rangeMin: number;
    rangeMax: number;
    colors: 'RdYlBu' | 'LtRd';
    showLegend?: boolean;
}

// Define margins for the chart
const margin = { top: 50, right: 0, bottom: 40, left: 0 };
// Define height for the chart, adjusting for margins
const height = 300 - margin.top - margin.bottom;

const HeatMapChart = ({
    title,
    data,
    columns,
    rangeMin,
    rangeMax,
    colors,
    showLegend = true,
}: HeatMapChartProps) => {
    const svgRef = useRef(null); // Reference to the SVG element
    const containerRef = useRef(null); // Reference to the container div
    const [containerWidth, setContainerWidth] = useState(800); // Default container width

    useEffect(() => {
        // Clear any previous SVG content to avoid overlapping elements
        d3.select(svgRef.current).selectAll('*').remove();
        const legendWidth = 150;
        const widthForHeatmap = containerWidth - 50 - legendWidth;
        const barWidth = Math.max(
            10,
            Math.floor(Math.min(widthForHeatmap, 500) / data[0].length)
        );
        const barHeight = barWidth;
        const heatMapTop = 50;
        const svg = d3
            .select(svgRef.current)
            .attr('width', containerWidth)
            .attr('height', heatMapTop + 50 + data.length * barHeight)
            .append('g');

        svg.append('defs')
            .append('style')
            .attr('type', 'text/css')
            .text(
                "@import url('https://fonts.googleapis.com/css2?family=Avenir:wght@600');"
            );

        const customColors = ['#ddebd5', '#f4b183', '#c15811', '#f50101'];

        // Create a linear color scale
        const customColorScale = d3
            .scaleLinear<string>()
            .domain([
                0,
                1 / (customColors.length - 1),
                2 / (colors.length - 1),
                1,
            ])
            .range(customColors);

        const colorScale =
            colors === 'RdYlBu'
                ? d3
                      .scaleSequential()
                      .domain([rangeMin, rangeMax])
                      .interpolator(d3.interpolateRdYlBu)
                : customColorScale;

        const domain = colorScale.domain();

        const paddedDomain = extentLinear().pad([0.1, 0.1]).padUnit('percent')(
            domain
        );
        const [min, max] = paddedDomain;
        const heightBar = data.length * barHeight;
        const expandedDomain = d3.range(min, max, (max - min) / heightBar);

        const xScale = d3
            .scaleBand()
            .domain([0 as unknown as string, 1 as unknown as string])
            .range([0, 60]);

        const yScale = d3
            .scaleLinear()
            .domain(paddedDomain)
            .range([heightBar, 0]);

        data.forEach((dataRow, rowIndex) => {
            dataRow.forEach((dataCell, cellIndex) => {
                svg.append('rect')
                    .attr('x', 50 + cellIndex * barWidth)
                    .attr('y', heatMapTop + rowIndex * barHeight)
                    .attr('width', barWidth)
                    .attr('height', barHeight)
                    .style('fill', function () {
                        return colorScale(dataCell);
                    });

                const color = d3.color(colorScale(dataCell));
                if (!color) return 'black';

                // Get RGB values using d3.rgb() ..
                const rgb = d3.rgb(color);

                // Calculate perceived brightness
                const luminance =
                    (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
                const textColor = luminance < 0.5 ? 'white' : 'black';
                svg.append('text')
                    .attr('x', barWidth / 2 + 50 + cellIndex * barWidth)
                    .attr(
                        'y',
                        heatMapTop + barHeight / 2 + rowIndex * barHeight
                    )
                    .attr('text-anchor', 'middle')
                    .attr('dominant-baseline', 'middle')
                    .style('fill', textColor)
                    .style('font-size', '10px')
                    .text(dataCell.toFixed(2));
            });
        });

        svg.append('g')
            .selectAll('text')
            .data(data[0])
            .join('text')
            .attr('x', (_, i) => 50 + i * barWidth + barWidth / 2)
            .attr('y', heatMapTop + 20 + barHeight * data.length)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .text((_, i) => `${columns?.[i]}`);

        svg.append('g')
            .selectAll('text')
            .data(data)
            .join('text')
            .attr('x', 40)
            .attr('y', (_, i) => heatMapTop + i * barHeight + barHeight / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .style('font-size', '12px')
            .text((_, i) => `${columns?.[i]}`);
        if (showLegend) {
            const svgBar = autoBandwidth(seriesSvgBar())
                .xScale(xScale)
                .yScale(yScale)
                .crossValue(0)
                .baseValue((_: unknown, i: number) =>
                    i > 0 ? expandedDomain[i - 1] : 0
                )
                .mainValue((d: number) => d)
                .decorate(
                    (
                        selection: d3.Selection<
                            SVGGElement,
                            unknown,
                            null,
                            undefined
                        >
                    ) => {
                        selection
                            .selectAll('path')
                            .style('fill', d =>
                                colorScale(d as unknown as d3.NumberValue)
                            );
                    }
                );

            const axisLabel = d3
                .axisRight(yScale)
                .tickValues(
                    colors === 'RdYlBu'
                        ? [...domain, (domain[1] + domain[0]) / 2]
                        : [...domain]
                )
                .tickSizeOuter(0);

            const legendBar = svg
                .append('g')
                .datum(expandedDomain)
                .call(svgBar);
            legendBar.attr(
                'transform',
                `translate(${legendWidth - 50 + barWidth * data.length},${heatMapTop})`
            );

            svg.append('g')
                .attr(
                    'transform',
                    `translate(${legendWidth - 50 + barWidth * data.length + 20},${heatMapTop})`
                )
                .datum(expandedDomain)
                .call(axisLabel)
                .select('.domain')
                .attr('visibility', 'hidden');
        }
        d3.select(svgRef.current)
            .append('text')
            .attr(
                'x',
                50 + (barWidth * data.length) / 2
                //showLegend ? containerWidth / 2 : containerWidth / 2 - 50
            )
            .attr('y', 20)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .style('font-weight', 'bold')
            .text(`${title}`);
    }, [data, title, containerWidth]);

    useEffect(() => {
        // Set up the ResizeObserver to track changes in the container's size
        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || entries.length === 0) return;
            const { width } = entries[0].contentRect;
            if (width > 0) {
                setContainerWidth(width);
            }
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
        <div className="flex flex-col gap-4">
            {/* <h3 className="text-center font-semibold text-base">{title}</h3> */}
            <div
                ref={containerRef}
                style={{ width: '100%', display: 'flex', overflowX: 'auto' }}
                className={`min-h-[${height}px] flex-col`}
            >
                <svg ref={svgRef}></svg>
            </div>
        </div>
    );
};

export default HeatMapChart;
