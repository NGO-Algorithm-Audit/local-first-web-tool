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
    textBefore?: string;
    textAfter?: string;
}

export function TooltipWrapper({
    tooltipContent,
    children,
    textBefore,
    textAfter,
}: TooltipWrapperProps) {
    return (
        <span>
            {textBefore}
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span className="border-b-2 border-dashed border-gray-600 cursor-help">
                            {children}
                        </span>
                    </TooltipTrigger>
                    <TooltipContent className="tooltip-content max-w-[400px] p-2">
                        <MarkdownWithTooltips className="text-gray-800 markdown">
                            {tooltipContent}
                        </MarkdownWithTooltips>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {textAfter}
        </span>
    );
}
