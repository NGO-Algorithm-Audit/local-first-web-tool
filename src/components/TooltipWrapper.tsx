import { InfoIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './ui/tooltip';
import { MarkdownWithTooltips } from './MarkdownWithTooltips';

interface TooltipWrapperProps {
    tooltipContent: string;
    children: React.ReactNode;
}

export function TooltipWrapper({
    tooltipContent,
    children,
}: TooltipWrapperProps) {
    return (
        <span className="inline-flex items-center">
            {children}
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <InfoIcon className="size-3.5 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[400px] p-2">
                        <MarkdownWithTooltips className="text-gray-800 markdown">
                            {tooltipContent}
                        </MarkdownWithTooltips>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </span>
    );
}
