import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';

interface MarkdownForTooltipProps {
    children: string;
    className?: string;
}

export function MarkdownForTooltip({
    children,
    className,
}: MarkdownForTooltipProps) {
    console.log('MarkdownForTooltip children:', children);
    return (
        <Markdown
            className={className}
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeRaw]}
            components={{}}
        >
            {children}
        </Markdown>
    );
}
