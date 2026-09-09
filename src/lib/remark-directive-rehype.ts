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
                const hast = h(directiveNode.name, directiveNode.attributes);

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

