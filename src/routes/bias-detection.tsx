import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { demoCode } from '@/assets/demoExample';
import { usePython } from '@/components/pyodide/use-python';
import BiasSettings from '@/components/BiasSettings';
import { Share } from 'lucide-react';
import { csvReader } from '@/components/CSVReader';
import SimpleTable from '@/components/SimpleTable';
import LoadingIndicator from '@/components/ui/loadingIndicator';
import { cn } from '@/lib/utils';
import ComponentMapper from '@/components/componentMapper';

export const Route = createFileRoute('/bias-detection')({
    component: BiasDetection,
});

function BiasDetection() {
    const [data, setData] = useState<{
        data: Record<string, string>[];
        stringified: string;
        demo?: boolean;
    }>({ data: [], stringified: '', demo: false });

    const { loading, initialised, result, initialise, runPython } = usePython();

    const onFileLoad: csvReader['onChange'] = (data, stringified, demo) => {
        setData({ data, stringified, demo });
    };

    // Initialise the Python worker with the demo code and the data
    useEffect(() => {
        if (demoCode && data.stringified.length) {
            initialise({ code: demoCode, data: data.stringified });
        }
    }, [data]);

    // Run the demo code when the worker is initialised with a demo dataset
    useEffect(() => {
        if (data.demo && initialised) {
            onRun(3, 10, 'FP');
        }
    }, [initialised, data]);

    const onRun = (
        clusterSize: number,
        iterations: number,
        targetColumn: string
    ) => {
        runPython({
            type: 'start',
            params: {
                iter: iterations,
                clusters: clusterSize,
                targetColumn: targetColumn,
            },
        });
    };

    return (
        <>
            <header className="sticky top-0 z-10 flex h-[57px] bg-white items-center border-b bg-background p-4">
                <h1 className="text-xl font-semibold ">
                    Unsupervised bias detection tool
                </h1>
            </header>
            <main className="flex flex-col flex-1 gap-4 p-4 xl:flex-row overflow-x-hidden">
                <div className="relative flex-1 flex-col items-start">
                    <BiasSettings
                        onRun={onRun}
                        onDataLoad={onFileLoad}
                        isLoading={loading}
                    />
                </div>
                <div
                    className={cn(
                        'relative flex flex-2 w-full h-full min-h-[50vh] xl:overflow-x-hidden flex-col rounded-xl gap-6 bg-slate-50 p-4',
                        loading && 'overflow-hidden'
                    )}
                >
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-auto p-4 text-sm"
                    >
                        <Share className="size-3.5 mr-2" />
                        Share
                    </Button>

                    {data.data.length > 0 && (
                        <SimpleTable
                            data={data.data.slice(0, 5)}
                            title="Dataset preview showing the first 5 rows."
                        />
                    )}

                    {result.length > 0 ? (
                        <ComponentMapper items={result} />
                    ) : (
                        <>
                            <div className="flex-1" />
                            <img
                                className="max-w-96 m-auto 2xl:max-w-full"
                                src="/empty-scene.png"
                            />
                            <h1 className="text-xl font-semibold text-center text-gray-400">
                                Let's get started! Fill out the form.
                            </h1>
                            <div className="flex-1" />
                        </>
                    )}

                    {loading && (
                        <div className="absolute top-0 left-0 right-0 bottom-0 bg-opacity-20 bg-black">
                            <div className="flex w-full h-full items-center justify-center">
                                <LoadingIndicator className={''} />
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
}
