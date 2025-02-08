import { downloadFile } from '@/lib/download-file';
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';

import { ChevronDown, Share } from 'lucide-react';
import { Button } from '../ui/button';
import { SyntheticDataInfo } from '../synthetic-data-interfaces/cluster-export';
import { useTranslation } from 'react-i18next';
import { UseReactToPrintFn } from 'react-to-print';
import { SyntheticData } from '../synthetic-data-interfaces/data';

export const ExportButton = ({
    clusterInfo,
    reactToPrintFn,
    data,
    handleExport,
}: {
    clusterInfo: SyntheticDataInfo | undefined;
    reactToPrintFn: UseReactToPrintFn;
    data: SyntheticData;
    handleExport: (syntheticData: object[]) => void;
}) => {
    const { t } = useTranslation();
    return (
        <div className="flex flex-row gap-2 hideonprint">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="default"
                        size="sm"
                        className="mx-auto py-6 px-4 text-sm bg-aaRegularLight hover:bg-aaRegularLight text-black hover:text-black transform transition-colors duration-200 group"
                    >
                        {t('downloadButton')}
                        <ChevronDown className="relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    className="bg-white p-4 rounded-md flex flex-col gap-2 shadow-md"
                >
                    <DropdownMenuItem
                        onClick={() => reactToPrintFn()}
                        className="flex flex-row items-center cursor-pointer"
                    >
                        <Share className="size-3.5 mr-2" />
                        {t('syntheticData.exportToPDF')}
                    </DropdownMenuItem>
                    {clusterInfo && (
                        <>
                            <DropdownMenuItem
                                className="flex flex-row items-center cursor-pointer"
                                onClick={() => {
                                    downloadFile(
                                        JSON.stringify(
                                            {
                                                fileName: data.fileName,
                                                ...clusterInfo,
                                            },
                                            null,
                                            2
                                        ),
                                        `${data.fileName.replace('.csv', '') || 'cluster-info'}-${clusterInfo.date.toISOString()}.json`,
                                        'application/json'
                                    );
                                }}
                            >
                                <Share className="size-3.5 mr-2" />
                                {t('syntheticData.exportToJSON')}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                className="flex flex-row items-center cursor-pointer"
                                onClick={() => {
                                    handleExport(
                                        clusterInfo.syntheticData as object[]
                                    );
                                }}
                            >
                                <Share className="size-3.5 mr-2" />
                                {t('syntheticData.exportToCSV')}
                            </DropdownMenuItem>
                        </>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    );
};
