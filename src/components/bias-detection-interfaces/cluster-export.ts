export interface ClusterInfo {
    mostBiasedCluster: object;
    otherClusters: object;
    date: Date;
    iter: number;
    clusters: number;
    targetColumn: string;
    dataType: string;
    higherIsBetter: boolean;
    isDemo: boolean;
}
