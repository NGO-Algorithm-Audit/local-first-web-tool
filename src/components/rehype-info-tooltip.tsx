import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Element, ElementData } from 'hast';

interface CustomElementData extends ElementData {
    properties?: {
        tooltip?: string;
    };
}

interface ElementNode extends Element {
    data?: CustomElementData;
}

export function rehypeInfoTooltip() {
    return (tree: Node) => {
        visit(tree, 'element', (node: ElementNode) => {
            if (node.properties?.tooltip) {
                console.log('Found tooltip in node:', node.properties.tooltip);
                // Create a custom component that will be rendered by react-markdown
                const tooltipNode: Element = {
                    type: 'element',
                    tagName: 'TooltipWrapper',
                    properties: {
                        tooltipContent: node.properties.tooltip,
                        // @ts-expect-error - We know this will be handled by react-markdown
                        children: node.children,
                    },
                    children: [],
                };

                // Replace the current node with the tooltip node
                Object.assign(node, tooltipNode);
                console.log('Updated node:', JSON.stringify(node, null, 2));
            }
        });
    };
}
