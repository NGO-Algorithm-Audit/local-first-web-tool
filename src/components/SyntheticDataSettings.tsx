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
import { useTranslation } from 'react-i18next';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Slider } from './ui/slider';
import { Label } from './ui/label';
import { SyntheticDataParameters } from './synthetic-data-interfaces/SyntheticDataParameters';
import {
    Tooltip,
    TooltipProvider,
    TooltipTrigger,
    TooltipContent,
} from './ui/touch-tooltip';
import Markdown from 'react-markdown';
import { IconInfoTooltip } from './ui/info-icon-tooltip';

const createFormSchema = (t: (key: string) => string) =>
    z.object({
        file: z.string({
            required_error: t('syntheticData.form.errors.csvRequired'),
        }),
        sdgMethod: z.string(),
        nanTreatment: z.string(),
    });

interface DemoDataColumns {
    sex: string;
    race1: string;
    ugpa: string;
    bar: string;
}

export default function SyntheticDataSettings({
    onRun,
    onDataLoad,
    isLoading,
    isErrorDuringAnalysis,
}: {
    onRun: (params: SyntheticDataParameters) => void;
    onDataLoad: csvReader['onChange'];
    isLoading: boolean;
    loadingMessage: string;
    isErrorDuringAnalysis: boolean;
    isInitialised: boolean;
}) {
    const { t } = useTranslation();
    const FormSchema = createFormSchema(t);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            sdgMethod: 'cart',
            nanTreatment: 'drop',
        },
    });
    const [columnsCountError, setColumnsCountError] = useState(false);
    const [outputSamples, setOutputSamples] = useState([1000]);
    const [dataKey, setDataKey] = useState<string>(new Date().toISOString());
    const [data, setData] = useState<{
        data: Record<string, string>[];
        stringified: string;
        fileName: string;
    }>({ data: [], stringified: '', fileName: '' });

    const onFileLoad = (
        data: Record<string, string>[],
        stringified: string,
        fileName: string,
        isDemo?: boolean,
        columnsCount?: number
    ) => {
        if (stringified.length === 0) {
            setColumnsCountError(false);
            form.reset();
        } else {
            form.setValue('file', stringified);
            if (!isDemo && columnsCount && columnsCount > 8) {
                setColumnsCountError(true);
            }
        }

        setData({ data, stringified, fileName });
        setDataKey(new Date().toISOString());
    };

    useEffect(() => {
        onDataLoad(data.data, data.stringified, data.fileName);
    }, [data]);

    const onDemoRun = async () => {
        const file = await fetch('/LawSchoolAdmissionBar_small.csv')
            .then(response => response.text())
            .then(data => Papa.parse(data, { header: true }));

        const demoData = file.data.map((row: unknown) => ({
            sex: (row as DemoDataColumns)['sex'],
            race1: (row as DemoDataColumns)['race1'],
            ugpa: (row as DemoDataColumns)['ugpa'],
            bar: (row as DemoDataColumns)['bar'],
        }));

        onDataLoad(
            demoData as Record<string, string>[],
            Papa.unparse(demoData),
            'demo',
            true
        );
    };

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        onRun({
            isDemo: false,
            sdgMethod: data.sdgMethod,
            samples: outputSamples[0],
            nanTreatment: data.nanTreatment,
        });
    };
    return (
        <Form {...form}>
            <div className="h-auto md:h-full flex flex-col justify-between">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid w-full items-start gap-2 -mt-2 grid-cols-1"
                >
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            {t('syntheticData.form.fieldset.sourceDataset')}
                        </legend>
                        <div className="relative grid gap-3 select-none">
                            <div className="flex flex-row items-center gap-1 absolute -top-[10px] leading-0 left-4 px-1 bg-white text-sm font-medium">
                                {t('syntheticData.form.fieldset.dataSet')}

                                <IconInfoTooltip
                                    tooltipText={t(
                                        'syntheticData.form.fieldset.dataSetTooltip'
                                    )}
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="file"
                                disabled={isLoading}
                                render={() => (
                                    <CSVReader
                                        disabled={isLoading}
                                        onChange={onFileLoad}
                                    />
                                )}
                            />
                        </div>
                        <div className="flex flex-row gap-2 justify-start">
                            {columnsCountError && (
                                <div className="text-red-500">
                                    {t(
                                        'syntheticData.form.errors.columnsCountError'
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-3">
                            <label className="text-sm font-medium flex flex-row items-center gap-1">
                                {t(
                                    'syntheticData.form.fieldset.sdgMethod.title'
                                )}

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
                                                        'syntheticData.form.fieldset.sdgMethod.tooltip'
                                                    )}
                                                </Markdown>
                                            </div>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </label>
                            <FormField
                                control={form.control}
                                name="sdgMethod"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                        key={`${dataKey}_sdgMethod`}
                                        className="flex flex-col space-y-1"
                                    >
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value="cart"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t(
                                                    'syntheticData.form.fieldset.sdgMethod.cart'
                                                )}
                                            </FormLabel>
                                        </FormItem>
                                        <FormItem className="flex items-center space-x-3 space-y-0">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value="gc"
                                                    disabled={isLoading}
                                                />
                                            </FormControl>
                                            <FormLabel className="font-normal">
                                                {t(
                                                    'syntheticData.form.fieldset.sdgMethod.gc'
                                                )}
                                            </FormLabel>
                                        </FormItem>
                                    </RadioGroup>
                                )}
                            />

                            {form.watch('sdgMethod') === 'gc' && (
                                <div className="mt-4">
                                    <label className="text-sm font-medium flex flex-row items-center gap-1">
                                        {t(
                                            'syntheticData.form.fieldset.nanTreatment.title'
                                        )}
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
                                                                'syntheticData.form.fieldset.nanTreatment.tooltip'
                                                            )}
                                                        </Markdown>
                                                    </div>
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </label>
                                    <FormField
                                        control={form.control}
                                        name="nanTreatment"
                                        disabled={isLoading}
                                        render={({ field }) => (
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                className="flex flex-col space-y-1 mt-2"
                                            >
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value="drop"
                                                            disabled={isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {t(
                                                            'syntheticData.form.fieldset.nanTreatment.drop'
                                                        )}
                                                    </FormLabel>
                                                </FormItem>
                                                <FormItem className="flex items-center space-x-3 space-y-0">
                                                    <FormControl>
                                                        <RadioGroupItem
                                                            value="impute"
                                                            disabled={isLoading}
                                                        />
                                                    </FormControl>
                                                    <FormLabel className="font-normal">
                                                        {t(
                                                            'syntheticData.form.fieldset.nanTreatment.impute'
                                                        )}
                                                    </FormLabel>
                                                </FormItem>
                                            </RadioGroup>
                                        )}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="grid gap-3">
                            <Label
                                htmlFor="samples"
                                className="flex flex-row items-center gap-1"
                            >
                                {t('syntheticData.form.fieldset.samples')} (
                                {outputSamples})
                                <IconInfoTooltip
                                    tooltipText={t(
                                        'syntheticData.form.fieldset.outputSamplesTooltip'
                                    )}
                                />
                            </Label>
                            <Slider
                                id="samples"
                                defaultValue={outputSamples}
                                max={5000}
                                step={10}
                                onValueChange={value => setOutputSamples(value)}
                                className="cursor-pointer"
                                disabled={isLoading}
                            />
                        </div>
                    </fieldset>

                    <div className="flex flex-row ml-auto gap-2">
                        {isErrorDuringAnalysis && (
                            <div className="text-red-500">
                                {t('syntheticData.form.errors.analysisError')}
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
                            {t('syntheticData.form.actions.tryItOut')}
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            className="gap-1.5"
                            disabled={isLoading || columnsCountError}
                        >
                            {t('syntheticData.form.actions.runGeneration')}
                            <ArrowRight className="size-3.5 hidden xl:flex" />
                            <ArrowDown className="size-3.5 xl:hidden" />
                        </Button>
                    </div>
                </form>

                <Card className="hidden xl:flex hideonprint">
                    <div className="flex flex-row w-full items-center justify-between">
                        <CardHeader>
                            <CardTitle className="text-aaDark text-md">
                                {t('syntheticData.demoCard.title')}
                            </CardTitle>
                            <CardDescription>
                                {t('syntheticData.demoCard.description')}
                            </CardDescription>
                        </CardHeader>
                        <Button
                            onClick={() => onDemoRun()}
                            size="sm"
                            variant={'outline'}
                            className="gap-1.5 mr-4"
                            disabled={isLoading}
                        >
                            {t('syntheticData.form.actions.tryItOut')}
                        </Button>
                    </div>
                </Card>
            </div>
        </Form>
    );
}
