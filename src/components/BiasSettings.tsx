import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import CSVReader, { csvReader } from './CSVReader';
import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel } from './ui/form';
import { Card, CardDescription, CardHeader, CardTitle } from './ui/card';
import Papa from 'papaparse';

const FormSchema = z.object({
    file: z.string({
        required_error: 'Please upload a CSV file.',
    }),
    targetColumn: z
        .string({
            required_error: 'Please select a target column.',
        })
        .nonempty(),
    dataType: z
        .string({
            required_error: 'Please select a data type.',
        })
        .nonempty(),
});

export default function BiasSettings({
    onRun,
    onDataLoad,
    isLoading,
    isErrorDuringAnalysis,
    isInitialised,
}: {
    onRun: (
        clusterSize: number,
        iterations: number,
        targetColumn: string,
        dataType: string
    ) => void;
    onDataLoad: csvReader['onChange'];
    isLoading: boolean;
    isErrorDuringAnalysis: boolean;
    isInitialised: boolean;
}) {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            dataType: 'numeric',
        },
    });
    const [iter, setIter] = useState([10]);
    const [clusters, setClusters] = useState([25]);
    const [dataKey, setDataKey] = useState<string>(new Date().toISOString());
    const [data, setData] = useState<{
        data: Record<string, string>[];
        stringified: string;
    }>({ data: [], stringified: '' });

    const onFileLoad = (
        data: Record<string, string>[],
        stringified: string
    ) => {
        if (stringified.length === 0) {
            form.reset();
        } else {
            form.setValue('file', stringified);
        }
        setData({ data, stringified });

        const dataLength = (data?.length || 1000) / 10;
        setClusters([Math.round(dataLength / 4)]);
        setDataKey(new Date().toISOString());
    };

    useEffect(() => {
        onDataLoad(data.data, data.stringified);
    }, [data]);

    const onDemoRun = async () => {
        const file = await fetch('/FP-test-set.csv')
            .then(response => response.text())
            .then(data => Papa.parse(data, { header: true }));
        onDataLoad(
            file.data as Record<string, string>[],
            Papa.unparse(file.data),
            true
        );
    };

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        onRun(clusters[0], iter[0], data.targetColumn, data.dataType);
    };

    return (
        <Form {...form}>
            <div className="h-auto md:h-full flex flex-col justify-between">
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="grid w-full items-start gap-6 -mt-2"
                >
                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Dataset
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
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="targetColumn"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Performance metric column
                                        </FormLabel>
                                        <Select
                                            onValueChange={field.onChange}
                                            key={`${dataKey}_select`}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a column" />
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
                                                        No data loaded
                                                    </SelectItem>
                                                )}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className="grid gap-3">
                            <FormField
                                control={form.control}
                                name="dataType"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Data type</FormLabel>
                                        <Select
                                            defaultValue="numeric"
                                            onValueChange={field.onChange}
                                            key={`${dataKey}_dataType`}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select dataType" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem
                                                    key="numeric"
                                                    value="numeric"
                                                >
                                                    Numeric
                                                </SelectItem>
                                                <SelectItem
                                                    key="categorical"
                                                    value="categorical"
                                                >
                                                    Categorical
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                        </div>
                    </fieldset>

                    <fieldset className="grid gap-6 rounded-lg border p-4">
                        <legend className="-ml-1 px-1 text-sm font-medium">
                            Parameters
                        </legend>
                        <div className="grid gap-3">
                            <Label htmlFor="temperature">
                                Iterations ({iter})
                            </Label>
                            <Slider
                                defaultValue={iter}
                                max={100}
                                step={1}
                                onValueChange={value => setIter(value)}
                                className="cursor-pointer"
                            />
                        </div>
                        <div className="grid gap-3">
                            <Label htmlFor="temperature">
                                Minimal cluster size ({clusters})
                            </Label>
                            <Slider
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
                    </fieldset>

                    <div className="flex flex-row ml-auto gap-2">
                        {isErrorDuringAnalysis && (
                            <div className="text-red-500">
                                {'Error while analysing'}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-row ml-auto gap-2 hideonprint">
                        <Button
                            onClick={() => onDemoRun()}
                            size="sm"
                            variant={'outline'}
                            className="gap-1.5 xl:hidden"
                            disabled={isLoading}
                        >
                            {!isLoading ? 'Try it out' : 'Initialising...'}
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            className="gap-1.5"
                            disabled={isLoading}
                        >
                            {!isLoading
                                ? 'Run Analysis'
                                : isInitialised
                                  ? 'Analyzing...'
                                  : 'Initialising...'}
                            <ArrowRight className="size-3.5 hidden xl:flex" />
                            <ArrowDown className="size-3.5 xl:hidden" />
                        </Button>
                    </div>
                </form>

                <Card className="hidden xl:flex hideonprint">
                    <div className="flex flex-row w-full items-center justify-between">
                        <CardHeader>
                            <CardTitle className="text-aaDark text-md">
                                Try it out!
                            </CardTitle>
                            <CardDescription>
                                Do you not have a dataset at hand? No worries
                                use our demo data set.
                            </CardDescription>
                        </CardHeader>
                        <Button
                            onClick={() => onDemoRun()}
                            size="sm"
                            variant={'outline'}
                            className="gap-1.5 mr-4"
                            disabled={isLoading}
                        >
                            {!isLoading ? 'Try it out' : 'Initializing...'}
                        </Button>
                    </div>
                </Card>
            </div>
        </Form>
    );
}
