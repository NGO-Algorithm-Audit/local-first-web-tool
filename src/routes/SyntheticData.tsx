import { Button } from '@/components/ui/button';
import { useEffect, useRef, useState } from 'react';
import { pythonCode } from '@/assets/synthetic-data';
import { usePython } from '@/components/pyodide/use-python';
import { Share } from 'lucide-react';
import { csvReader } from '@/components/CSVReader';
import { cn } from '@/lib/utils';
import ComponentMapper from '@/components/componentMapper';
import { useReactToPrint } from 'react-to-print';
import Measuring from '@/components/icons/measuring.svg?react';
import SyntheticDataSettings from '@/components/SyntheticDataSettings';
import { SyntheticDataInfo } from '@/components/synthetic-data-interfaces/cluster-export';
import LanguageSwitcher from '@/components/ui/languageSwitcher';
import { useTranslation } from 'react-i18next';

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
    const { t } = useTranslation();
    const {
        loading,
        initialised,
        result,
        initialise,
        runPython,
        sendData,
        error,
    } = usePython<SyntheticDataInfo, SyntheticDataInfo>({
        dataType: 'numeric',
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
            onRun({ dataType: 'numeric', isDemo: true });
        }
    }, [initialised, data]);

    const onRun = (props: { dataType: string; isDemo: boolean }) => {
        runPython({
            type: 'start',
            params: {
                parameters: {
                    dataType: props.dataType,
                    isDemo: props.isDemo,
                },
            },
        });
    };

    return (
        <main ref={contentRef} className="gap-4 p-4 flex flex-col">
            <LanguageSwitcher />
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
                        <Button
                            variant="outline"
                            size="sm"
                            className="p-4 text-sm"
                            onClick={() => reactToPrintFn()}
                        >
                            <Share className="size-3.5 mr-2" />
                            {t('shareButton')}
                        </Button>
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
