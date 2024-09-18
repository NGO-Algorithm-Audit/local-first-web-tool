import SimpleTable from './SimpleTable';
import SingleBarChart from './graphs/SingleBarChart';
import GroupBarChart from './graphs/GroupBarChart';
import ErrorBoundary from './ErrorBoundary';

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
                            <p className="-mt-2 text-gray-800" key={index}>
                                {resultItem.data}
                            </p>
                        );
                    case 'heading':
                        return (
                            <h5
                                className="text-gray-800 font-semibold"
                                key={index}
                            >
                                {resultItem.data}
                            </h5>
                        );
                    case 'histogram':
                        const createArrayFromPythonDictionary = (
                            dict: Record<string, number>
                        ) => {
                            const resultArray = [];

                            // Iterate over each key-value pair in the dictionary
                            for (const [key, value] of Object.entries(dict)) {
                                // Convert key to a number and repeat it 'value' times
                                // for (let i = 0; i < value; i++) {
                                //     resultArray.push(Number(key));
                                // }
                                if (typeof value === 'number') {
                                    resultArray.push({
                                        value: value,
                                        name: key,
                                    });
                                }
                            }

                            return resultArray;
                        };
                        console.log(
                            'data returned from python',
                            resultItem.title,
                            resultItem.data
                        );
                        const histogramData = JSON.parse(resultItem.data)?.map(
                            (x: Record<string, number>, index: number) => {
                                return {
                                    name: 'cluster ' + (index + 1),
                                    values: createArrayFromPythonDictionary(x),
                                };
                            }
                        );

                        return (
                            <ErrorBoundary>
                                <GroupBarChart
                                    key={index}
                                    data={histogramData}
                                    title={resultItem.title ?? ''}
                                />
                            </ErrorBoundary>
                        );
                    case 'barchart':
                        const barchartData = JSON.parse(resultItem.data)?.map(
                            (x: Record<string, number>, index: number) => {
                                return {
                                    name: 'cluster ' + (index + 1),
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
