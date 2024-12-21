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
import HeatMapChart from './graphs/HeatMap';
import DistributionBarChart from './graphs/DistributionBarChart';

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

function createHeatmapdata(resultItem: unknown) {
    const columns: string[] = [];
    const heatmapList =
        typeof resultItem === 'string'
            ? JSON.parse(resultItem as string)
            : (resultItem as Record<string, unknown>);
    const convertedData: number[][] = [];
    let createdColumns = false;
    if (heatmapList) {
        heatmapList.forEach(
            (heatmapRow: number[] | object, rowIndex: number) => {
                if (Array.isArray(heatmapRow)) {
                    columns.push(`${rowIndex + 1}`);
                    convertedData.push(heatmapRow);
                } else {
                    if (typeof heatmapRow === 'object') {
                        const temp = [];
                        for (const key in heatmapRow) {
                            temp.push(
                                (
                                    heatmapRow as unknown as Record<
                                        string,
                                        number
                                    >
                                )[key]
                            );
                            if (!createdColumns) {
                                columns.push(key);
                            }
                        }
                        createdColumns = true;
                        convertedData.push(temp);
                    }
                }
            }
        );
    }

    return {
        columns,
        data: convertedData,
    };
}

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
                    case 'distribution': {
                        const realData = JSON.parse(resultItem.real);
                        const syntheticData = JSON.parse(resultItem.synthetic);
                        return (
                            <div key={`distribution-${index}`}>
                                {realData.length === 0 ||
                                syntheticData.length === 0
                                    ? null
                                    : Object.keys(realData[0]).map(
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
                                                          realData={
                                                              realDataColumn
                                                          }
                                                          syntheticData={
                                                              syntheticDataColumn
                                                          }
                                                          column={columnName}
                                                      />
                                                  </ErrorBoundary>
                                              );
                                          }
                                      )}
                            </div>
                        );
                    }
                    case 'heatmap': {
                        /*
                            resultItem.real
                            resultItem.synthetic
                          
                            Array in Array

                            [
                                [1,2,3],
                                [4,5,6],
                                [7,8,9]
                            ]

                            of 

                            Object in Array
                                
                            [
                                {a: 1, b: 2, c: 3},
                                {a: 4, b: 5, c: 6},
                                {a: 7, b: 8, c: 9}
                            ]
                        */
                        const { columns: realColumns, data: convertedData } =
                            createHeatmapdata(resultItem.real);
                        const {
                            columns: synthticColumns,
                            data: syntheticData,
                        } = createHeatmapdata(resultItem.synthetic);
                        return (
                            <div
                                key={`heatmap-${index}`}
                                className="grid lg:grid-cols-[50%_50%] grid-cols-[100%]"
                            >
                                <div className="col-[1]">
                                    <HeatMapChart
                                        columns={realColumns}
                                        key={index}
                                        data={convertedData}
                                        title={t('heatmap.realdata')}
                                    />
                                </div>
                                <div className="col-[1] lg:col-[2]">
                                    <HeatMapChart
                                        columns={synthticColumns}
                                        key={index}
                                        data={syntheticData}
                                        title={t('heatmap.syntheticdata')}
                                    />
                                </div>
                            </div>
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
