import { visit } from 'unist-util-visit';
import type { Node } from 'unist';
import type { Element, ElementData } from 'hast';
import { t } from 'i18next';

interface CustomElementData extends ElementData {
    properties?: {
        tooltip?: string;
        textBefore?: string;
        textAfter?: string;
    };
}

interface ElementNode extends Element {
    data?: CustomElementData;
}

export function rehypeInfoTooltip() {
    return (tree: Node) => {
        visit(tree, 'element', (node: ElementNode) => {
            if (node.properties?.tooltip) {
                // Create a custom component that will be rendered by react-markdown
                const tooltipNode: Element = {
                    type: 'element',
                    tagName: 'TooltipWrapper',
                    properties: {
                        tooltipContent: t(node.properties.tooltip as string),
                        textBefore: node.properties.textBefore,
                        textAfter: node.properties.textAfter,
                        children: node.children
                            .map(child => {
                                if (child.type === 'text') {
                                    return child.value;
                                }
                                return child;
                            })
                            .join(''),
                    },
                    children: node.children,
                };

                // Replace the current node with the tooltip node
                Object.assign(node, tooltipNode);
            }
        });
    };
}
