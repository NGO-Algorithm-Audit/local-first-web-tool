import SimpleTable from './SimpleTable';
import SingleBarChart from './graphs/SingleBarChart';
import GroupBarChart from './graphs/GroupBarChart';
import ErrorBoundary from './ErrorBoundary';
import Markdown from 'react-markdown';
import { getLabel } from './graphs/get-label';
import { CSVData } from './bias-detection-interfaces/csv-data';
import { Fragment } from 'react/jsx-runtime';
import { Accordion } from './ui/accordion';
import { useTranslation } from 'react-i18next';
import { DistributionReport } from './DistributionReport';

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
                                .map(
                                    (comparison: {
                                        key: string;
                                        params: Record<string, any>;
                                    }) => t(comparison.key, comparison.params)
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
                            <Markdown
                                key={index}
                                className="-mt-2 text-gray-800 markdown"
                            >
                                {resultItem.key
                                    ? t(resultItem.key, resultItem.params)
                                    : resultItem.data}
                            </Markdown>
                        );
                    case 'histogram': {
                        const histogramData = JSON.parse(resultItem.data)?.map(
                            (x: Record<string, number>, index: number) => {
                                const translationID = getLabel(index);
                                return {
                                    name: t(
                                        translationID.key,
                                        translationID.params
                                    ),
                                    values: createArrayFromPythonDictionary(x),
                                };
                            }
                        );
                        console.log('histogramData', histogramData);

                        return (
                            <ErrorBoundary key={index}>
                                <GroupBarChart
                                    showMeanLine={true}
                                    data={histogramData}
                                    yAxisLabel={t('distribution.frequency')}
                                    title={resultItem.title ?? ''}
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
