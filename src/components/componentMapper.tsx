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
                            />
                        );
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
                                    ? t(resultItem.headingKey)
                                    : resultItem.data}
                            </h5>
                        );

                    case 'text':
                        // Handle text that might need translation
                        const textContent = resultItem.key
                            ? t(resultItem.key, resultItem.params)
                            : resultItem.data;

                        return (
                            <Markdown
                                key={index}
                                className="-mt-2 text-gray-800 markdown"
                            >
                                {textContent}
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

                        return (
                            <ErrorBoundary key={index}>
                                <GroupBarChart
                                    data={histogramData}
                                    title={resultItem.title ?? ''}
                                />
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
