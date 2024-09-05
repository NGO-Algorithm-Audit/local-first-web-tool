import GroupedBarChart from './graphs/GroupedBarChart';
import SimpleTable from './SimpleTable';

export default function ComponentMapper({ items }: { items: string[] }) {
    const components = items
        .map(r => {
            try {
                const resultItem = JSON.parse(r);

                switch (resultItem.type) {
                    case 'table':
                        return (
                            <SimpleTable
                                data={JSON.parse(resultItem.data)}
                                title={resultItem.title}
                            />
                        );
                    case 'text':
                        return (
                            <p className="-mt-2 text-gray-800">
                                {resultItem.data}
                            </p>
                        );
                    case 'heading':
                        return (
                            <h5 className="text-gray-800 font-semibold">
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
                                for (let i = 0; i < value; i++) {
                                    resultArray.push(Number(key));
                                }
                            }

                            return resultArray;
                        };
                        const histogramData = JSON.parse(resultItem.data)?.map(
                            (x: Record<string, number>, index: number) => {
                                return {
                                    name: 'cluster ' + (index + 1),
                                    values: createArrayFromPythonDictionary(x),
                                };
                            }
                        );

                        return (
                            <GroupedBarChart
                                data={histogramData}
                                title={resultItem.title ?? ''}
                            />
                        );

                    default:
                        return <h6>Unknown result type</h6>;
                }
            } catch (e) {
                return null;
            }
        })
        .filter(x => x !== null);

    return components;
}
