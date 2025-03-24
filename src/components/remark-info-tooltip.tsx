import { visitParents } from 'unist-util-visit-parents';
import type { Node } from 'unist';
import type { Element, ElementData } from 'hast';

interface TextNode extends Node {
    type: 'text';
    value: string;
}

interface ParentNode extends Node {
    children: Node[];
}

interface CustomElementData extends ElementData {
    hProperties?: {
        tooltip?: string;
        textBefore?: string;
        textAfter?: string;
    };
}

export function remarkInfoTooltip() {
    return (tree: Node) => {
        visitParents(
            tree,
            'text',
            (node: TextNode, ancestors: ParentNode[]) => {
                const matches = node.value.match(
                    /\{tooltip:([^}]+)\}(.*?)\{\/tooltip\}/g
                );

                if (matches) {
                    let lastIndex = 0;
                    const newChildren: Node[] = [];

                    matches.forEach(match => {
                        const tooltipMatch = match.match(
                            /\{tooltip:([^}]+)\}(.*?)\{\/tooltip\}/
                        );
                        if (tooltipMatch) {
                            const [, tooltipContent, text] = tooltipMatch;
                            const index = node.value.indexOf(match, lastIndex);

                            // Add text before the tooltip
                            const textBefore = node.value.slice(
                                lastIndex,
                                index
                            );
                            if (textBefore) {
                                const textNode: TextNode = {
                                    type: 'text',
                                    value: textBefore,
                                };
                                newChildren.push(textNode);
                            }

                            // Create a new element node for the tooltip
                            const elementNode: Element = {
                                type: 'element',
                                tagName: 'span',
                                properties: {
                                    tooltip: tooltipContent,
                                },
                                data: {
                                    hProperties: {
                                        tooltip: tooltipContent,
                                    },
                                } as CustomElementData,
                                children: [
                                    {
                                        type: 'text',
                                        value: text,
                                    } as TextNode,
                                ],
                            };
                            newChildren.push(elementNode);

                            lastIndex = index + match.length;
                        }
                    });

                    // Add any remaining text after the last tooltip
                    const remainingText = node.value.slice(lastIndex);
                    if (remainingText) {
                        const textNode: TextNode = {
                            type: 'text',
                            value: remainingText,
                        };
                        newChildren.push(textNode);
                    }

                    // Replace the text node with the new children
                    if (ancestors.length > 0) {
                        const parent = ancestors[ancestors.length - 1];
                        const nodeIndex = parent.children.indexOf(node);
                        if (nodeIndex !== -1) {
                            parent.children.splice(
                                nodeIndex,
                                1,
                                ...newChildren
                            );
                        }
                    }
                }
            }
        );
    };
}
