import { useEffect, useRef, useMemo, useState } from 'react';
import * as d3 from 'd3';
import { DataLabel } from './DataLabel';

interface Data extends DataLabel {
    values: { value: number; name: string }[];
}

interface ClusterCategoriesDistributionChartProps {
    yAxisLabel: string;
    title: string;
    data: Data[];
    colorRange?: string[];
    showMeanLine: boolean;
    isViridis?: boolean;
    means: { mean: number; category: string }[];
    categories: string[];
}

const margin = { top: 30, right: 50, bottom: 40, left: 80 };
const height = 300 - margin.top - margin.bottom;
const barWidth = 30;

const ClusterCategoriesDistributionChart = ({
    title,
    data,
    yAxisLabel,
    colorRange,
    showMeanLine,
    isViridis,
    means,
    categories,
}: ClusterCategoriesDistributionChartProps) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [containerWidth, setContainerWidth] = useState(800); // Default width

    const groupWidth = barWidth * (data?.[0]?.values?.length ?? 1);
    const clusterGroupTotalWidth = data.length * groupWidth;
    const groupGap = barWidth * 2;
    const groupGapTotalWidth = data.length * groupGap; // Total Width of all gaps between groups

    const fx = useMemo(
        () =>
            d3
                .scaleBand()
                .domain(new Set(data.map(d => d.name)))
                .range([0, clusterGroupTotalWidth + groupGapTotalWidth]),
        [containerWidth]
    );
    const flattenData = data.flatMap(d => d.values);

    const groupbarNames = new Set(flattenData.map(d => d.name));

    const colors = new Array(Math.max(Math.min(groupbarNames.size, 11), 3));
    for (let i = 0; i < colors.length; i++) {
        if (i == 0) {
            colors[0] = d3.interpolateViridis(1);
        } else {
            colors[i] = d3.interpolateViridis((i - 1) / colors.length);
        }
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
                Math.max(
                    containerWidth,
                    clusterGroupTotalWidth +
                        groupGapTotalWidth +
                        margin.left +
                        margin.right
                )
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

        // Draw bars
        svg.selectAll('rect')
            .data(data)
            .join('g')
            .attr('transform', d => `translate(${fx(d.name)},0)`)
            .selectAll()
            .data(d => d.values)
            .join('rect')
            .attr('x', (_d, index) => barWidth * index)
            .attr('y', d => y(d.value) ?? 0)
            .attr('width', barWidth)
            .attr('height', d => y(0) - y(d.value))
            .attr('fill', d => color(d.name)?.toString() ?? '#ccc');

        const xAxis = svg
            .append('g')
            .attr('transform', `translate(0, ${height})`);

        const xPositions = data.map((d, i) => ({
            label: d.name,
            x: i * (groupWidth + groupGap) + groupWidth / 2, // center of the bar
        }));

        xAxis
            .selectAll('line')
            .data(xPositions)
            .enter()
            .append('line')
            .attr('x1', 0)
            .attr('x2', clusterGroupTotalWidth + groupGapTotalWidth)
            .attr('y1', 0)
            .attr('y2', 1)
            .attr('stroke', 'black');

        xAxis
            .selectAll('text')
            .data(xPositions)
            .enter()
            .append('text')
            .attr('x', d => d.x)
            .attr('y', 20)
            .attr('title', d => d.label)
            .attr('width', groupWidth)
            .attr('text-anchor', 'middle')
            .text(d => d.label)
            .each(function () {
                const width = groupWidth;
                const self = d3.select(this);
                const node = self.node();
                if (!node) return;
                let textLength = node.getComputedTextLength(),
                    text = self.text();
                while (textLength > width && text.length > 0) {
                    text = text.slice(0, -1);
                    self.text(text + '...');
                    textLength = node.getComputedTextLength();
                }
            })
            .append('title')
            .text(d => d.label);

        const xAxisFirstColumnLabel = xAxis.select('text');
        xAxisFirstColumnLabel.style('text-decoration', 'underline');

        // Append y-axis
        svg.append('g').call(d3.axisLeft(y).ticks(10, 's'));

        if (showMeanLine) {
            // Calculate the mean of all bar values
            data.forEach((_d, index) => {
                const category = categories[index];
                const meansForCategory = means.find(
                    m => m.category === category
                );
                const meanValue = meansForCategory?.mean ?? 0;

                // Draw a dotted line representing the mean value
                svg.append('line')
                    .attr('x1', (groupWidth + groupGap) * index)
                    .attr(
                        'x2',
                        (groupWidth + groupGap) * index + groupWidth + groupGap
                    )
                    .attr('y1', y(meanValue))
                    .attr('y2', y(meanValue))
                    .attr('stroke', 'red')
                    .attr('stroke-width', 2)
                    .attr('stroke-dasharray', '4 4')
                    .attr('opacity', 0.8)
                    .attr('class', 'mean-line');

                // Add a label for the mean line
                svg.append('text')
                    .attr('x', (groupWidth + groupGap) * index)
                    .attr('y', y(meanValue) - 5)
                    .attr('text-anchor', 'start')
                    .attr('fill', 'red')
                    .style('font-size', '12px')
                    .text(`Mean: ${y.tickFormat(100, 's')(meanValue)}%`);
            });
        }

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
    }, [data, y, color, title, containerWidth]);

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

export default ClusterCategoriesDistributionChart;
