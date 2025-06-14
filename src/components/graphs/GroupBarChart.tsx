import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { DataLabel } from './DataLabel';

interface Data extends DataLabel {
    values: { value: number; name: string }[];
}

interface GroupBarChartProps {
    yAxisLabel: string;
    title: string;
    data: Data[];
    colorRange?: string[];
    showMeanLine: boolean;
    isViridis?: boolean;
}

const margin = { top: 30, right: 50, bottom: 40, left: 80 };
const height = 300 - margin.top - margin.bottom;
const barWidth = 0.05 * window.innerWidth < 40 ? 40 : 0.05 * window.innerWidth;
const barGap = 5;

const GroupBarChart = ({
    title,
    data,
    yAxisLabel,
    colorRange,
    showMeanLine,
    isViridis,
}: GroupBarChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800); // Default width

    //const legendWidth = 140;
    // const plotWidth =
    //     containerWidth -
    //     margin.left -
    //     margin.right ;

    const fx = useMemo(
        () =>
            d3
                .scaleBand()
                .domain(new Set(data.map(d => d.name)))
                .range([
                    0,
                    Math.max(
                        containerWidth - margin.right - margin.left,
                        data.length * (barWidth + barGap) -
                            margin.right -
                            margin.left
                    ),
                ])
                .padding(0.2),
        [data, containerWidth]
    );
    const flattenData = data.flatMap(d => d.values);

    const groupbarNames = new Set(flattenData.map(d => d.name));
    const x0 = d3
        .scaleBand()
        .domain(groupbarNames)
        .rangeRound([0, fx.bandwidth()])
        .padding(0.05);

    const colors = new Array(Math.max(Math.min(groupbarNames.size, 11), 3));
    for (let i = 0; i < colors.length; i++) {
        colors[i] = d3.interpolateViridis(i / colors.length);
    }
    const color = d3
        .scaleOrdinal()
        .domain(groupbarNames)
        .range(
            colorRange ??
                (isViridis
                    ? colors
                    : d3.schemeSpectral[
                          Math.max(Math.min(groupbarNames.size, 11), 3)
                      ])
        )
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
            .attr('class', `min-h-[${height}px]`)
            .attr(
                'width',
                Math.max(containerWidth, margin.left + data.length * barWidth)
            )
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        svg.append('defs')
            .append('style')
            .attr('type', 'text/css')
            .text(
                "@import url('https://fonts.googleapis.com/css2?family=Avenir:wght@600');"
            );

        // Append x-axis
        const xAxis = svg
            .append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(fx).tickSizeOuter(0));

        const xAxisFirstColumnLabel = xAxis.select('text');
        xAxisFirstColumnLabel.style('text-decoration', 'underline');

        // Append y-axis
        svg.append('g').call(d3.axisLeft(y).ticks(10, 's'));

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

        if (showMeanLine) {
            // Calculate the mean of all bar values

            const meanValue = d3.mean(flattenData, d => d.value) ?? 0;

            // Draw a dotted line representing the mean value
            svg.append('line')
                .attr('x1', 0)
                .attr(
                    'x2',
                    Math.max(containerWidth, data.length * barWidth) -
                        margin.right
                )
                .attr('y1', y(meanValue))
                .attr('y2', y(meanValue))
                .attr('stroke', 'black')
                .attr('stroke-width', 2)
                .attr('stroke-dasharray', '4 4')
                .attr('opacity', 0.8)
                .attr('class', 'mean-line');

            // Add a label for the mean line
            svg.append('text')
                .attr('x', margin.left + 30 + 50)
                .attr('y', y(meanValue) - 5)
                .attr('text-anchor', 'end')
                .attr('fill', 'black')
                .style('font-size', '12px')
                .text(`Mean: ${y.tickFormat(100, 's')(meanValue)}`);
        }
        // Append legend
        const legend = svg
            .append('g')
            .attr(
                'transform',
                `translate(${Math.max(containerWidth, data.length * barWidth) - margin.left - margin.right + 20}, 0)`
            );

        // Append title to the svg
        svg.append('text')
            .attr('x', (containerWidth - margin.left - margin.right) / 2)
            .attr('y', -10)
            .attr('text-anchor', 'middle')
            .style('font-size', '12px')
            .style('font-weight', 'bold')
            .text(title);

        // Add y-axis label
        svg.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('y', -50)
            .attr('x', -height / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '12px')
            .text(yAxisLabel);

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

        if (legend) {
            const legendBBox = legend.node()?.getBBox();
            if (legendBBox) {
                legend.attr(
                    'transform',
                    `translate(${Math.max(containerWidth, data.length * barWidth) - margin.left - margin.right - legendBBox.width}, 10)`
                );
            }
        }

        xAxis.selectAll('.tick text').call((text, width) => {
            text.each(function () {
                let word: string | undefined = '';
                const text = d3.select(this),
                    words = text.text().split(/\n+/).reverse(),
                    lineHeight = 1.1, // ems
                    y = text.attr('y'),
                    dy = parseFloat(text.attr('dy'));
                let lineNumber = 0;
                let line: string[] = [];
                let tspan = text
                    .text(null)
                    .append('tspan')
                    .attr('x', 0)
                    .attr('y', y)
                    .attr('dy', dy + 'em');
                // eslint-disable-next-line no-cond-assign
                while ((word = words.pop())) {
                    line.push(word);
                    tspan.text(line.join(' '));
                    if (
                        tspan?.node?.()?.getComputedTextLength?.() ??
                        0 > width
                    ) {
                        line.pop();
                        tspan.text(line.join(' '));
                        line = [word];
                        tspan = text
                            .append('tspan')
                            .attr('x', 0)
                            .attr('y', y)
                            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                            .text(word);
                    }
                }
            });
        }, barWidth);
    }, [data, x0, y, color, title, containerWidth]);

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
        <div
            ref={containerRef}
            style={{ width: '100%', display: 'flex', overflowX: 'auto' }}
            className={`min-h-[${height}px] flex-col`}
        >
            <svg ref={svgRef}></svg>
        </div>
    );
};

export default GroupBarChart;
