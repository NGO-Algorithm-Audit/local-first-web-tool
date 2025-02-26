import { loadPyodide, PyodideInterface } from 'pyodide';
import { PythonWorkerMessage } from './PythonWorkerMessage';

interface CustomWorker extends Omit<Worker, 'postMessage'> {
    code: string;
    data: string;
    postMessage: (message: PythonWorkerMessage<unknown>) => void;
    setResult: (result: string) => void;
    setOutputData: (propertyName: string, data: string) => void;
    pyodide: PyodideInterface | undefined;
    parameters: Record<string, number | string | boolean>;
}
declare let self: CustomWorker;

interface MessageData {
    data: {
        type: string;
        params: {
            data: string;
            code: string;
            parameters: Record<string, number | string | boolean>;
        };
    };
}

self.onmessage = async (e: MessageData) => {
    console.log('Worker got message', e.data);
    const resultList: string[] = [];
    self.setResult = (...result) => {
        resultList.push(result.join(' '));
    };
    let outputData: Record<string, string> = {};

    self.setOutputData = (propertyName: string, data: string) => {
        outputData[propertyName] = data;
    };

    if (e.data && e.data.type === 'data' && e.data.params.data) {
        self.data = e.data.params.data;

        postMessage({ type: 'data-set' });
    }
    if (e.data && e.data.type === 'init' && e.data.params.code) {
        self.data = 'INIT';
        self.code = e.data.params.code;
        await initPython();
        postMessage({ type: 'pre-initialised' });
    }
    if (e.data && e.data.type === 'start') {
        outputData = {};
        self.parameters = e.data.params.parameters;
        Object.entries(e.data.params?.parameters).forEach(key => {
            if (key[0]) {
                const keyName = key[0] as keyof CustomWorker;
                (self as unknown as Record<string, number | string | boolean>)[
                    keyName
                ] = key[1];
            }
        });
        await runPytonCode().then(
            () => {
                console.timeEnd('pyodide-python');
                const outputDataAsJson: Record<string, object> = {};
                Object.entries(outputData).map(key => {
                    outputDataAsJson[key[0]] = JSON.parse(key[1]);
                });
                postMessage({
                    type: 'result',
                    result: resultList,
                    export: {
                        date: new Date(),
                        ...self.parameters,
                        ...outputDataAsJson,
                    },
                });
            },
            error => {
                console.timeEnd('pyodide-python');
                postMessage({ type: 'error', message: error.message });
            }
        );
    }

    if (e.data && e.data.type === 'init-run') {
        self.data = 'INIT';
        self.parameters = e.data.params.parameters;
        Object.entries(e.data.params?.parameters).forEach(key => {
            if (key[0]) {
                const keyName = key[0] as keyof CustomWorker;
                (self as unknown as Record<string, number | string | boolean>)[
                    keyName
                ] = key[1];
            }
        });

        await runPytonCode().then(
            () => {
                console.timeEnd('pyodide-python');
                postMessage({ type: 'initialised' });
            },
            error => {
                console.timeEnd('pyodide-python');
                postMessage({ type: 'error', message: error.message });
            }
        );
    }

    async function initPython() {
        postMessage({
            type: 'loading',
            loadingStage: 'loadingPyodide',
        });
        self.pyodide = await loadPyodide({ indexURL: '/pyodide' });

        postMessage({
            type: 'loading',
            loadingStage: 'loadingPackages',
        });
        await self.pyodide.loadPackage([
            'micropip',
            'numpy',
            'pandas',
            'scikit-learn',
        ]);

        const micropip = self.pyodide.pyimport('micropip');

        postMessage({
            type: 'loading',
            loadingStage: 'installingPackages',
        });
        await micropip.install('unsupervised-bias-detection');
        await micropip.install('kmodes');
        await micropip.install('scipy');
        await micropip.install('python-synthpop');
        return true;
    }

    async function runPytonCode() {
        if (!self.pyodide) {
            throw new Error('Pyodide is not loaded');
        }

        // use "python3 -m build" to create the wheel file from within the pip package root directory
        console.log('Start python code');
        console.time('pyodide-python');

        return await self.pyodide.runPythonAsync(self.code);
    }
};
export {};
