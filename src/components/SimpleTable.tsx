import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

export default function SimpleTable({
    title,
    data,
}: {
    title?: string;
    data: Record<string, string | number>[];
}) {
    // limit data to the first 100 rows.
    data = data.slice(0, 100);

    return (
        <div className={`bg-white border border-gray-200 ${title && 'mb-4'}`}>
            <Table className={`text-xs ${title && 'mb-4'}`}>
                {title && <TableCaption>{title}</TableCaption>}
                <TableHeader>
                    <TableRow className="bg-aaLight">
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
