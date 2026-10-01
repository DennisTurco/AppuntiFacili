import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from '@astrojs/sitemap';
import icon from "astro-icon";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkCollapse from "remark-collapse"; // https://www.npmjs.com/package/remark-collapse
import remarkToc from 'remark-toc'; // https://github.com/remarkjs/remark-toc#options
import react from '@astrojs/react';
import partytown from '@astrojs/partytown'
import { remarkMermaid } from './src/plugins/remark-mermaid.mjs';
import { remarkRunnable } from './src/plugins/remark-runnable.mjs';

export default defineConfig({
  site: "https://appuntifacili.it",
  integrations: [
    react(),
    mdx({
      // extendMarkdownConfig is true by default, but we add remarkMermaid
      // explicitly here so it also runs for .mdx files.
      remarkPlugins: [remarkMath, remarkMermaid, remarkRunnable],
      rehypePlugins: [rehypeKatex],
    }),
    sitemap({
      filter: (page) => !page.includes('draft'), // opzione per escludere draft
      changefreq: 'weekly',
      priority: 0.7,
    }),
    partytown({ // for google analytics
        config: {
          forward: ["dataLayer.push"],
        },
    }),
    icon({ include: ["fa6-solid", "fa6-brands"] }),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
      remarkMermaid,
      remarkRunnable,
    ],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "rose-pine-dawn", dark: "github-dark-dimmed" },
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
    // Dipendenze dei blocchi eseguibili (caricate solo su richiesta): pre-ottimizzate
    // così in dev Vite non ricarica la pagina la prima volta che servono
    optimizeDeps: {
      include: [
        "sucrase",
        "sql.js",
        "codemirror",
        "@codemirror/state",
        "@codemirror/view",
        "@codemirror/commands",
        "@codemirror/language",
        "@codemirror/lang-python",
        "@codemirror/lang-javascript",
        "@codemirror/lang-sql",
        "@codemirror/legacy-modes/mode/clike",
        "@codemirror/theme-one-dark",
      ],
    },
  },
});
