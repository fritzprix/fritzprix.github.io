import type { Node } from 'unist';
import { visit } from 'unist-util-visit';

interface DirectiveNode extends Node {
    name: string;
    attributes?: Record<string, unknown>;
    data?: Record<string, unknown> & {
        hName?: string;
        hProperties?: Record<string, unknown>;
    };
}

// Helper function to create HAST nodes safely
const VALID_TAG_NAME_REGEX = /^[a-zA-Z][a-zA-Z0-9_-]*$/;

export default function remarkDirectiveRehype() {
    return (tree: Node) => {
        visit(tree, (node) => {
            if (
                node.type === 'textDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'containerDirective'
            ) {
                const directiveNode = node as unknown as DirectiveNode;
                const data = directiveNode.data || (directiveNode.data = {});

                // Fallback to span/div if directive name is not a valid HTML tag name (e.g. numeric arXiv:2212)
                const isValidTagName = VALID_TAG_NAME_REGEX.test(directiveNode.name);
                const tagName = isValidTagName 
                    ? directiveNode.name 
                    : (node.type === 'textDirective' ? 'span' : 'div');

                const hast = h(tagName, {
                    ...directiveNode.attributes,
                    ...(isValidTagName ? {} : { 'data-directive': directiveNode.name })
                });

                data.hName = hast.tagName;
                data.hProperties = hast.properties;
            }
        });
    };
}

// Helper function to create HAST nodes
function h(name: string, attributes?: Record<string, unknown>) {
    return {
        tagName: name,
        properties: attributes ?? {},
    };
}

