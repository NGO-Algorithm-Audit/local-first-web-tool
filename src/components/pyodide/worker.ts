import { loadPyodide, PyodideInterface } from "pyodide";
import { PythonWorkerMessage } from "./use-python";

interface CustomWorker extends Omit<Worker, 'postMessage'> {
    code: string;
    data: string;
    postMessage: (message: PythonWorkerMessage) => void;
    setResult: (result: string) => void;
    pyodide: PyodideInterface | undefined;
    iter: number;
    clusters: number;
}
declare var self: CustomWorker;

self.onmessage = async (e: MessageEvent<any>) => {
    console.log("Worker got message", e.data);
    let resultList: string[] = [];
    self.setResult = (...result) => {
        resultList.push(result.join(" "));
    };

    if (e.data && e.data.type === "init" && e.data.params.code && e.data.params.data) {
        self.data = e.data.params.data;
        self.code = e.data.params.code;
        await initPython();
        postMessage({ type: "initialised" });
    }
    if (e.data && e.data.type === "start") {
        self.iter = e.data.params.iter ?? 0;
        self.clusters = e.data.params.clusters ?? 0;

        await runPytonCode().then((_result) => {
            console.timeEnd("pyodide-python");
            postMessage({ type: "result", result: resultList });
        }, (error) => {
            console.timeEnd("pyodide-python");
            postMessage({ type: "error", message: error.message });
        });
    }

    async function initPython() {
        self.pyodide = await loadPyodide({ indexURL: "/pyodide" });
        await self.pyodide.loadPackage([
            "micropip",
            "numpy",
            "pandas",
            "scikit-learn",
        ]);

        const micropip = self.pyodide.pyimport("micropip");
        await micropip.install("unsupervised-bias-detection");
        await micropip.install("kmodes");

        return true;
    }

    async function runPytonCode() {
        if (!self.pyodide) {
            throw new Error("Pyodide is not loaded");
        }

        // use "python3 -m build" to create the wheel file from within the pip package root directory
        console.log("Start python code");
        console.time("pyodide-python");

        return await self.pyodide.runPythonAsync(self.code);
    }
};
export { };