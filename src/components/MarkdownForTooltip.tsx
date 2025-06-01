import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import RemarkMath from 'remark-math';
import { MathJaxContext, MathJax } from 'better-react-mathjax';

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
        <MathJaxContext hideUntilTypeset="every">
            <Markdown
                className={className}
                remarkPlugins={[remarkGfm, RemarkMath]}
                rehypePlugins={[]}
                components={{
                    // @ts-expect-error - math is a custom components
                    math: (props: any) => <MathJax>{props.value}</MathJax>,
                    inlineMath: (props: any) => (
                        <MathJax>{props.value}</MathJax>
                    ),
                }}
            >
                {children}
            </Markdown>
        </MathJaxContext>
    );
}
