import SimpleTable from './SimpleTable';
import SingleBarChart from './graphs/SingleBarChart';
import GroupBarChart from './graphs/GroupBarChart';
import ErrorBoundary from './ErrorBoundary';
import { getLabel } from './graphs/get-label';
import { CSVData } from './bias-detection-interfaces/csv-data';
import { Fragment } from 'react/jsx-runtime';
import { Accordion } from './ui/accordion';
import { useTranslation } from 'react-i18next';
import { DistributionReport } from './DistributionReport';
import { MarkdownWithTooltips } from './MarkdownWithTooltips';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import ClusterCategoriesDistributionChart from './graphs/ClusterCategoriesDistributionChart';
import ClusterLegend from './graphs/ClusterLegend';
import FilterSelect from './ui/FilterSelect';
import { useState } from 'react';

interface Comparison {
    key: string;
    params: Record<string, string | number | boolean>;
}

const createArrayFromPythonDictionary = (dict: Record<string, number>) => {
    const resultArray = [];
    for (const [key, value] of Object.entries(dict)) {
        if (typeof value === 'number') {
            resultArray.push({
                value: value,
                name: key,
            });
        }
    }
    return resultArray;
};

export default function ComponentMapper({
    items,
    data,
}: {
    items: string[];
    data: CSVData;
}) {
    const [categorieFilter, setCategorieFilter] = useState<string | null>();
    const { t } = useTranslation();
    const components = items
        .map((r, index) => {
            try {
                const resultItem = JSON.parse(r);

                switch (resultItem.type) {
                    case 'data-set-preview':
                        return (
                            <Fragment key={index}>
                                {data.data.length > 0 && (
                                    <SimpleTable
                                        data={data.data.slice(0, 5)}
                                        title="datasetPreview"
                                        showIndex={true}
                                    />
                                )}
                            </Fragment>
                        );

                    case 'table':
                        return (
                            <SimpleTable
                                key={index}
                                data={JSON.parse(resultItem.data)}
                                title={t(resultItem.title)}
                                showIndex={resultItem.showIndex ?? false}
                                translate={resultItem.translate ?? false}
                            />
                        );

                    case 'list':
                        if (resultItem.list) {
                            console.log('list', resultItem.list);
                            const content = resultItem.list.map(
                                (
                                    listItem: {
                                        key: string;
                                        value: string;
                                    },
                                    index: number
                                ) => (
                                    <li key={`list-${index}`}>
                                        <span className="font-bold">{`${listItem.key}`}</span>
                                        {`: ${listItem.value}`}
                                    </li>
                                )
                            );

                            return (
                                <div key={index} className="content-list">
                                    <ul>{content}</ul>
                                </div>
                            );
                        }
                        return null;
                    case 'accordion':
                        if (resultItem.comparisons) {
                            // Handle translation of comparisons
                            const content = resultItem.comparisons
                                .map((comparison: Comparison) =>
                                    t(comparison.key, comparison.params)
                                )
                                .join('\n');

                            return (
                                <Accordion
                                    key={index}
                                    title={t(resultItem.titleKey || '')}
                                    content={content}
                                />
                            );
                        }
                        return null;

                    case 'heading':
                        return (
                            <h5
                                key={index}
                                className="text-gray-800 font-semibold"
                            >
                                {resultItem.headingKey
                                    ? t(
                                          resultItem.headingKey,
                                          resultItem.params
                                      )
                                    : resultItem.data}
                            </h5>
                        );

                    case 'text':
                        return (
                            <TooltipProvider key={index}>
                                <MarkdownWithTooltips
                                    key={index}
                                    className="-mt-2 text-gray-800 markdown"
                                >
                                    {resultItem.key
                                        ? t(resultItem.key, resultItem.params)
                                        : resultItem.data}
                                </MarkdownWithTooltips>
                            </TooltipProvider>
                        );
                    case 'clusterCategorieSelect': {
                        console.log(
                            'clusterCategorieSelect',
                            resultItem.values,
                            resultItem.defaultValue
                        );
                        return (
                            <div className="flex items-center" key={index}>
                                <ErrorBoundary key={index}>
                                    <div>
                                        <FilterSelect
                                            filterValues={resultItem.values}
                                            defaultValue={
                                                resultItem.defaultValue
                                            }
                                            onFilter={value => {
                                                setCategorieFilter(value);
                                                console.log('value', value);
                                            }}
                                        />
                                    </div>
                                </ErrorBoundary>
                            </div>
                        );
                    }
                    case 'cluster_legend': {
                        return (
                            <div
                                className="flex items-center justify-center"
                                key={index}
                            >
                                <ErrorBoundary key={index}>
                                    <ClusterLegend
                                        clusterCount={
                                            resultItem.clusterCount ?? 0
                                        }
                                    />
                                </ErrorBoundary>
                            </div>
                        );
                    }
                    case 'clusterCategorieDistribution': {
                        //

                        const distributionData = JSON.parse(
                            resultItem.data
                        )?.map((x: Record<string, number>, index: number) => {
                            const translationID = getLabel(index);
                            return {
                                name: resultItem.categories
                                    ? resultItem.categories[index]
                                    : t(
                                          translationID.key,
                                          translationID.params
                                      ),
                                values: createArrayFromPythonDictionary(x),
                            };
                        });
                        console.log(
                            'cluster categories distribution',
                            resultItem,
                            distributionData
                        );

                        return (
                            <ErrorBoundary key={index}>
                                {categorieFilter ===
                                    resultItem.selectFilterGroup ||
                                (!categorieFilter &&
                                    resultItem.selectFilterGroup ===
                                        resultItem.defaultFilter) ||
                                !resultItem.selectFilterGroup ? (
                                    <>
                                        <h5
                                            key={index}
                                            className="text-gray-800 font-semibold"
                                        >
                                            {resultItem.headingKey
                                                ? t(
                                                      resultItem.headingKey,
                                                      resultItem.params
                                                  )
                                                : resultItem.data}
                                        </h5>
                                        <ClusterCategoriesDistributionChart
                                            showMeanLine={true}
                                            data={distributionData}
                                            yAxisLabel={t(
                                                'distribution.frequency'
                                            )}
                                            title={resultItem.title ?? ''}
                                            means={resultItem.means ?? []}
                                            isViridis={
                                                resultItem.categories !==
                                                undefined
                                            }
                                        />
                                    </>
                                ) : null}
                            </ErrorBoundary>
                        );
                    }
                    case 'histogram': {
                        const histogramData = JSON.parse(resultItem.data)?.map(
                            (x: Record<string, number>, index: number) => {
                                const translationID = getLabel(index);
                                return {
                                    name: resultItem.categories
                                        ? resultItem.categories[index]
                                        : t(
                                              translationID.key,
                                              translationID.params
                                          ),
                                    values: createArrayFromPythonDictionary(x),
                                };
                            }
                        );
                        //console.log('histogramData', resultItem, histogramData);

                        return (
                            <ErrorBoundary key={index}>
                                <GroupBarChart
                                    showMeanLine={true}
                                    data={histogramData}
                                    yAxisLabel={t('distribution.frequency')}
                                    title={resultItem.title ?? ''}
                                    isViridis={
                                        resultItem.categories !== undefined
                                    }
                                />
                            </ErrorBoundary>
                        );
                    }
                    case 'distribution': {
                        return (
                            <DistributionReport
                                key={index}
                                dataTypes={resultItem.dataTypes}
                                real={resultItem.real}
                                synthetic={resultItem.synthetic}
                                reports={resultItem.reports}
                                realCorrelations={resultItem.realCorrelations}
                                synthDataCorrelations={
                                    resultItem.synthDataCorrelations
                                }
                                syntheticCorrelations={
                                    resultItem.syntheticCorrelations
                                }
                                combined_data={resultItem.combined_data}
                            />
                        );
                    }
                    case 'clusterNumericalVariableDistribution': {
                        const barchartData = JSON.parse(resultItem.data)?.map(
                            (x: Record<string, number>, index: number) => {
                                const translationID = getLabel(index);
                                return {
                                    name: t(
                                        translationID.key,
                                        translationID.params
                                    ),
                                    values: x,
                                };
                            }
                        );

                        return (
                            <ErrorBoundary key={index}>
                                {categorieFilter ===
                                    resultItem.selectFilterGroup ||
                                (!categorieFilter &&
                                    resultItem.selectFilterGroup ===
                                        resultItem.defaultFilter) ||
                                !resultItem.selectFilterGroup ? (
                                    <>
                                        <h5
                                            key={index}
                                            className="text-gray-800 font-semibold"
                                        >
                                            {resultItem.headingKey
                                                ? t(
                                                      resultItem.headingKey,
                                                      resultItem.params
                                                  )
                                                : resultItem.data}
                                        </h5>
                                        <SingleBarChart
                                            key={index}
                                            data={barchartData}
                                            title={resultItem.title ?? ''}
                                            meanValue={resultItem.meanValue}
                                        />
                                    </>
                                ) : null}
                            </ErrorBoundary>
                        );
                    }
                    case 'barchart': {
                        const barchartData = JSON.parse(resultItem.data)?.map(
                            (x: Record<string, number>, index: number) => {
                                const translationID = getLabel(index);
                                return {
                                    name: t(
                                        translationID.key,
                                        translationID.params
                                    ),
                                    values: x,
                                };
                            }
                        );

                        return (
                            <SingleBarChart
                                key={index}
                                data={barchartData}
                                title={resultItem.title ?? ''}
                                meanValue={resultItem.meanValue}
                            />
                        );
                    }
                    default:
                        return <h6 key={index}>Unknown result type</h6>;
                }
            } catch (e) {
                return null;
            }
        })
        .filter(x => x !== null);

    return components;
}
