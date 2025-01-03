import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { useTranslation } from 'react-i18next';

export default function SimpleTable({
    title,
    data,
    showIndex,
}: {
    showIndex: boolean;
    title?: string;
    data: Record<string, string | number>[];
}) {
    const { t } = useTranslation();
    // limit data to the first 100 rows.
    data = data.slice(0, 100);

    return (
        <div className={`bg-white border border-gray-200 ${title && 'mb-4'}`}>
            <Table className={`text-xs ${title && 'mb-4'}`}>
                {title && <TableCaption>{t(title)}</TableCaption>}
                <TableHeader>
                    <TableRow className="bg-aaLight">
                        {showIndex && <TableHead></TableHead>}
                        {Object.keys(data[0]).map(key => (
                            <TableHead key={key} className="text-black">
                                {key}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((row, i) => (
                        <TableRow key={i}>
                            {showIndex && <TableCell>{i}</TableCell>}
                            {Object.values(row).map((value, i) => (
                                <TableCell key={i}>{value}</TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
