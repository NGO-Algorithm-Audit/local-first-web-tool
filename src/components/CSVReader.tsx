import { useCallback } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import Papa from 'papaparse';

export default function CSVReader({ onChange } : {onChange: (data: string) => void}) {

    const onDrop = useCallback((acceptedFiles: FileWithPath[]) => {
        // Ensure there's only one file and it's a CSV
        if (acceptedFiles.length > 0 && acceptedFiles[0].type === "text/csv") {
          const file = acceptedFiles[0];
    
          // Use PapaParse to parse the CSV file
          Papa.parse(file, {
            header: true, // if the CSV file has headers
            skipEmptyLines: true,
            worker: true,

            complete: function(results) {
                console.log('PARSED DATA', results.data);
                onChange(Papa.unparse(results.data));
            },
            error: function(error) {
              console.error(error.message);
            }
          });
        } else {
          alert("Please upload a valid CSV file.");
        }
      }, []);
    
      const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        maxFiles: 1
      });
    
      return (
        <div {...getRootProps()} style={{ border: '2px dashed #000', padding: '20px', textAlign: 'center' }}>
          <input {...getInputProps()} />
          <p>Drag 'n' drop a CSV file here, or click to select one</p>
        </div>
      );
}