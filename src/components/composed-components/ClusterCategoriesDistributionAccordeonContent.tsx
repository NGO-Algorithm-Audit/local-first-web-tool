import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ErrorBoundary from '../ErrorBoundary';
import FilterSelect from '../ui/FilterSelect';
import ClusterLegend from '../graphs/ClusterLegend';
import { getLabel } from '../graphs/get-label';
import { createArrayFromPythonDictionary } from '../createArrayFromPythonDictionary';
import ClusterCategoriesDistributionChart from '../graphs/ClusterCategoriesDistributionChart';

export interface ClusterCategoriesDistributionAccordeonContentProps {
    categories: string[];
    defaultCategory: string;
    clusterCount: number;
    charts: {
        selectFilterGroup: string;
        yAxisLabel: string;
        title: string;
        data: string;
        colorRange?: string[];
        showMeanLine: boolean;
        isViridis?: boolean;
        means: { mean: number; category: string }[];
        categories: string[];
        headingKey: string;
        params: Record<string, string>;
    }[];
}

const ClusterCategoriesDistributionAccordeonContent = ({
    charts,
    categories,
    defaultCategory,
    clusterCount,
}: ClusterCategoriesDistributionAccordeonContentProps) => {
    const [categorieFilter, setCategorieFilter] = useState<string | null>();
    const { t } = useTranslation();

    useEffect(() => {
        setCategorieFilter(null);
    }, [charts, categories, defaultCategory, clusterCount]);

    return (
        <div className="flex flex-col justify-start items-start gap-4 px-1 py-4 w-100">
            <ErrorBoundary>
                <div>
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
                {charts.map((chart, index) => {
                    const distributionData = JSON.parse(chart.data).map(
                        (x: Record<string, number>, index: number) => {
                            const translationID = getLabel(index);
                            return {
                                name: categories
                                    ? categories[index]
                                    : t(
                                          translationID.key,
                                          translationID.params
                                      ),
                                values: createArrayFromPythonDictionary(x),
                            };
                        }
                    );
                    return (
                        <>
                            {categorieFilter === chart.selectFilterGroup ||
                            (!categorieFilter &&
                                chart.selectFilterGroup === defaultCategory) ||
                            !chart.selectFilterGroup ? (
                                <>
                                    <h5
                                        key={index}
                                        className="text-gray-800 font-semibold"
                                    >
                                        {chart.headingKey
                                            ? t(chart.headingKey, chart.params)
                                            : '-'}
                                    </h5>
                                    <ClusterCategoriesDistributionChart
                                        showMeanLine={true}
                                        data={distributionData}
                                        yAxisLabel={t('distribution.frequency')}
                                        title={chart.title ?? ''}
                                        means={chart.means ?? []}
                                        categories={chart.categories ?? []}
                                        isViridis={
                                            chart.categories !== undefined
                                        }
                                    />
                                </>
                            ) : null}
                        </>
                    );
                })}
            </ErrorBoundary>

            <div className="flex items-center justify-center ml-[80px]">
                <ErrorBoundary>
                    <ClusterLegend clusterCount={clusterCount ?? 0} />
                </ErrorBoundary>
            </div>
        </div>
    );
};

export default ClusterCategoriesDistributionAccordeonContent;
