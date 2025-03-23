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
    textBefore?: string;
    textAfter?: string;
    children: React.ReactNode;
}

export function TooltipWrapper({
    tooltipContent,
    textBefore,
    textAfter,
    children,
}: TooltipWrapperProps) {
    return (
        <div>
            {textBefore}
            {children}

            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger
                        onClick={event => {
                            event.preventDefault();
                        }}
                    >
                        <InfoIcon className="size-3.5 ml-1" />
                    </TooltipTrigger>
                    <TooltipContent className="tooltip-content max-w-[400px] p-2">
                        <MarkdownWithTooltips className="text-gray-800 markdown">
                            {tooltipContent}
                        </MarkdownWithTooltips>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {textAfter}
        </div>
    );
}
