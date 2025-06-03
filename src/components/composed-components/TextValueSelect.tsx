import { useEffect, useState } from 'react';
import ErrorBoundary from '../ErrorBoundary';
import FilterSelect from '../ui/FilterSelect';
import { useTranslation } from 'react-i18next';

const TextValueSelect = ({
    data,
}: {
    data: {
        values: string[];
        defaultIndex: number;
        labelKey: string;
        valueKey: string;
    };
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>();
    const { t } = useTranslation();

    useEffect(() => {
        setSelectedIndex(null);
    }, [data.defaultIndex]);

    const value = data.values[selectedIndex ?? data.defaultIndex];

    return (
        <div className="flex flex-col items-start justify-start gap-2">
            <ErrorBoundary>
                <div>
                    <FilterSelect
                        filterValues={data.values.map((_, i) => i.toString())}
                        defaultValue={data.defaultIndex.toString()}
                        onFilter={value => {
                            setSelectedIndex(parseInt(value));
                        }}
                        labelKey={data.labelKey}
                    />
                </div>
                <div>
                    <div>
                        <label className="text-sm font-semibold">
                            {t(data.valueKey, {
                                index: selectedIndex ?? data.defaultIndex,
                                value,
                            })}
                        </label>
                    </div>
                </div>
            </ErrorBoundary>
        </div>
    );
};

export default TextValueSelect;
