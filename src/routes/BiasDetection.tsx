import { useEffect, useRef, useState } from 'react';
import { pythonCode } from '@/assets/bias-detection-python-code';
import { usePython } from '@/components/pyodide/use-python';
import BiasSettings from '@/components/BiasSettings';
import { cn } from '@/lib/utils';
import ComponentMapper from '@/components/componentMapper';
import { useReactToPrint } from 'react-to-print';
import Measuring from '@/components/icons/measuring.svg?react';
import { ClusterInfo } from '@/components/bias-detection-interfaces/cluster-export';
import { BiasDetectionParameters } from '@/components/bias-detection-interfaces/BiasDetectionParameters';
import { CSVData } from '@/components/bias-detection-interfaces/csv-data';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '@/components/ui/languageSwitcher';
import { LoadingState } from '@/components/LoadingState';
import { ExportButton } from '@/components/bias-detection/export-button';

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

export default function BiasDetection() {
    const [data, setData] = useState<
        CSVData & { params?: BiasDetectionParameters }
    >({
        data: [],
        stringified: '',
        fileName: '',
        demo: false,
        params: undefined,
    });
    const { t, i18n } = useTranslation();

    const contentRef = useRef<HTMLDivElement | null>(null);
    const reactToPrintFn = useReactToPrint({
        contentRef: contentRef,
        pageStyle: PAGE_STYLE,
    });

    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');

    const {
        loading,
        loadingMessage,
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
        dataTypeText: t(`biasSettings.dataType.numeric`),
    });
    const onFileLoad: (
        data: Record<string, string>[],
        stringified: string,
        fileName: string,
        demo?: boolean,
        columnsCount?: number,
        params?: BiasDetectionParameters
    ) => void = (data, stringified, fileName, demo, _columnsCount, params) => {
        setData({ data, stringified, fileName, demo, params });
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
        if (data.demo && data.params) {
            onRun(data.params);
        }
    }, [initialised, data]);

    const onRun = (params: BiasDetectionParameters) => {
        runPython({
            type: 'start',
            params: {
                parameters: {
                    iterations: params.iterations,
                    clusterSize: params.clusterSize,
                    targetColumn: params.targetColumn ?? '',
                    dataType: params.dataType,
                    higherIsBetter: params.higherIsBetter,
                    isDemo: params.isDemo,
                    dataTypeText: params.dataTypeText,
                },
            },
        });
    };

    return (
        <main ref={contentRef} className="gap-4 p-4 flex flex-col">
            {!lang && <LanguageSwitcher />}
            <div className="relative flex-1 flex-col items-start">
                <BiasSettings
                    onRun={onRun}
                    onDataLoad={onFileLoad}
                    isLoading={loading || !initialised}
                    isErrorDuringAnalysis={Boolean(error && initialised)}
                    isInitialised={initialised}
                    loadingMessage={loadingMessage}
                />
            </div>

            <div
                className={cn(
                    'flex flex-2 w-full h-[min-content] xl:h-full xl:min-h-[100%] flex-col rounded-xl gap-6 bg-slate-50 p-4',
                    loading && 'overflow-hidden'
                )}
            >
                {result.length > 0 ? (
                    <ComponentMapper
                        items={result}
                        data={data}
                        exportButton={
                            <div className="flex flex-row gap-2 hideonprint justify-start">
                                <ExportButton
                                    buttonAlign={'left'}
                                    clusterInfo={clusterInfo}
                                    reactToPrintFn={reactToPrintFn}
                                    data={data}
                                />
                            </div>
                        }
                    />
                ) : loading ? (
                    <LoadingState
                        loadingMessageKey={loadingMessage}
                        initializingKey={
                            'syntheticData.form.actions.initializing'
                        }
                    />
                ) : (
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
