import { t } from 'i18next';
import Markdown from 'react-markdown';
import { Fragment } from 'react/jsx-runtime';
import ErrorBoundary from './ErrorBoundary';
import DistributionBarChart from './graphs/DistributionBarChart';
import HeatMapChart from './graphs/HeatMap';
import { UnivariateCharts } from './UnivariateCharts';
import { Accordion } from './ui/accordion';
import { createHeatmapdata } from './createHeatmapdata';
import ViolinChart from './graphs/ViolinChart';
import GroupBarChart from './graphs/GroupBarChart';
import SimpleTable from './SimpleTable';

function countCategory2ForCategory1(
    data: Record<string, any>[],
    category1: string,
    category2: string,
    column1: string,
    column2: string
) {
    const count = data.filter(
        row => row[column1] === category1 && row[column2] === category2
    ).length;

    const total = data.filter(row => row[column1] === category1).length;
    if (total === 0) {
        return 0;
    }
    return (count / total) * 100;
}

interface DistributionReport {
    reportType: string;
    headingKey?: string;
    textKey?: string;
    params?: Record<string, string | number | boolean>;
    data?: string;
    titleKey?: string;
    showIndex?: boolean;
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

    const columnNames = Object.keys(realData[0]).filter(column => {
        return column != 'realOrSynthetic';
    });
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

