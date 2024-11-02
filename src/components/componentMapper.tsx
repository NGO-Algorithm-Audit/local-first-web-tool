import SimpleTable from './SimpleTable';
import SingleBarChart from './graphs/SingleBarChart';
import GroupBarChart from './graphs/GroupBarChart';
import ErrorBoundary from './ErrorBoundary';
import Markdown from 'react-markdown';
import { getLabel } from './graphs/get-label';

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

export default function ComponentMapper({ items }: { items: string[] }) {
    const components = items
        .map((r, index) => {
            try {
                const resultItem = JSON.parse(r);

                switch (resultItem.type) {
                    case 'table':
                        return (
                            <SimpleTable
                                key={index}
                                data={JSON.parse(resultItem.data)}
                                title={resultItem.title}
                            />
                        );
                    case 'text':
                        return (
                            <Markdown
                                key={index}
                                className="-mt-2 text-gray-800"
                            >
                                {resultItem.data}
                            </Markdown>
                        );
                    case 'heading':
                        return (
                            <h5
                                key={index}
                                className="text-gray-800 font-semibold"
                            >
                                {resultItem.data}
                            </h5>
                        );
                    case 'histogram': {
                        const histogramData = JSON.parse(resultItem.data)?.map(
                            (x: Record<string, number>, index: number) => {
                                return {
                                    name: getLabel(index),
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
                                return {
                                    name: getLabel(index),
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
