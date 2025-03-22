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
                    matches.forEach(match => {
                        const tooltipMatch = match.match(
                            /\{tooltip:([^}]+)\}(.*?)\{\/tooltip\}/
                        );
                        if (tooltipMatch) {
                            const [, tooltipContent, text] = tooltipMatch;
                            const index = node.value.indexOf(match);
                            if (index !== -1) {
                                // Create a new element node
                                const elementNode: Element = {
                                    type: 'element',
                                    tagName: 'span',
                                    properties: {},
                                    data: {
                                        hProperties: {
                                            tooltip: tooltipContent,
                                        },
                                    } as CustomElementData,
                                    children: [
                                        {
                                            type: 'text',
                                            value: text,
                                        },
                                    ],
                                };

                                // Replace the text node with the element node
                                if (ancestors.length > 0) {
                                    const parent =
                                        ancestors[ancestors.length - 1];
                                    const nodeIndex =
                                        parent.children.indexOf(node);
                                    if (nodeIndex !== -1) {
                                        parent.children[nodeIndex] =
                                            elementNode;
                                    }
                                }
                            }
                        }
                    });
                }
            }
        );
    };
}
