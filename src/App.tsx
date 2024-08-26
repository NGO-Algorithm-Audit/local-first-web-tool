import { useEffect, useRef, useState } from "react";
import { usePython } from "./components/pyodide/use-python";
import { demoCode } from "./assets/demoExample";

function App() {
  const [iter, setIter] = useState<number>(10);
  const [clusters, setClusters] = useState<number>(20);
  const { initialised, loading, result, initialise, runPython, error } =
    usePython();

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetch("/test_pred_BERT.csv").then((response) =>
        response.text()
      );
      initialise({ code: demoCode, data: data });
    };

    fetchData();
  }, []);

  const buttonClickHandler = () => {
    runPython({
      type: "start",
      params: {
        iter: iter,
        clusters: clusters,
      },
    });
  };

  return (
    <div className="p-4 md:max-w-[50%] max-w-full mx-auto">
      <h1 className="text-xl font-bold">Bias detection tool</h1>
      <div className={`md:max-w-[50%] max-w-full py-4 `}>
        <div className="flex flex-col mb-4">
          <label htmlFor="iter">Iterations</label>
          <input
            id="iter"
            name="iter"
            type="range"
            min="0"
            max="100"
            step="1"
            title={iter.toString()}
            disabled={!initialised}
            value={iter}
            onChange={(e) => {
              setIter(parseInt(e.target.value) ?? 0);
            }}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="clusters">Clusters</label>
          <input
            id="clusters"
            name="clusters"
            type="range"
            min="0"
            max="100"
            step="1"
            title={clusters.toString()}
            disabled={!initialised}
            value={clusters}
            onChange={(e) => {
              setClusters(parseInt(e.target.value) ?? 0);
            }}
          />
        </div>
      </div>
      <div className="flex gap-4 mb-4 items-center">
        <button
          disabled={!initialised}
          className={` text-white font-bold py-2 px-4 rounded ${initialised ? "bg-blue-500 hover:bg-blue-700" : "bg-blue-300"
            }`}
          onClick={buttonClickHandler}
        >
          start
        </button>
        <div
          className={`loader ${!initialised && !loading && "hidden"
            } max-h-[20px] max-w-[20px]`}
        ></div>
      </div>
      {/* <div className="flex flex-row gap-4">
        <button
          type="button"
          className={`${initialised
            ? "cursor-pointer"
            : "text-gray-400"
            }`}
          disabled={!initialised}
          onClick={() => {
            if (resultIndex > 0) {
              setResultIndex((resultIndex) => resultIndex - 1);
            }
          }}
        >
          Previous
        </button>
        <button
          type="button"
          className={`${showAndEnableControls && resultIndex < result.length - 1
            ? "cursor-pointer"
            : "text-gray-400"
            }`}
          disabled={!showAndEnableControls || resultIndex >= result.length - 1}
          onClick={() => {
            if (resultIndex < result.length - 1) {
              setResultIndex((resultIndex) => resultIndex + 1);
            }
          }}
        >
          Next
        </button>
        <span>
          {result.length == 0 ? 0 : resultIndex + 1} / {result.length}
        </span>
      </div> */}
      <div className="whitespace-pre-wrap font-mono mt-4">{result}</div>
      {error &&
        <div className="whitespace-pre-wrap font-mono mt-4 text-red-500">{error}</div>
      }
    </div>
  );
}

export default App;
