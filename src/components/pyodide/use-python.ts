import { useRef, useCallback, useState } from 'react';
import PythonWorker from './worker?worker';

export interface PythonWorkerMessage {
    type: string;
    result?: string[];
    message?: string;
}

export const usePython = () => {
    const [result, setResult] = useState<string[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [initialised, setInitialised] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const workerRef = useRef<Worker | undefined>(undefined);

    const onWorkerMessage = useCallback(
        (event: MessageEvent<PythonWorkerMessage>) => {
            console.log('Worker message', event.data);
            if (event.data.type && event.data.type === 'pre-initialised') {
                workerRef.current?.postMessage({
                    type: 'init-run',
                });
            } else if (event.data.type && event.data.type === 'initialised') {
                console.log('Worker initialised');
                setInitialised(true);
                setLoading(false);
            } else if (event.data.type && event.data.type === 'result') {
                setResult(event.data.result ?? ['']);
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
        (message: {
            type: 'start';
            params: {
                iter: number;
                clusters: number;
                targetColumn: string;
                dataType: string;
            };
        }) => {
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
                params: { code: code, data: data },
            });
            workerRef.current.addEventListener('message', onWorkerMessage);
        },
        []
    );
    const sendData = useCallback((data: string) => {
        setResult([]);
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
    };
};
