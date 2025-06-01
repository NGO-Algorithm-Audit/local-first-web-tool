import * as d3 from 'd3';
import { t } from 'i18next';

export interface ClusterLegendProps {
    clusterCount: number;
}

export default function ClusterLegend({ clusterCount }: ClusterLegendProps) {
    const colors = d3.schemeCategory10.slice(0, clusterCount);
    for (let i = 0; i < colors.length; i++) {
        if (i == 0) {
            colors[0] = d3.interpolateViridis(1);
        } else {
            colors[i] = d3.interpolateViridis((i - 1) / colors.length);
        }
    }
    return (
        <div className="flex flex-row items-start gap-2">
            {Array.from({ length: clusterCount }, (_, i) => (
                <div key={i} className="flex items-center mb-2">
                    <span
                        className="inline-block w-4 h-4 mr-2"
                        style={{ backgroundColor: colors[i] }}
                    ></span>
                    <span>
                        {i == 0
                            ? t('biasAnalysis.clusters.legendMostBiasedCluster')
                            : `Cluster ${i}`}
                    </span>
                </div>
            ))}
        </div>
    );
}
