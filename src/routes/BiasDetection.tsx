import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { pythonCode } from '@/assets/bias-detection-python-code';
import { usePython } from '@/components/pyodide/use-python';
import BiasSettings from '@/components/BiasSettings';
import { Share } from 'lucide-react';
import { csvReader } from '@/components/CSVReader';
import { cn } from '@/lib/utils';
import ComponentMapper from '@/components/componentMapper';
import { downloadFile } from '@/lib/download-file';
import { useReactToPrint } from 'react-to-print';
import Measuring from '@/components/icons/measuring.svg?react';
import { ClusterInfo } from '@/components/bias-detection-interfaces/cluster-export';
import { BiasDetectionParameters } from '@/components/bias-detection-interfaces/BiasDetectionParameters';
import { CSVData } from '@/components/bias-detection-interfaces/csv-data';

const PAGE_STYLE = `
    @page {
        /* Remove browser default header (title) and footer (url) */
        margin: 0;
    }

    @media print {
        .hideonprint { 
            display: none !important; 
        }

        @page { 
            size: landscape; 
            margin: 30px 20px;
        }

        body {
            /* Tell browsers to print background colors */
            color-adjust: exact; /* Firefox. This is an older version of "print-color-adjust" */
            print-color-adjust: exact; /* Firefox/Safari */
            -webkit-print-color-adjust: exact; /* Chrome/Safari/Edge/Opera */
        }
    }
`;

export default function BiasDetection() {
    const [data, setData] = useState<CSVData>({
        data: [],
        stringified: '',
        fileName: '',
        demo: false,
    });
    // Select the content to print

    const contentRef = useRef<HTMLDivElement | null>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef: contentRef,
        pageStyle: PAGE_STYLE,
    });

    const {
        loading,
        initialised,
        result,
        initialise,
        runPython,
        sendData,
        error,
        clusterInfo,
    } = usePython<BiasDetectionParameters, ClusterInfo>({
        iterations: 0,
        clusterSize: 0,
        targetColumn: '',
        dataType: 'numeric',
        higherIsBetter: false,
        isDemo: false,
    });

    const onFileLoad: csvReader['onChange'] = (
        data,
        stringified,
        fileName,
        demo
    ) => {
        setData({ data, stringified, fileName, demo });
    };

    useEffect(() => {
        console.log(
            'document.referrer and is nl',
            document.referrer,
            document.referrer?.includes('/nl/')
        );
        if (pythonCode) {
            initialise({ code: pythonCode, data: '' });
        }
    }, []);

    // Initialise the Python worker with the demo code and the data
    // Run the demo code when the worker is initialised with a demo dataset
    useEffect(() => {
        if (pythonCode && data.stringified.length >= 0 && initialised) {
            sendData(data.stringified);
        }
        if (data.demo) {
            onRun({
                iterations: 3,
                clusterSize: 3,
                targetColumn: 'FP',
                dataType: 'numeric',
                higherIsBetter: false,
                isDemo: true,
            });
        }
    }, [initialised, data]);

    const onRun = (params: BiasDetectionParameters) => {
        runPython({
            type: 'start',
            params: {
                parameters: {
                    iterations: params.iterations,
                    clusterSize: params.clusterSize,
                    targetColumn: params.targetColumn,
                    dataType: params.dataType,
                    higherIsBetter: params.higherIsBetter,
                    isDemo: params.isDemo,
                },
            },
        });
    };

    return (
        <main ref={contentRef} className="gap-4 p-4 flex flex-col">
            <div className="relative flex-1 flex-col items-start">
                <BiasSettings
                    onRun={onRun}
                    onDataLoad={onFileLoad}
                    isLoading={loading || !initialised}
                    isErrorDuringAnalysis={Boolean(error && initialised)}
                    isInitialised={initialised}
                />
            </div>

            <div
                className={cn(
                    'flex flex-2 w-full h-[min-content] xl:h-full xl:min-h-[100%] flex-col rounded-xl gap-6 bg-slate-50 p-4',
                    loading && 'overflow-hidden'
                )}
            >
                {initialised && data.data.length > 0 && result.length > 0 && (
                    <div className="ml-auto flex flex-row gap-2 hideonprint">
                        <Button
                            variant="outline"
                            size="sm"
                            className="p-4 text-sm"
                            onClick={() => reactToPrintFn()}
                        >
                            <Share className="size-3.5 mr-2" />
                            Share
                        </Button>
                        {clusterInfo && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="p-4 text-sm"
                                onClick={() => {
                                    downloadFile(
                                        JSON.stringify(
                                            {
                                                fileName: data.fileName,
                                                ...clusterInfo,
                                            },
                                            null,
                                            2
                                        ),
                                        `${data.fileName.replace('.csv', '') || 'cluster-info'}-${clusterInfo.date.toISOString()}.json`,
                                        'application/json'
                                    );
                                }}
                            >
                                <Share className="size-3.5 mr-2" />
                                Export to .json
                            </Button>
                        )}
                    </div>
                )}

                {result.length > 0 ? (
                    <ComponentMapper items={result} data={data} />
                ) : data.data.length > 0 ? null : (
                    <>
                        <Measuring className="max-w-96 m-auto 2xl:max-w-full" />
                        <h1 className="text-md text-center text-aaDark">
                            Let's get started! Fill out the form.
                        </h1>
                        <div className="flex-1" />
                    </>
                )}
            </div>
        </main>
    );
}
