import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function exportToCSV(data: any[], filename: string) {
    // Convert data to CSV format
    const csvContent = data.map(row => {
        return Object.values(row)
            .map(value => {
                // Handle special characters and wrap in quotes if needed
                const stringValue = String(value);
                return stringValue.includes(',') ||
                    stringValue.includes('"') ||
                    stringValue.includes('\n')
                    ? `"${stringValue.replace(/"/g, '""')}"`
                    : stringValue;
            })
            .join(',');
    });

    // Add headers
    const headers = Object.keys(data[0]).join(',');
    const csvString = [headers, ...csvContent].join('\n');

    // Create and trigger download
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