                    if (report.reportType === 'table') {
                        if (!report.data) {
                            return null;
                        }
                        if (!report.titleKey) {
                            return null;
                        }

                        return (
                            <div key={indexReport} className="mb-4">
                                <Accordion
                                    title={t(report.titleKey)}
                                    content={
                                        <div>
                                            <p>&nbsp;</p>
                                            <SimpleTable
                                                data={JSON.parse(report.data)}
                                                title={t(report.titleKey)}
                                                showIndex={
                                                    report.showIndex ?? false
                                                }
                                            />
                                        </div>
                                    }
                                />
                            </div>
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
                        /*
							for all category colums (main column)
							- foreach column that is also a category column (secondary column)
								- get all categories of the main column
								- foreach category of the main column
									- count all the categories of the secondary column
									- add this to a data structure
								- create a historgram with the data structure
							
						*/
                        const charts = columnNames.map((column, index) => {
                            const dataType = dataTypes[column];
                            return columnNames.map((column2, index2) => {
                                if (column === column2 || index <= index2) {
                                    return null;
                                }
                                const dataType2 = dataTypes[column2];

                                if (
                                    dataType === 'category' &&
                                    dataType2 === 'category'
                                ) {
                                    const data = realData.reduce(
                                        (
                                            acc: Record<string, any>,
                                            row: Record<string, any>
                                        ) => {
                                            const category = row[column];
                                            const category2 = row[column2];
                                            if (!acc[category]) {
                                                acc[category] = {};
                                            }
                                            if (!acc[category][category2]) {
                                                acc[category][category2] = 0;
                                            }
                                            acc[category][category2]++;
                                            return acc;
                                        },
                                        {} as Record<
                                            string,
                                            Record<string, number>
                                        >
                                    );

                                    const categories = Object.keys(data);
                                    const categories2 = new Set<string>();
                                    for (const category in data) {
                                        for (const category2 in data[
                                            category
                                        ]) {
                                            categories2.add(category2);
                                        }
                                    }
                                    const categories2Array =
                                        Array.from(categories2);

                                    const histogramData = categories.map(
                                        category => {
                                            const categoryData =
                                                categories2Array.map(
                                                    category2 => {
                                                        return {
                                                            name: category2,
                                                            value:
                                                                data[category][
                                                                    category2
                                                                ] || 0,
                                                        };
                                                    }
                                                );
                                            return {
                                                name: category,
                                                values: categoryData,
                                            };
                                        }
                                    );
                                    return (
                                        <div key={column + column2}>
                                            <GroupBarChart
                                                yAxisLabel={t(
                                                    'distribution.frequency'
                                                )}
                                                data={histogramData}
                                                title={`${column} vs ${column2}`}
                                            />
                                        </div>
                                    );
                                } else if (
                                    dataType === 'float' &&
                                    dataType2 === 'category'
                                ) {
                                    return (
                                        <ViolinChart
                                            key={column + column2}
                                            categoricalColumn={column2}
                                            numericColumn={column}
                                            realData={realData}
                                            syntheticData={syntheticData}
                                            comparison={false}
                                        />
                                    );
                                }
                            });
                        });

                        return (
                            <div key={indexReport} className="mb-4">
                                <Accordion
                                    title={t(
                                        'syntheticData.bivariateDistributionRealData'
                                    )}
                                    content={<div>{charts}</div>}
                                />
                            </div>
                        );
                    }
                    if (
                        report.reportType ===
                        'bivariateDistributionSyntheticData'
                    ) {
                        console.log(
                            'bivariateDistributionSyntheticData',
                            columnNames
                        );
                        const charts = columnNames.map(
                            (column, indexcolumn1) => {
                                const dataType = dataTypes[column];
                                return columnNames.map(
                                    (column2, indexcolumn2) => {
                                        const dataType2 = dataTypes[column2];
                                        if (indexcolumn1 >= indexcolumn2) {
                                            return null;
                                        }

                                        if (
                                            dataType === 'category' &&
                                            dataType2 === 'float'
                                        ) {
                                            return (
                                                <ViolinChart
                                                    key={column + column2}
                                                    categoricalColumn={column}
                                                    numericColumn={column2}
                                                    realData={realData}
                                                    syntheticData={
                                                        syntheticData
                                                    }
                                                    comparison={true}
                                                />
                                            );
                                        } else if (
                                            dataType === 'float' &&
                                            dataType2 === 'category'
                                        ) {
                                            return (
                                                <ViolinChart
                                                    key={column + column2}
                                                    categoricalColumn={column2}
                                                    numericColumn={column}
                                                    realData={realData}
                                                    syntheticData={
                                                        syntheticData
                                                    }
                                                    comparison={true}
                                                />
                                            );
                                        } else if (
                                            dataType === 'category' &&
                                            dataType2 === 'category'
                                        ) {
                                            const categories = Array.from(
                                                new Set([
                                                    ...realData.map(
                                                        (d: any) => d[column]
                                                    ),
                                                ])
                                            );
                                            const categories2 = Array.from(
                                                new Set([
                                                    ...realData.map(
                                                        (d: any) => d[column2]
                                                    ),
                                                ])
                                            );

                                            return (
                                                <div>
                                                    <h2 className="text-center font-bold mt-2 text-[12px]">
                                                        {column} vs {column2}
                                                    </h2>
                                                    <div className="flex flex-row w-full overflow-auto gap-4">
                                                        {categories.map(
                                                            item => (
                                                                <div
                                                                    key={item}
                                                                    className="flex flex-col"
                                                                >
                                                                    <GroupBarChart
                                                                        colorRange={[
                                                                            'steelblue',
                                                                            'orange',
                                                                        ]}
                                                                        yAxisLabel={t(
                                                                            'distribution.percentage'
                                                                        )}
                                                                        title={`${column} = ${item}`}
                                                                        data={categories2.map(
                                                                            item2 => ({
                                                                                // count : number of times where item2 appears in the data for category2 and rows where category1 = item
                                                                                name: `${item2}`,
                                                                                values: [
                                                                                    {
                                                                                        name: t(
                                                                                            'distribution.realData'
                                                                                        ),
                                                                                        value: countCategory2ForCategory1(
                                                                                            realData,
                                                                                            item,
                                                                                            item2,
                                                                                            column,
                                                                                            column2
                                                                                        ),
                                                                                    },
                                                                                    {
                                                                                        name: t(
                                                                                            'distribution.syntheticData'
                                                                                        ),
                                                                                        value: countCategory2ForCategory1(
                                                                                            syntheticData,
                                                                                            item,
                                                                                            item2,
                                                                                            column,
                                                                                            column2
                                                                                        ),
                                                                                    },
                                                                                ],
                                                                            })
                                                                        )}
                                                                    />
                                                                </div>
                                                            )
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }
                                );
                            }
                        );
                        return (
                            <div key={indexReport} className="mb-4">
                                <Accordion
                                    title={t(
                                        'syntheticData.bivariateDistributionSyntheticData'
                                    )}
                                    content={
                                        <div>
                                            <Markdown className="py-4 markdown">
                                                {t(
                                                    'syntheticData.bivariateText',
                                                    {
                                                        samples:
                                                            syntheticData.length,
                                                    }
                                                )}
                                            </Markdown>
                                            {charts}
                                        </div>
                                    }
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
                                            content={
                                                <>
                                                    <Markdown className="py-4 markdown">
                                                        {t(
                                                            'syntheticData.univariateText',
                                                            {
                                                                samples:
                                                                    syntheticData.length,
                                                            }
                                                        )}
                                                    </Markdown>
                                                    {Object.keys(
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
                                                                    ) =>
                                                                        row[
                                                                            columnName
                                                                        ]
                                                                );
                                                            const syntheticDataColumn =
                                                                syntheticData.map(
                                                                    (
                                                                        row: Record<
                                                                            string,
                                                                            number
                                                                        >
                                                                    ) =>
                                                                        row[
                                                                            columnName
                                                                        ]
                                                                );
                                                            return (
                                                                <ErrorBoundary
                                                                    key={
                                                                        columnIndex
                                                                    }
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
                                                </>
                                            }
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
                                                    colors="LtRd"
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
