import { visit } from 'unist-util-visit';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function remarkDirectiveRehype() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (tree: any) => {
        visit(tree, (node) => {
            if (
                node.type === 'textDirective' ||
                node.type === 'leafDirective' ||
                node.type === 'containerDirective'
            ) {
                const data = node.data || (node.data = {});
                const hast = h(node.name, node.attributes);

                data.hName = hast.tagName;
                data.hProperties = hast.properties;
            }
        });
    };
}

// Helper function to create HAST nodes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function h(name: string, attributes: any) {
    return {
        tagName: name,
        properties: attributes,
    };
}
