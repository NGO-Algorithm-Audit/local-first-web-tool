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
import CSVReader, { csvReader } from './CSVReader';
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
});

export default function BiasSettings({
    onRun,
    onDataLoad,
    isLoading,
    isErrorDuringAnalysis,
}: {
    onRun: (params: BiasDetectionParameters) => void;
    onDataLoad: csvReader['onChange'];
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
            whichPerformanceMetricValueIsBetter: 'lower',
        },
    });
    const [iter, setIter] = useState([10]);
    const [clusters, setClusters] = useState([25]);

    const [performanceMetricColumnError, setPerformanceMetricColumnError] =
        useState<string | null>(null);

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
            //setDefaultDataType('numeric');
        } else {
            form.setValue('file', stringified);
        }
        setData({ data, stringified, fileName });

        const dataLength = (data?.length || 1000) / 10;
        setClusters([Math.round(dataLength / 4)]);

        setPerformanceMetricColumnError(null);
        if (!isReset) {
            // Find numeric columns
            const numericColumns = Object.keys(data[0] || {})
                .filter(column => column)
                .filter(column =>
                    data.every(row => {
                        return !isNaN(parseFloat(row[column]));
                    })
                );

            if (numericColumns.length === 0) {
                setPerformanceMetricColumnError(
                    t('biasSettings.form.errors.noNumericColumns')
                );
            }

            if (numericColumns.length === Object.keys(data[0] || {}).length) {
                form.setValue('dataType', 'numeric');
                //setDefaultDataType('numeric');
            } else {
                form.setValue('dataType', 'categorical');
                //setDefaultDataType('categorical');
            }
        }

        setDataKey(new Date().toISOString());
    };

    useEffect(() => {
        onDataLoad(data.data, data.stringified, data.fileName);
    }, [data]);

    const onDemoRun = async () => {
        const file = await fetch('/FP-test-set.csv')
            .then(response => response.text())
            .then(data => Papa.parse(data, { header: true }));
        onDataLoad(
            file.data as Record<string, string>[],
            Papa.unparse(file.data),
            'demo',
            true
        );
    };

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        onRun({
            clusterSize: clusters[0],
            iterations: iter[0],
            targetColumn: data.targetColumn,
            dataType: data.dataType,
            higherIsBetter:
                data.whichPerformanceMetricValueIsBetter === 'higher',
            isDemo: false,
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
                            <div className="absolute -top-[10px] leading-0 left-4 px-1 bg-white text-sm font-medium">
                                {t('biasSettings.form.fieldsets.data.dataSet')}
                            </div>
                            <FormField
                                control={form.control}
                                name="file"
                                render={() => (
                                    <CSVReader onChange={onFileLoad} />
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
                                name="targetColumn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            {t(
                                                'biasSettings.form.fieldsets.data.performanceMetric'
                                            )}
                                        </FormLabel>
                                        <Select
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
                                                        .filter(column =>
                                                            data.data.every(
                                                                row => {
                                                                    return !isNaN(
                                                                        parseFloat(
                                                                            row[
                                                                                column
                                                                            ]
                                                                        )
                                                                    );
                                                                }
                                                            )
                                                        )
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
                                max={100}
                                step={1}
                                onValueChange={value => setIter(value)}
                                className="cursor-pointer"
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
                            />
                        </div>
                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium">
                                {t(
                                    'biasSettings.form.fieldsets.parameters.performanceInterpretation.title'
                                )}
                            </label>
                            <FormField
                                control={form.control}
                                name="whichPerformanceMetricValueIsBetter"
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        key={`${dataKey}_whichPerformanceMetricValueIsBetter`}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="lower" />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t(
                                                    'biasSettings.form.fieldsets.parameters.performanceInterpretation.lower'
                                                )}
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem value="higher" />
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
