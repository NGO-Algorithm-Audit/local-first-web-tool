import CSVReader, { csvReader } from './CSVReader';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormField } from './ui/form';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import Papa from 'papaparse';
import { SyntheticDataParameters } from './synthetic-data-interfaces/BiasDetectionParameters';
import { useTranslation } from 'react-i18next';

const createFormSchema = (t: (key: string) => string) =>
    z.object({
        file: z.string({
            required_error: t('syntheticData.form.errors.csvRequired'),
        }),
    });

export default function BiasSettings({
    onRun,
    onDataLoad,
    isLoading,
    isErrorDuringAnalysis,
    isInitialised,
}: {
    onRun: (params: SyntheticDataParameters) => void;
    onDataLoad: csvReader['onChange'];
    isLoading: boolean;
    isErrorDuringAnalysis: boolean;
    isInitialised: boolean;
}) {
    const { t } = useTranslation();
    const FormSchema = createFormSchema(t);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
    });

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
        if (stringified.length === 0) {
            form.reset();
        } else {
            form.setValue('file', stringified);
        }
        setData({ data, stringified, fileName });
    };

    useEffect(() => {
        onDataLoad(data.data, data.stringified, data.fileName);
    }, [data]);

    const onDemoRun = async () => {
        const file = await fetch('/Bar-Pass-Prediction.csv')
            .then(response => response.text())
            .then(data => Papa.parse(data, { header: true }));
        onDataLoad(
            file.data as Record<string, string>[],
            Papa.unparse(file.data),
            'demo',
            true
        );
    };

    const onSubmit = () => {
        onRun({ dataType: 'numeric', isDemo: false });
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
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="file"
                                render={() => (
                                    <CSVReader onChange={onFileLoad} />
                                )}
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
                            {!isLoading
                                ? t('syntheticData.form.actions.tryItOut')
                                : t('syntheticData.form.actions.initializing')}
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            className="gap-1.5"
                            disabled={isLoading}
                        >
                            {!isLoading
                                ? t('syntheticData.form.actions.runGeneration')
                                : isInitialised
                                  ? t('syntheticData.form.actions.analyzing')
                                  : t(
                                        'syntheticData.form.actions.initializing'
                                    )}
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
                            {!isLoading
                                ? t('syntheticData.form.actions.tryItOut')
                                : t('syntheticData.form.actions.initializing')}
                        </Button>
                    </div>
                </Card>
            </div>
        </Form>
    );
}
