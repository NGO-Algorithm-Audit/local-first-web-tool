import { Search, Sheet } from 'lucide-react';
import Logo from '@/components/icons/aa-logo.svg?react';
import { Link } from '@tanstack/react-router';

export default function Navigation() {
    return (
        <aside className="inset-y min-w-64 z-20 flex lg:h-full flex-col border-r">
            <div className="border-b border-gray-300 p-2">
                <a
                    href="https://algorithmaudit.eu/"
                    className="flex font-semibold rounded-lg p-2 text-sm items-center bg-muted [&.active]:text-white [&.active]:bg-aaLight"
                >
                    <Logo className="h-16 p-1" />
                </a>
            </div>

            <nav className="flex flex-row md:flex-col gap-4 p-3 hideonprint">
                <Link
                    to="/bias-detection"
                    className="flex font-semibold rounded-lg p-2 text-sm items-center bg-muted [&.active]:text-white [&.active]:bg-aaRegular"
                >
                    <Search className="size-4 mr-2" />
                    Bias detection tool
                </Link>
                <Link
                    disabled
                    to="/synthetic-data"
                    className="flex font-semibold rounded-lg p-2 text-sm items-center bg-muted [&.active]:text-white [&.active]:bg-aaRegular"
                >
                    <Sheet className="size-5 mr-2" />
                    Synthetic data generation
                </Link>
            </nav>
        </aside>
    );
}
