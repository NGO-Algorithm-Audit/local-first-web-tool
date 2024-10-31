import { useRef, useCallback, useState } from 'react';
import PythonWorker from './worker?worker';
import { PythonWorkerMessage } from './PythonWorkerMessage';

export const usePython = <T, TExport>(emptyParams: T) => {
    const [result, setResult] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [initialised, setInitialised] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);
    const [clusterInfo, setClusterInfo] = useState<TExport | undefined>(
        undefined
    );

    const workerRef = useRef<Worker | undefined>(undefined);

    const onWorkerMessage = useCallback(
        (event: MessageEvent<PythonWorkerMessage<TExport>>) => {
            console.log('Worker message', event.data);
            if (event.data.type && event.data.type === 'pre-initialised') {
                workerRef.current?.postMessage({
                    type: 'init-run',
                    params: {
                        parameters: emptyParams,
                    },
                });
            } else if (event.data.type && event.data.type === 'initialised') {
                console.log('Worker initialised');
                setInitialised(true);
                setLoading(false);
            } else if (event.data.type && event.data.type === 'result') {
                setResult(event.data.result ?? ['']);
                setClusterInfo(event.data.export);
                setLoading(false);
            } else if (event.data.type && event.data.type === 'error') {
                setError(event.data.message ?? '');
                setLoading(false);
            } else if (event.data.type && event.data.type === 'data-set') {
                setError(undefined);
                setLoading(false);
            } else {
                setError('Unknown message type');
                setLoading(false);
            }
        },
        [result]
    );

    const runPython = useCallback(
        (message: { type: 'start'; params: { parameters: T } }) => {
            setClusterInfo(undefined);
            setResult([]);
            setError(undefined);
            setLoading(true);
            workerRef.current?.postMessage(message), [];
        },
        []
    );

    const initialise = useCallback(
        ({ code, data }: { code: string; data: string }) => {
            setLoading(true);
            workerRef.current?.terminate();
            workerRef.current?.removeEventListener('message', onWorkerMessage);
            workerRef.current = new PythonWorker();

            workerRef.current.onerror = e => console.error(e);
            workerRef.current.postMessage({
                type: 'init',
                params: { code: code, data: data, parameters: emptyParams },
            });
            workerRef.current.addEventListener('message', onWorkerMessage);
        },
        []
    );
    const sendData = useCallback((data: string) => {
        setResult([]);
        setClusterInfo(undefined);
        workerRef.current?.postMessage({
            type: 'data',
            params: {
                data: data,
            },
        });
    }, []);
    return {
        initialised,
        loading,
        result,
        initialise,
        runPython,
        error,
        sendData,
        clusterInfo,
    };
};
