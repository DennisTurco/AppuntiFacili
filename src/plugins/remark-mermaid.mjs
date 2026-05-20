import { visit } from 'unist-util-visit';

/**
 * Remark plugin that converts ```mermaid fenced code blocks
 * into <pre class="mermaid"> raw HTML nodes so the client-side
 * mermaid.js library can render them.
 * Works for both .md and .mdx files when added to both
 * markdown.remarkPlugins and mdx({ remarkPlugins: [...] }).
 */
export function remarkMermaid() {
  return function transformer(tree) {
    visit(tree, 'code', (node, index, parent) => {
      if (node.lang !== 'mermaid') return;
      if (!parent || typeof index !== 'number') return;

      // HTML-escape the diagram text so it survives the HTML pipeline
      // (mermaid.js reads textContent, which auto-unescapes entities)
      const escaped = node.value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

      parent.children[index] = {
        type: 'html',
        value: `<pre class="mermaid">${escaped}</pre>`,
      };
    });
  };
}
