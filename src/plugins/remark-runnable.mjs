import { visit } from 'unist-util-visit';

/**
 * Remark plugin che rende eseguibili i blocchi di codice.
 *
 * Un blocco diventa eseguibile se ha `run` nel meta:
 *
 *   ```python run
 *   ```sql run db=scuola
 *   ```csharp run stdin="Mario\n42"
 *
 * Nelle lezioni di informatica tutti i blocchi dei linguaggi supportati sono
 * eseguibili per default: `norun` esclude un singolo blocco, `runnable: false`
 * nel frontmatter li disattiva per tutta la lezione (`runnable: true` li attiva
 * in qualunque altra pagina).
 *
 * Il blocco resta un normale blocco evidenziato da Shiki: il plugin inserisce
 * subito prima un marker <div data-runnable> che lo script client
 * (src/scripts/playground.ts) usa per aggiungere i pulsanti Esegui/Modifica.
 */

const LANGUAGES = {
  python: 'python',
  py: 'python',
  javascript: 'javascript',
  js: 'javascript',
  typescript: 'typescript',
  ts: 'typescript',
  csharp: 'csharp',
  cs: 'csharp',
  'c#': 'csharp',
  sql: 'sql',
  sqlite: 'sql',
};

/** Legge `run db=scuola stdin="a b"` in { run: true, db: 'scuola', stdin: 'a b' }. */
function parseMeta(meta) {
  const options = {};
  if (!meta) return options;
  const re = /([\w-]+)(?:=(?:"((?:[^"\\]|\\.)*)"|(\S+)))?/g;
  let match;
  while ((match = re.exec(meta))) {
    const [, key, quoted, plain] = match;
    options[key] = quoted !== undefined ? quoted.replace(/\\n/g, '\n').replace(/\\(.)/g, '$1') : plain ?? true;
  }
  return options;
}

const escapeAttr = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/\n/g, '&#10;');

export function remarkRunnable() {
  return function transformer(tree, file) {
    const frontmatter = file.data?.astro?.frontmatter ?? {};
    const path = String(file.path ?? file.history?.[0] ?? '').replace(/\\/g, '/');
    const runAll = frontmatter.runnable ?? path.includes('/content/informatica/');

    visit(tree, 'code', (node, index, parent) => {
      if (!parent || typeof index !== 'number') return;
      const lang = LANGUAGES[(node.lang ?? '').toLowerCase()];
      if (!lang) return;

      const options = parseMeta(node.meta);
      if (options.norun || !(options.run || runAll)) return;

      // Per i .mdx il plugin può girare due volte (config markdown + mdx)
      const prev = parent.children[index - 1];
      if (prev?.type === 'html' && prev.value.includes('runnable-marker')) return;

      const attrs = [`data-runnable="${lang}"`];
      if (typeof options.db === 'string') attrs.push(`data-db="${escapeAttr(options.db)}"`);
      if (typeof options.stdin === 'string') attrs.push(`data-stdin="${escapeAttr(options.stdin)}"`);

      parent.children.splice(index, 0, {
        type: 'html',
        value: `<div class="runnable-marker" ${attrs.join(' ')} hidden></div>`,
      });
      return index + 2; // salta il marker e il blocco appena processato
    });
  };
}
