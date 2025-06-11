import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../ErrorBoundary';
import FilterSelect from '../ui/FilterSelect';
import SingleBarChart from '../graphs/SingleBarChart';
import { getLabel } from '../graphs/get-label';

export interface ClusterNumericalVariableDistributionAccordeonContentProps {
    categories: string[];
    defaultCategory: string;
    charts: {
        selectFilterGroup: string;
        yAxisLabel: string;
        title: string;
        data: string;
        meanValue: number;
        categories: string[];
        headingKey: string;
        params: Record<string, string>;
    }[];
}
const ClusterNumericalVariableDistributionAccordeonContent = ({
    categories,
    defaultCategory,
    charts,
}: ClusterNumericalVariableDistributionAccordeonContentProps) => {
    const [categorieFilter, setCategorieFilter] = useState<string | null>();
    const { t } = useTranslation();

    useEffect(() => {
        setCategorieFilter(null);
    }, [categories, defaultCategory]);

    return (
        <div className="flex flex-col justify-start items-start gap-4 px-1 py-4 w-100">
            <ErrorBoundary>
                <div className="hideonprint">
                    <FilterSelect
                        filterValues={categories}
                        defaultValue={defaultCategory}
                        onFilter={value => {
                            setCategorieFilter(value);
                        }}
                        labelKey="biasSettings.form.fieldsets.data.filterSelect"
                    />
                </div>
            </ErrorBoundary>

            <ErrorBoundary>
                {charts.map((chart, chartIndex) => {
                    const barchartData = JSON.parse(chart.data)?.map(
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
                        <ErrorBoundary
                            key={`ClusterNumericalVariableDistributionAccordeonContent-${chartIndex}`}
                        >
                            <>
                                {categorieFilter === chart.selectFilterGroup ||
                                (!categorieFilter &&
                                    chart.selectFilterGroup ===
                                        defaultCategory) ||
                                !chart.selectFilterGroup ? (
                                    <div className="hideonprint w-full">
                                        <h5
                                            key={chartIndex}
                                            className="text-gray-800 font-semibold"
                                        >
                                            {chart.headingKey
                                                ? t(
                                                      chart.headingKey,
                                                      chart.params
                                                  )
                                                : '-'}
                                        </h5>
                                        <SingleBarChart
                                            key={`SingleBarChart-${chartIndex}`}
                                            data={barchartData}
                                            title={chart.title ?? ''}
                                            meanValue={chart.meanValue}
                                        />
                                    </div>
                                ) : null}
                                <div className="hidden showonprint overflow-x-hidden">
                                    <h5
                                        key={`SingleBarChart-print-${chartIndex}`}
                                        className="text-gray-800 font-semibold"
                                    >
                                        {chart.headingKey
                                            ? t(chart.headingKey, chart.params)
                                            : '-'}
                                    </h5>
                                    <SingleBarChart
                                        key={chartIndex}
                                        data={barchartData}
                                        title={chart.title ?? ''}
                                        meanValue={chart.meanValue}
                                    />
                                </div>
                            </>
                        </ErrorBoundary>
                    );
                })}
            </ErrorBoundary>
        </div>
    );
};

export default ClusterNumericalVariableDistributionAccordeonContent;
