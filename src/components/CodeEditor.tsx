import { useEffect, useRef, useState } from 'react'
import { ArrowPathIcon, PlayIcon, StopIcon } from '@heroicons/react/24/solid'
import Controls from './Controls'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import { useAsync } from 'react-async-hook';
import { usePyodide } from 'use-pyodide';

const editorOptions = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    highlightActiveLine: false,
    showPrintMargin: false
}

const editorOnLoad = (editor: { renderer: { setScrollMargin: (arg0: number, arg1: number, arg2: number, arg3: number) => void; }; moveCursorTo: (arg0: number, arg1: number) => void; }) => {
    editor.renderer.setScrollMargin(10, 10, 0, 0)
    editor.moveCursorTo(0, 0)
}

// const testworker = new ComlinkWorker(new URL('./pyodide/pyodide-worker.js', import.meta.url), {
//     type: 'module',
// });

interface CodeEditorProps {
    code: string
    packages?: string[]
}

export default function CodeEditor(props: CodeEditorProps) {
    const { code, packages } = props
    const [input, setInput] = useState(code)
    const [output, setOutput] = useState(null)
    const { pyodide, loading, error } = usePyodide();

    useEffect(() => {
        console.log('pyodide init', pyodide)
        if (pyodide) {
            pyodide.runPython(`print("👋 from Python")`)
        }
    }, [pyodide]);


    const pyodideRef = useRef(); // Ref to store the Comlink instance
    const { loading } = useAsync(async () => {
        const pyodideWorker = new ComlinkWorker(new URL("./pyodide/webworker.js", import.meta.url), {
            name: "pyodide",
            type: "module",
        });
        await pyodideWorker.init();
        console.log('pyodide worker initialized')
        pyodideRef.current = pyodideWorker; // Store the Comlink instance in the ref
    }, []);

    useEffect(() => {
        setInput(code.trimEnd())
    }, [code])

    // const {
    //     runPython,
    //     stdout,
    //     stderr,
    //     isLoading,
    //     isRunning,
    //     interruptExecution,
    //     isAwaitingInput,
    //     sendInput,
    //     prompt,
    // } = usePython({ packages })

    async function run() {
        const result = await pyodideRef.current.runPython(input, 'run')
        console.log('pyodide result', result)
        setOutput(result)

    }

    function stop() {
        console.log('stopping code')


        setOutput(null)
    }

    function reset() {
        setOutput(null)
        setInput(code.trimEnd())
    }

    return (
        <div className="relative mb-10 flex flex-col">
            <Controls
                items={[
                    {
                        label: 'Run',
                        icon: PlayIcon,
                        onClick: run,
                        disabled: loading,
                    },
                    { label: 'Stop', icon: StopIcon, onClick: stop },
                    {
                        label: 'Reset',
                        icon: ArrowPathIcon,
                        onClick: reset,
                    }
                ]}
                isAwaitingInput={false}
            />


            <AceEditor
                value={input}
                mode="python"
                name="CodeBlock"
                fontSize="0.9rem"
                className="min-h-[7rem] overflow-clip rounded shadow-md"
                theme={'github'}
                onChange={(newValue) => setInput(newValue)}
                width="100%"
                maxLines={Infinity}
                onLoad={editorOnLoad}
                editorProps={{ $blockScrolling: true }}
                setOptions={editorOptions}
            />

            {output && (
                <pre className="mt-4 text-left">
                    <code>{output}</code>
                    <code className="text-red-500"></code>
                </pre>
            )}
        </div>
    )
}