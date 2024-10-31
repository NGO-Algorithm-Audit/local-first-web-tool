export interface BiasDetectionParameters {
    clusterSize: number;
    iterations: number;
    targetColumn: string;
    dataType: string;
    higherIsBetter: boolean;
    isDemo: boolean;
}
