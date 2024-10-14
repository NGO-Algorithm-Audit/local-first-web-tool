import { loadPyodide, PyodideInterface } from 'pyodide';
import { PythonWorkerMessage } from './use-python';

interface CustomWorker extends Omit<Worker, 'postMessage'> {
    code: string;
    data: string;
    postMessage: (message: PythonWorkerMessage) => void;
    setResult: (result: string) => void;
    setMostBiasedCluster: (cluster: string) => void;
    setOtherClusters: (clusters: string) => void;
    pyodide: PyodideInterface | undefined;
    iter: number;
    clusters: number;
    targetColumn: string;
    dataType: string;
}
declare let self: CustomWorker;

interface MessageData {
    data: {
        type: string;
        params: {
            data: string;
            code: string;
            iter: number;
            clusters: number;
            dataType: string;
            targetColumn: string;
        };
    };
}

self.onmessage = async (e: MessageData) => {
    console.log('Worker got message', e.data);
    const resultList: string[] = [];
    let mostBiasedCluster: string = '';
    let otherClusters: string = '';
    self.setResult = (...result) => {
        resultList.push(result.join(' '));
    };

    self.setMostBiasedCluster = (cluster: string) => {
        mostBiasedCluster = cluster;
    };

    self.setOtherClusters = (clusters: string) => {
        otherClusters = clusters;
    };

    if (e.data && e.data.type === 'data' && e.data.params.data) {
        self.data = e.data.params.data;

        postMessage({ type: 'data-set' });
    }
    if (e.data && e.data.type === 'init' && e.data.params.code) {
        self.data = 'INIT';
        self.code = e.data.params.code;
        self.targetColumn = '';
        self.dataType = 'numeric';
        await initPython();
        postMessage({ type: 'pre-initialised' });
    }
    if (e.data && e.data.type === 'start') {
        self.iter = e.data.params.iter ?? 0;
        self.clusters = e.data.params.clusters ?? 0;
        self.targetColumn = e.data.params.targetColumn ?? '';
        self.dataType = e.data.params.dataType ?? 'numeric';

        await runPytonCode().then(
            () => {
                console.timeEnd('pyodide-python');
                postMessage({
                    type: 'result',
                    result: resultList,
                    clusterInfo: {
                        date: new Date(),
                        iter: self.iter,
                        clusters: self.clusters,
                        targetColumn: self.targetColumn,
                        dataType: self.dataType,
                        mostBiasedCluster: JSON.parse(mostBiasedCluster),
                        otherClusters: JSON.parse(otherClusters),
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
        self.iter = 0;
        self.clusters = 0;
        self.dataType = 'numeric';

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
        self.pyodide = await loadPyodide({ indexURL: '/pyodide' });
        await self.pyodide.loadPackage([
            'micropip',
            'numpy',
            'pandas',
            'scikit-learn',
        ]);

        const micropip = self.pyodide.pyimport('micropip');
        await micropip.install('unsupervised-bias-detection');
        await micropip.install('kmodes');
        await micropip.install('scipy');

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
