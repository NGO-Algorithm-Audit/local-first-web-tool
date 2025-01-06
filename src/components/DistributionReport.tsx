import { t } from 'i18next';
import Markdown from 'react-markdown';
import { Fragment } from 'react/jsx-runtime';
import ErrorBoundary from './ErrorBoundary';
import DistributionBarChart from './graphs/DistributionBarChart';
import HeatMapChart from './graphs/HeatMap';
import { UnivariateCharts } from './UnivariateCharts';
import { Accordion } from './ui/accordion';
import { createHeatmapdata } from './createHeatmapdata';

interface DistributionReport {
    reportType: string;
    headingKey?: string;
    textKey?: string;
    params?: Record<string, string | number | boolean>;
}
export interface DistributionReportProps {
    dataTypes: string;
    real: string;
    synthetic: string;
    reports: DistributionReport[];
    realCorrelations: string;
    syntheticCorrelations: string;
    combined_data: string;
}
export const DistributionReport = (
    distributionReportProps: DistributionReportProps
) => {
    const realData = JSON.parse(distributionReportProps.real);
    const syntheticData = JSON.parse(distributionReportProps.synthetic);
    const dataTypes = JSON.parse(distributionReportProps.dataTypes);
    console.log('reports', distributionReportProps.reports);
    return (
        <div className="flex flex-col gap-6">
            {distributionReportProps.reports.map(
                (report: DistributionReport, indexReport: number) => {
                    if (report.reportType === 'heading' && report.headingKey) {
                        return (
                            <h5
                                key={indexReport}
                                className="text-gray-800 font-semibold mb-4"
                            >
                                {t(report.headingKey, report.params)}
                            </h5>
                        );
                    }
                    if (report.reportType === 'text' && report.textKey) {
                        return (
                            <Markdown
                                key={indexReport}
                                className="-mt-2 text-gray-800 markdown"
                            >
                                {t(report.textKey, report.params)}
                            </Markdown>
                        );
                    }
                    if (
                        report.reportType === 'univariateDistributionRealData'
                    ) {
                        return (
                            <div key={indexReport} className="mb-4">
                                <Accordion
                                    title={t('syntheticData.univariateCharts')}
                                    content={
                                        <UnivariateCharts
                                            realData={realData}
                                            syntheticData={syntheticData}
                                            dataTypes={dataTypes}
                                            combined_data={JSON.parse(
                                                distributionReportProps.combined_data
                                            )}
                                            comparison={false}
                                        />
                                    }
                                />
                            </div>
                        );
                    }
                    if (report.reportType === 'bivariateDistributionRealData') {
                        return (
                            <div key={indexReport} className="mb-4">
                                <Accordion
                                    title={t(
                                        'syntheticData.bivariateDistributionRealData'
                                    )}
                                    content={<p>PLACEHOLDER</p>}
                                />
                            </div>
                        );
                    }
                    if (
                        report.reportType ===
                        'bivariateDistributionSyntheticData'
                    ) {
                        return (
                            <div key={indexReport} className="mb-4">
                                <Accordion
                                    title={t(
                                        'syntheticData.bivariateDistributionSyntheticData'
                                    )}
                                    content={<p>PLACEHOLDER</p>}
                                />
                            </div>
                        );
                    }
                    if (report.reportType === 'correlationRealData') {
                        const { columns: realColumns, data: convertedData } =
                            createHeatmapdata(
                                distributionReportProps.realCorrelations
                            );
                        return (
                            <div key={indexReport} className="mb-4">
                                <Accordion
                                    title={t(
                                        'syntheticData.correlationRealdata'
                                    )}
                                    content={
                                        <div className="grid lg:grid-cols-[50%_50%] grid-cols-[100%]">
                                            <div className="col-[1]">
                                                <HeatMapChart
                                                    columns={realColumns}
                                                    data={convertedData}
                                                    title={t(
                                                        'heatmap.realdata'
                                                    )}
                                                    rangeMax={1}
                                                    rangeMin={-1}
                                                    colors="RdYlBu"
                                                />
                                            </div>
                                        </div>
                                    }
                                />
                            </div>
                        );
                    }
                    if (
                        report.reportType ===
                        'univariateDistributionSyntheticData'
                    ) {
                        return (
                            <Fragment key={indexReport}>
                                {realData.length === 0 ||
                                syntheticData.length === 0 ? null : (
                                    <div className="mb-4">
                                        <Accordion
                                            title={t(
                                                'syntheticData.univariateDistributionSyntheticData'
                                            )}
                                            content={Object.keys(
                                                realData[0]
                                            ).map(
                                                (
                                                    columnName: string,
                                                    columnIndex: number
                                                ) => {
                                                    const realDataColumn =
                                                        realData.map(
                                                            (
                                                                row: Record<
                                                                    string,
                                                                    number
                                                                >
                                                            ) => row[columnName]
                                                        );
                                                    const syntheticDataColumn =
                                                        syntheticData.map(
                                                            (
                                                                row: Record<
                                                                    string,
                                                                    number
                                                                >
                                                            ) => row[columnName]
                                                        );
                                                    return (
                                                        <ErrorBoundary
                                                            key={columnIndex}
                                                        >
                                                            <DistributionBarChart
                                                                dataType={
                                                                    dataTypes[
                                                                        columnName
                                                                    ]
                                                                }
                                                                realData={
                                                                    realDataColumn
                                                                }
                                                                syntheticData={
                                                                    syntheticDataColumn
                                                                }
                                                                column={
                                                                    columnName
                                                                }
                                                            />
                                                        </ErrorBoundary>
                                                    );
                                                }
                                            )}
                                        ></Accordion>
                                    </div>
                                )}
                            </Fragment>
                        );
                    }

                    if (report.reportType === 'correlationSyntheticData') {
                        const {
                            columns: synthticColumns,
                            data: syntheticData,
                        } = createHeatmapdata(
                            distributionReportProps.syntheticCorrelations
                        );
                        return (
                            <div className="mb-4" key={indexReport}>
                                <Accordion
                                    title={t(
                                        'syntheticData.correlationSyntheticData'
                                    )}
                                    content={
                                        <div className="grid lg:grid-cols-[50%_50%] grid-cols-[100%]">
                                            <div className="col-[1]">
                                                <HeatMapChart
                                                    columns={synthticColumns}
                                                    data={syntheticData}
                                                    title={t(
                                                        'heatmap.syntheticdata'
                                                    )}
                                                    rangeMax={2}
                                                    rangeMin={0}
                                                    colors="RdGn"
                                                />
                                            </div>
                                        </div>
                                    }
                                ></Accordion>
                            </div>
                        );
                    }
                    return null;
                }
            )}
        </div>
    );
};
