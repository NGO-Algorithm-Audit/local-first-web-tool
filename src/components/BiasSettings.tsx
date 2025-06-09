import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import CSVReader from './CSVReader';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowDown, ArrowRight, InfoIcon } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import Papa from 'papaparse';
import { BiasDetectionParameters } from './bias-detection-interfaces/BiasDetectionParameters';
import { useTranslation } from 'react-i18next';
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from './ui/touch-tooltip';
import Markdown from 'react-markdown';
import { IconInfoTooltip } from './ui/info-icon-tooltip';

const FormSchema = z.object({
    file: z.string({
        required_error: 'biasSettings.form.errors.csvRequired',
    }),
    whichPerformanceMetricValueIsBetter: z.string(),
    targetColumn: z
        .string({
            required_error: 'biasSettings.form.errors.targetColumnRequired',
        })
        .nonempty(),
    dataType: z
        .string({
            required_error: 'biasSettings.form.errors.dataTypeRequired',
        })
        .nonempty(),
    selectedDataType: z
        .string({
            required_error: 'biasSettings.form.errors.dataTypeRequired',
        })
        .nonempty(),
});

export default function BiasSettings({
    onRun,
    onDataLoad,
    isLoading,
    isErrorDuringAnalysis,
}: {
    onRun: (params: BiasDetectionParameters) => void;
    onDataLoad: (
        data: Record<string, string>[],
        stringified: string,
        fileName: string,
        demo?: boolean,
        columnsCount?: number,
        params?: BiasDetectionParameters
    ) => void;
    isLoading: boolean;
    isErrorDuringAnalysis: boolean;
    isInitialised: boolean;
    loadingMessage: string;
}) {
    const { t } = useTranslation();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            dataType: 'numeric',
            whichPerformanceMetricValueIsBetter: 'higher',
        },
    });
    const [iter, setIter] = useState([10]);
    const [clusters, setClusters] = useState([25]);

    const [performanceMetricColumnError, setPerformanceMetricColumnError] =
        useState<string | null>(null);
    const [dataTypeError, setDataTypeError] = useState<string | null>(null);

    const [dataKey, setDataKey] = useState<string>(new Date().toISOString());
    const [data, setData] = useState<{
        data: Record<string, string>[];
        stringified: string;
        fileName: string;
    }>({ data: [], stringified: '', fileName: '' });

    const onFileLoad = (
        data: Record<string, string>[],
        stringified: string,
        fileName: string
    ) => {
        const isReset = stringified.length === 0;
        if (isReset) {
            form.reset();
            setDataTypeError(null);
        } else {
            form.setValue('file', stringified);
        }
        setData({ data, stringified, fileName });

        const dataLength = (data?.length || 1000) / 10;
        setClusters([Math.round(dataLength / 4)]);

        setPerformanceMetricColumnError(null);
        setDataTypeError(null);
        if (!isReset) {
            // Find numeric columns
            const numericColumns = Object.keys(data[0] || {}).filter(
                column => column
            );
            // .filter(column =>
            //     data.every(row => {
            //         return !isNaN(parseFloat(row[column]));
            //     })
            // );

            if (numericColumns.length === 0) {
                setPerformanceMetricColumnError(
                    t('biasSettings.form.errors.noNumericColumns')
                );
            }

            if (numericColumns.length === Object.keys(data[0] || {}).length) {
                form.setValue('dataType', 'numeric');
            } else {
                form.setValue('dataType', 'categorical');
            }
        }

        setDataKey(new Date().toISOString());
    };

    useEffect(() => {
        onDataLoad(data.data, data.stringified, data.fileName);
    }, [data]);

    const onDemoRun = async () => {
        const file = await fetch('compas-scores-two-years.csv') //'/FP-test-set.csv')
            .then(response => response.text())
            .then(data => Papa.parse(data, { header: true }));
        onDataLoad(
            file.data as Record<string, string>[],
            Papa.unparse(file.data),
            'demo',
            true,
            undefined,
            {
                clusterSize: clusters[0],
                iterations: iter[0],
                targetColumn: '',
                dataType: '',
                higherIsBetter:
                    form.getValues().whichPerformanceMetricValueIsBetter ===
                    'higher',
                isDemo: true,
                dataTypeText: t(`biasSettings.dataType.categorical`),
            }
        );
    };

    const onSubmit = (formData: z.infer<typeof FormSchema>) => {
        // Check if data type matches the actual data

        const isNumericData = formData.dataType === 'numeric';
        console.log(
            'isNumericData',
            formData.selectedDataType,
            formData.dataType,
            isNumericData,
            Object.keys(data.data[0] || {})
                .filter(column => column)
                .filter(column =>
                    data.data.every(row => {
                        return !isNaN(parseFloat(row[column]));
                    })
                )
        );
        const allColumns = Object.keys(data.data[0] || {}).filter(column => {
            if (column === formData.targetColumn) {
                return false;
            }
            return true;
        });
        const columns = Object.keys(data.data[0] || {}).filter(column =>
            data.data.every(row => {
                if (column === formData.targetColumn) {
                    return false;
                }
                if (formData.selectedDataType === 'numeric') {
                    return !isNaN(parseFloat(row[column]));
                } else {
                    return (
                        typeof row[column] === 'string' || row[column] === ''
                    );
                }
            })
        );
        const equal = allColumns.length === columns.length;
        if (formData.selectedDataType === 'numeric' && !equal) {
            setDataTypeError(t('biasSettings.form.errors.numericDataRequired'));
            return;
        }

        // if (formData.selectedDataType === 'categorical' && !equal) {
        //     setDataTypeError(
        //         t('biasSettings.form.errors.categoricalDataRequired')
        //     );
        //     return;
        // }

        onRun({
            clusterSize: clusters[0],
            iterations: iter[0],
            targetColumn: formData.targetColumn,
            dataType: formData.selectedDataType,
            higherIsBetter:
                formData.whichPerformanceMetricValueIsBetter === 'higher',
            isDemo: false,
            dataTypeText: t(
                `biasSettings.dataType.${formData.selectedDataType}`
            ),
        });
    };

    return (
        <Form {...form}>
            <div className="h-auto md:h-full flex flex-col justify-between">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid w-full items-start gap-2 -mt-2 grid-cols-1 sm:gap-4 sm:grid-cols-2"
                >
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            {t('biasSettings.form.fieldsets.data.title')}
                        </legend>
                        <div className="relative grid gap-3 select-none">
                            <div className="flex flex-row items-center gap-1 absolute -top-[10px] leading-0 left-4 px-1 bg-white text-sm font-medium">
                                {t('biasSettings.form.fieldsets.data.dataSet')}

                                <IconInfoTooltip
                                    tooltipText={t(
                                        'biasSettings.form.fieldsets.data.dataSetTooltip'
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                disabled={isLoading}
                                name="file"
                                render={() => (
                                    <CSVReader
                                        disabled={isLoading}
                                        onChange={onFileLoad}
                                    />
                                )}
                            />
                        </div>
                        {performanceMetricColumnError && (
                            <div className="text-red-500">
                                {t('biasSettings.form.errors.noNumericColumns')}
                            </div>
                        )}
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="selectedDataType"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex flex-row items-center gap-1">
                                            {t(
                                                'biasSettings.form.fieldsets.data.dataType'
                                            )}
                                            <IconInfoTooltip
                                                tooltipText={t(
                                                    'biasSettings.form.fieldsets.data.dataTypeTooltip'
                                                )}
                                            />
                                        </FormLabel>
                                        <RadioGroup
                                            onValueChange={value => {
                                                setDataTypeError(null);
                                                field.onChange(value);
                                            }}
                                            defaultValue={field.value}
                                            key={`${dataKey}_selecteddataType`}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value="categorical"
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t(
                                                        'biasSettings.form.fieldsets.data.categoricalData'
                                                    )}
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="flex items-center space-x-3 space-y-0">
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value="numeric"
                                                        disabled={isLoading}
                                                    />
                                                </FormControl>
                                                <FormLabel className="font-normal">
                                                    {t(
                                                        'biasSettings.form.fieldsets.data.numericalData'
                                                    )}
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                        {dataTypeError && (
                                            <div className="text-red-500 text-sm mt-1">
                                                {dataTypeError}
                                            </div>
                                        )}
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="targetColumn"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="flex flex-row items-center gap-1">
                                            {t(
                                                'biasSettings.form.fieldsets.data.performanceMetric'
                                            )}
                                            <IconInfoTooltip
                                                tooltipText={t(
                                                    'biasSettings.form.fieldsets.data.performanceMetricTooltip'
                                                )}
                                            />
                                        </FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            key={`${dataKey}_select`}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue
                                                        placeholder={t(
                                                            'biasSettings.form.actions.selectColumn'
                                                        )}
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {data.data?.[0] ? (
                                                    Object.keys(
                                                        data.data?.[0] ?? {}
                                                    )
                                                        .filter(
                                                            column => column
                                                        )
                                                        // .filter(column =>
                                                        //     data.data.every(
                                                        //         row => {
                                                        //             return !isNaN(
                                                        //                 parseFloat(
                                                        //                     row[
                                                        //                         column
                                                        //                     ]
                                                        //                 )
                                                        //             );
                                                        //         }
                                                        //     )
                                                        // )
                                                        .map(column => (
                                                            <SelectItem
                                                                key={`${dataKey}${column}`}
                                                                value={column}
                                                            >
                                                                {column}
                                                            </SelectItem>
                                                        ))
                                                ) : (
                                                    <SelectItem
                                                        value="noData"
                                                        disabled
                                                    >
                                                        {t(
                                                            'biasSettings.form.errors.noData'
                                                        )}
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            {t('biasSettings.form.fieldsets.parameters.title')}
                        </legend>
                        <div className="grid gap-3">
                            <Label
                                htmlFor="iterations"
                                className="flex flex-row items-center gap-1"
                            >
                                {t(
                                    'biasSettings.form.fieldsets.parameters.iterations'
                                )}{' '}
                                ({iter})
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger
                                            onClick={event => {
                                                event.preventDefault();
                                            }}
                                        >
                                            <InfoIcon className="size-3.5" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="whitespace-pre-wrap max-w-full w-[400px] p-2">
                                                <Markdown className="-mt-2 text-gray-800 markdown">
                                                    {t(
                                                        'biasSettings.form.fieldsets.parameters.iterationsTooltip'
                                                    )}
                                                </Markdown>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Slider
                                id="iterations"
                                defaultValue={iter}
                                max={50}
                                step={1}
                                onValueChange={value => setIter(value)}
                                className="cursor-pointer"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label
                                htmlFor="min-cluster-size"
                                className="flex flex-row items-center gap-1"
                            >
                                {t(
                                    'biasSettings.form.fieldsets.parameters.minClusterSize'
                                )}{' '}
                                ({clusters})
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger
                                            onClick={event => {
                                                event.preventDefault();
                                            }}
                                        >
                                            <InfoIcon className="size-3.5" />
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <div className="whitespace-pre-wrap max-w-full w-[400px] p-2">
                                                <Markdown className="-mt-2 text-gray-800 markdown">
                                                    {t(
                                                        'biasSettings.form.fieldsets.parameters.minClusterSizeTooltip'
                                                    )}
                                                </Markdown>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </Label>
                            <Slider
                                id="min-cluster-size"
                                defaultValue={clusters}
                                key={`${dataKey}_clusters`}
                                max={Math.floor(
                                    (data?.data?.length || 1000) / 10
                                )}
                                step={1}
                                onValueChange={value => setClusters(value)}
                                className="cursor-pointer"
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="flex flex-row gap-1 items-center text-sm font-medium">
                                {t(
                                    'biasSettings.form.fieldsets.parameters.performanceInterpretation.title'
                                )}
                                <IconInfoTooltip
                                    tooltipText={t(
                                        'biasSettings.form.fieldsets.parameters.performanceInterpretation.tooltip'
                                    )}
                                />
                            </label>
                            <FormField
                                control={form.control}
                                name="whichPerformanceMetricValueIsBetter"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        key={`${dataKey}_whichPerformanceMetricValueIsBetter`}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value="lower"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t(
                                                    'biasSettings.form.fieldsets.parameters.performanceInterpretation.lower'
                                                )}
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value="higher"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t(
                                                    'biasSettings.form.fieldsets.parameters.performanceInterpretation.higher'
                                                )}
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                )}
                            />
                        </div>
                    </fieldset>

                    <div className="flex flex-row ml-auto gap-2">
                        {isErrorDuringAnalysis && (
                            <div className="text-red-500">
                                {t('biasSettings.form.errors.analysisError')}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row ml-auto gap-2 hideonprint">
                        <Button
                            onClick={event => {
                                event.preventDefault();
                                onDemoRun();
                                return false;
                            }}
                            size="sm"
                            variant={'outline'}
                            className="gap-1.5 xl:hidden"
                            disabled={isLoading}
                        >
                            {t('biasSettings.form.actions.tryItOut')}
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            className="gap-1.5"
                            disabled={isLoading}
                        >
                            {t('biasSettings.form.actions.runAnalysis')}
                            <ArrowRight className="size-3.5 hidden xl:flex" />
                            <ArrowDown className="size-3.5 xl:hidden" />
                        </Button>
                    </div>
                </form>

                <Card className="hidden xl:flex hideonprint">
                    <div className="flex flex-row w-full items-center justify-between">
                        <CardHeader>
                            <CardTitle className="text-aaDark text-md">
                                {t('biasSettings.demoCard.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('biasSettings.demoCard.description')}
                            </CardDescription>
                        </CardHeader>
                        <Button
                            onClick={() => onDemoRun()}
                            size="sm"
                            variant={'outline'}
                            className="gap-1.5 mr-4"
                            disabled={isLoading}
                        >
                            {t('biasSettings.form.actions.tryItOut')}
                        </Button>
                    </div>
                </Card>
            </div>
        </Form>
    );
}
