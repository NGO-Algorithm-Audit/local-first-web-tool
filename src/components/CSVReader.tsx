import { useCallback } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import { File } from 'lucide-react';
import { Button } from './ui/button';
import { FormItem, FormLabel } from './ui/form';

export interface csvReader {
    onChange: (
        data: Record<string, string>[],
        stringified: string,
        fileName: string,
        demo?: boolean
    ) => void;
}

export default function CSVReader({ onChange }: csvReader) {
    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        // Ensure there's only one file and it's a CSV
        if (acceptedFiles.length == 1 && acceptedFiles[0].type === 'text/csv') {
            const file = acceptedFiles[0];

            // Use PapaParse to parse the CSV file
            Papa.parse(file, {
                header: true, // if the CSV file has headers
                skipEmptyLines: true,
                worker: true,
                dynamicTyping: true,

                complete: function (results) {
                    onChange(
                        results.data as Record<string, string>[],
                        Papa.unparse(results.data),
                        file.name
                    );
                },
                error: function (error) {
                    console.error(error.message);
                },
            });
        } else {
            alert('Please upload a valid CSV file.');
        }
    }, []);

    const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1,
    });

    if (acceptedFiles.length > 0) {
        return (
            <div className="border-aaDark border-2 rounded-xl text-center p-8 lg:min-w-[400px]">
                <ul>
                    {acceptedFiles.map(file => (
                        <li
                            key={file.name}
                            className="text-aaDark font-bold text-sm flex items-center gap-2"
                        >
                            <File className="size-5" />
                            {file.name} - {(file.size / 1024).toFixed(2)} kB
                            <Button
                                onClick={() => {
                                    acceptedFiles.splice(
                                        acceptedFiles.indexOf(file),
                                        1
                                    );
                                    onChange([], '', '');
                                }}
                                variant="outline"
                                size="sm"
                                className="ml-auto gap-1.5"
                            >
                                Remove
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        );
    }

    return (
        <FormItem
            {...getRootProps()}
            className="border-aaDark border-dashed border-2 cursor-pointer rounded-xl text-center p-10 lg:min-w-[400px]"
        >
            <input {...getInputProps()} multiple={false} />

            <FormLabel>
                Drag 'n' drop a CSV file here, or click to select one
            </FormLabel>
        </FormItem>
    );
}
