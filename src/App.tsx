import { useEffect, useState } from "react";
import { usePython } from "./components/pyodide/use-python";
import { demoCode } from "./assets/demoExample";
import CSVReader from "./components/CSVReader";

function App() {
  const [iter, setIter] = useState<number>(10);
  const [clusters, setClusters] = useState<number>(20);
  const [data, setData] = useState<string>("");
  const { initialised, loading, result, initialise, runPython, error } =
    usePython();

  const onFileLoad = (data: string) => {
    setData(data);
  }

  useEffect(() => {
    const fetchData = async () => {
      if (demoCode && data.length) {
        initialise({ code: demoCode, data: data });
      }
    };

    fetchData();
  }, [data]);

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
      <CSVReader onChange={onFileLoad} />
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
      
      <div className="whitespace-pre-wrap font-mono mt-4">{result}</div>
      {error &&
        <div className="whitespace-pre-wrap font-mono mt-4 text-red-500">{error}</div>
      }
    </div>
  );
}

export default App;
