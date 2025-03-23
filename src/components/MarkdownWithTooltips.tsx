import Markdown from 'react-markdown';
import { remarkInfoTooltip } from './remark-info-tooltip';
import { rehypeInfoTooltip } from './rehype-info-tooltip';
import { TooltipWrapper } from './TooltipWrapper';
import type { Element, ElementData } from 'hast';

interface MarkdownWithTooltipsProps {
    children: string;
    className?: string;
}

interface CustomElementData extends ElementData {
    hProperties?: {
        tooltip?: string;
    };
}

interface CustomElement extends Element {
    data?: CustomElementData;
}

export function MarkdownWithTooltips({
    children,
    className,
}: MarkdownWithTooltipsProps) {
    return (
        <Markdown
            className={className}
            remarkPlugins={[remarkInfoTooltip]}
            rehypePlugins={[rehypeInfoTooltip]}
            components={{
                // @ts-expect-error - TooltipWrapper is a custom component
                TooltipWrapper,
                div: ({ node, children, ...props }) => {
                    const element = node as CustomElement;
                    const tooltipContent = element.data?.hProperties?.tooltip;
                    if (tooltipContent) {
                        return (
                            <>
                                <span {...props}>{children}</span>
                                <TooltipWrapper
                                    tooltipContent={tooltipContent}
                                    children={children}
                                />
                            </>
                        );
                    }
                    return <span {...props}>{children}</span>;
                },
            }}
        >
            {children}
        </Markdown>
    );
}
