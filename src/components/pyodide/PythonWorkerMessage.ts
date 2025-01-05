export interface PythonWorkerMessage<T> {
    type: string;
    result?: string[];
    message?: string;
    export: T;
    params?: Record<string, number | string | boolean>;
    progress?: number;
}
