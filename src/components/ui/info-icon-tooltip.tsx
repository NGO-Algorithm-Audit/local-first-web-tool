import { InfoIcon } from 'lucide-react';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from './touch-tooltip';
import { MarkdownForTooltip } from '../MarkdownForTooltip';

export const IconInfoTooltip = ({ tooltipText }: { tooltipText: string }) => {
    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger
                    onClick={event => {
                        event.preventDefault();
                    }}
                >
                    <InfoIcon className="size-3.5" />
                </TooltipTrigger>
                <TooltipContent>
                    <div className="whitespace-pre-wrap max-w-full w-[400px] p-2">
                        <MarkdownForTooltip className="-mt-2 text-gray-800 markdown">
                            {tooltipText}
                        </MarkdownForTooltip>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};
