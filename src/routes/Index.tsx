import { Search, Sheet } from 'lucide-react';
import Logo from '@/components/icons/aa-logo.svg?react';

export default function Navigation() {
    return (
        <div className="w-full h-full flex flex-col bg-aaLight gap-4 justify-around items-center">
            <div className="flex-1 flex flex-col justify-end">
                <a
                    href="https://algorithmaudit.eu/"
                    className="font-semibold rounded-lg p-2 text-sm bg-muted [&.active]:text-white [&.active]:bg-aaLight"
                >
                    <Logo className="h-16 p-1" />
                </a>
            </div>

            <div className="flex-1 flex flex-col items-center">
                <nav className="flex flex-row md:flex-col gap-4 p-4 rounded-2xl bg-white">
                    <a
                        href="/bias-detection.html"
                        className="flex font-semibold rounded-lg p-2 text-sm items-center bg-muted [&.active]:text-white [&.active]:bg-aaRegular"
                    >
                        <Search className="size-4 mr-2" />
                        Bias detection tool
                    </a>
                    <hr />
                    <a
                        aria-disabled
                        href="/synthetic-data.html"
                        className="flex font-semibold rounded-lg p-2 text-sm items-center bg-muted [&.active]:text-white [&.active]:bg-aaRegular"
                    >
                        <Sheet className="size-5 mr-2" />
                        Synthetic data generation
                    </a>
                </nav>
            </div>
        </div>
    );
}
