import { UseReactToPrintFn } from 'react-to-print';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { ChevronDown, Share } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ClusterInfo } from '../bias-detection-interfaces/cluster-export';
import { CSVData } from '../bias-detection-interfaces/csv-data';
import { downloadFile } from '@/lib/download-file';

export const ExportButton = ({
    clusterInfo,
    reactToPrintFn,
    data,
    buttonAlign,
}: {
    buttonAlign: 'left' | 'right' | 'center';
    clusterInfo: ClusterInfo | undefined;
    reactToPrintFn: UseReactToPrintFn;
    data: CSVData;
}) => {
    const { t } = useTranslation();
    const buttonAlignClass =
        buttonAlign === 'left'
            ? 'mr-auto'
            : buttonAlign === 'right'
              ? 'ml-auto'
              : 'mx-auto';
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={`${buttonAlignClass} p-4 text-sm`}
                >
                    {t('downloadButton')}
                    <ChevronDown
                        className={`relative top-[1px] ml-1 h-3 w-3 transition duration-200 group-data-[state=open]:rotate-180`}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => reactToPrintFn()}>
                    <Share className="size-3.5 mr-2" />
                    {t('biasSettings.exportToPDF')}
                </DropdownMenuItem>
                {clusterInfo && (
                    <DropdownMenuItem
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
                        {t('biasSettings.exportToJSON')}
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
