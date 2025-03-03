export interface PythonWorkerMessage<T> {
    type:
        | 'pre-initialised'
        | 'initialised'
        | 'result'
        | 'error'
        | 'data-set'
        | 'loading';
    result?: string[];
    message?: string;
    export?: T;
    params?: Record<string, number | string | boolean>;
    loadingStage?: string;
}
