import { useEffect, useState } from 'react'
import { ArrowPathIcon, PlayIcon, StopIcon } from '@heroicons/react/24/solid'
import Controls from './Controls'
import Loader from './Loader'
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";
import Input from './Input';
import { Packages } from 'react-py/dist/types/Packages';
import { usePython } from 'react-py';

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

interface CodeEditorProps {
    code: string
    packages?: Packages
}

export default function CodeEditor(props: CodeEditorProps) {
    const { code, packages } = props
    const [input, setInput] = useState(code)
    const [showOutput, setShowOutput] = useState(false)

    useEffect(() => {
        setInput(code.trimEnd())
        setShowOutput(false)
    }, [code])

    const {
        runPython,
        stdout,
        stderr,
        isLoading,
        isRunning,
        interruptExecution,
        isAwaitingInput,
        sendInput,
        prompt,
    } = usePython({ packages })

    function run() {
        runPython(input)
        setShowOutput(true)
    }

    function stop() {
        interruptExecution()
        setShowOutput(false)
    }

    function reset() {
        setShowOutput(false)
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
                        disabled: isLoading || isRunning,
                        hidden: isRunning
                    },
                    { label: 'Stop', icon: StopIcon, onClick: stop, hidden: !isRunning },
                    {
                        label: 'Reset',
                        icon: ArrowPathIcon,
                        onClick: reset,
                        disabled: isRunning
                    }
                ]}
                isAwaitingInput={isAwaitingInput}
            />

            {isLoading && <Loader />}

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

            {isAwaitingInput && <Input prompt={prompt ?? ''} onSubmit={sendInput} />}

            {showOutput && (
                <pre className="mt-4 text-left">
                    <code>{stdout}</code>
                    <code className="text-red-500">{stderr}</code>
                </pre>
            )}
        </div>
    )
}