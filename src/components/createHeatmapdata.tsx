export function createHeatmapdata(resultItem: unknown) {
    const columns: string[] = [];
    const heatmapList =
        typeof resultItem === 'string'
            ? JSON.parse(resultItem as string)
            : (resultItem as Record<string, unknown>);
    const convertedData: number[][] = [];
    let createdColumns = false;
    if (heatmapList) {
        heatmapList.forEach(
            (heatmapRow: number[] | object, rowIndex: number) => {
                if (Array.isArray(heatmapRow)) {
                    columns.push(`${rowIndex + 1}`);
                    convertedData.push(heatmapRow);
                } else {
                    if (typeof heatmapRow === 'object') {
                        const temp = [];
                        for (const key in heatmapRow) {
                            temp.push(
                                (
                                    heatmapRow as unknown as Record<
                                        string,
                                        number
                                    >
                                )[key]
                            );
                            if (!createdColumns) {
                                columns.push(key);
                            }
                        }
                        createdColumns = true;
                        convertedData.push(temp);
                    }
                }
            }
        );
    }

    return {
        columns,
        data: convertedData,
    };
}
