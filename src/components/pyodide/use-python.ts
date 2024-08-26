import { useRef, useCallback, useState } from "react";
import PythonWorker from "./worker?worker";

export interface PythonWorkerMessage {
    type: string;
    result?: string[];
    message?: string;
}

export const usePython = () => {
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState<Boolean>(false);
    const [initialised, setInitialised] = useState<Boolean>(false);
    const [error, setError] = useState<string | undefined>(undefined);

    const workerRef = useRef<Worker | undefined>(undefined);

    const onWorkerMessage = useCallback(
        (event: MessageEvent<PythonWorkerMessage>) => {
            console.log("Worker message", event.data);
            if (event.data.type && event.data.type === "initialised") {
                setInitialised(true);
            } else if (event.data.type && event.data.type === "result") {
                const outputResult: string[] = event.data.result ?? [''];
                let output = "";
                outputResult.forEach((result) => {
                    output += result + "\n\r";
                });

                setResult(output);
                setLoading(false);
            } else if (event.data.type && event.data.type === "error") {
                setError(event.data.message ?? '');
                setLoading(false);
            } else {
                setError("Unknown message type");
                setLoading(false);
            }
        },
        [result]
    );

    const runPython = useCallback(
        (message: {
            type: "start";
            params: { iter: number; clusters: number };
        }) => {
            setLoading(true);
            workerRef.current?.postMessage(message), [];
        },
        []
    );

    const initialise = useCallback(
        ({ code, data }: { code: string; data: string }) => {
            workerRef.current?.terminate();
            workerRef.current?.removeEventListener("message", onWorkerMessage);
            workerRef.current = new PythonWorker();

            workerRef.current.onerror = (e) => console.error(e);
            workerRef.current.postMessage({
                type: "init",
                params: { code: code, data: data },
            });
            workerRef.current.addEventListener("message", onWorkerMessage);
        },
        []
    );
    return {
        initialised,
        loading,
        result,
        initialise,
        runPython,
        error,
    };
};
