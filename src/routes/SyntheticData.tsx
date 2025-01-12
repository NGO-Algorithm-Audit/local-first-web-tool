import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { pythonCode } from '@/assets/synthetic-data';
import { usePython } from '@/components/pyodide/use-python';
import { Share, ChevronDown } from 'lucide-react';
import { csvReader } from '@/components/CSVReader';
import { cn } from '@/lib/utils';
import ComponentMapper from '@/components/componentMapper';
import { useReactToPrint } from 'react-to-print';
import Measuring from '@/components/icons/measuring.svg?react';
import SyntheticDataSettings from '@/components/SyntheticDataSettings';
import { SyntheticDataInfo } from '@/components/synthetic-data-interfaces/cluster-export';
import LanguageSwitcher from '@/components/ui/languageSwitcher';
import { useTranslation } from 'react-i18next';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { downloadFile } from '@/lib/download-file';
import { SyntheticDataParameters } from '@/components/synthetic-data-interfaces/SyntheticDataParameters';
import { exportToCSV } from '@/lib/utils';

const PAGE_STYLE = `
    @page {
        /* Remove browser default header (title) and footer (url) */
        margin: 0;
    }

    @media print {
        .hideonprint { 
            display: none !important; 
        }

        .showonprint {
            display: block !important;
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

export default function SyntheticDataGeneration() {
    const [data, setData] = useState<{
        data: Record<string, string>[];
        stringified: string;
        fileName: string;
        demo?: boolean;
    }>({ data: [], stringified: '', fileName: '', demo: false });
    // Select the content to print

    const contentRef = useRef<HTMLDivElement | null>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef: contentRef,
        pageStyle: PAGE_STYLE,
    });
    const { t, i18n } = useTranslation();
    const {
        loading,
        initialised,
        result,
        initialise,
        runPython,
        sendData,
        error,
        clusterInfo,
    } = usePython<SyntheticDataParameters, SyntheticDataInfo>({
        isDemo: false,
        sdgMethod: 'gc',
        samples: 1000,
    });

    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');

    const onFileLoad: csvReader['onChange'] = (
        data,
        stringified,
        fileName,
        demo
    ) => {
        setData({ data, stringified, fileName, demo });
    };

    useEffect(() => {
        if (lang) {
            i18n.changeLanguage(lang);
        }
    }, [i18n]);

    useEffect(() => {
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
                isDemo: true,
                sdgMethod: 'cart',
                samples: 5000,
            });
        }
    }, [initialised, data]);

    const onRun = (props: {
        isDemo: boolean;
        sdgMethod: string;
        samples: number;
    }) => {
        runPython({
            type: 'start',
            params: {
                parameters: {
                    isDemo: props.isDemo,
                    sdgMethod: props.sdgMethod,
                    samples: props.samples,
                },
            },
        });
    };

    const handleExport = (syntheticData: object[]) => {
        if (syntheticData.length > 0) {
            exportToCSV(syntheticData, 'synthetic_data');
        }
    };

    return (
        <main ref={contentRef} className="gap-4 p-4 flex flex-col">
            {!lang && <LanguageSwitcher />}
            <div className="relative flex-1 flex-col items-start">
                <SyntheticDataSettings
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
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="p-4 text-sm"
                                >
                                    {t('downloadButton')}
                                    <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                    onClick={() => reactToPrintFn()}
                                >
                                    <Share className="size-3.5 mr-2" />
                                    {t('syntheticData.exportToPDF')}
                                </DropdownMenuItem>
                                {clusterInfo && (
                                    <>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                downloadFile(
                                                    JSON.stringify(
                                                        {
                                                            fileName:
                                                                data.fileName,
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
                                            {t('syntheticData.exportToJSON')}
                                        </DropdownMenuItem>
                                        <DropdownMenuItem
                                            onClick={() => {
                                                handleExport(
                                                    clusterInfo.syntheticData as object[]
                                                );
                                            }}
                                        >
                                            <Share className="size-3.5 mr-2" />
                                            {t('syntheticData.exportToCSV')}
                                        </DropdownMenuItem>
                                    </>
                                )}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                )}

                {result.length > 0 ? (
                    <ComponentMapper items={result} data={data} />
                ) : data.data.length > 0 ? null : (
                    <>
                        <Measuring className="max-w-96 m-auto 2xl:max-w-full" />
                        <h1 className="text-md text-center text-aaDark">
                            {t('getStarted')}
                        </h1>
                        <div className="flex-1" />
                    </>
                )}
            </div>
        </main>
    );
}
