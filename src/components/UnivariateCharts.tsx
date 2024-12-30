import React from 'react';
import CountBarChart from './graphs/CountBarChart';

export interface ChartProps {
    realData: object[];
    syntheticData: object[];
    dataTypes: Record<string, string>;
    combined_data: object;
    comparison: boolean;
}

export const UnivariateCharts = (props: ChartProps) => {
    if (
        props.realData &&
        props.syntheticData &&
        props.dataTypes &&
        props.combined_data &&
        props.realData.length > 0 &&
        props.syntheticData.length > 0
    ) {
        const realData = props.realData;
        //const syntheticData = props.syntheticData;
        const dataTypes = props.dataTypes;
        //const combinedData = props.combined_data;
        const realDataKeys = Object.keys(realData[0]);
        //const syntheticDataKeys = Object.keys(syntheticData[0]);
        //const combinedDataKeys = Object.keys(combinedData[0]);

        /*

         <SingleBarChart
                                key={index}
                                data={barchartData}
                                title={resultItem.title ?? ''}
                            />

        */

        return realDataKeys
            .filter(column => {
                return column != 'realOrSynthetic';
            })
            .map((column, index) => {
                //const isFloatColumn = dataTypes[column] == 'float';
                //if (true) {
                return (
                    <React.Fragment key={index}>
                        <h2>{column}</h2>
                        <CountBarChart
                            key={index}
                            column={column}
                            realData={realData.map(
                                row =>
                                    (row as unknown as Record<string, object>)[
                                        column
                                    ] as unknown as number
                            )}
                        />
                    </React.Fragment>
                );
                //}

                return (
                    <div key={index}>
                        {column} : {dataTypes[column]}
                        {}
                    </div>
                );
            });
    }
    return <div></div>;
};
