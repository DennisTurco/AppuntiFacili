import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import mermaid from 'astro-mermaid';
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import remarkCollapse from "remark-collapse"; // https://www.npmjs.com/package/remark-collapse
import remarkToc from 'remark-toc'; // https://github.com/remarkjs/remark-toc#options
import react from '@astrojs/react';
import sitemap from 'astro-sitemap';

export default defineConfig({
  site: "https://appuntifacili.it",
  integrations: [
    react(),
    mdx({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    sitemap({
      filter: (page) => !page.includes('draft'), // opzione per escludere draft
      changefreq: 'weekly',
      priority: 0.7,
    }),
    icon({ include: ["fa6-solid", "fa6-brands"] }),
    mermaid({
      theme: 'forest',
      autoTheme: true,
      mermaidConfig: { flowchart: { curve: 'basis' } },
    }),
  ],
  markdown: {
    remarkPlugins: [
      remarkMath,
      remarkToc,
      [remarkCollapse, { test: "Table of contents" }],
    ],
    rehypePlugins: [rehypeKatex],
    shikiConfig: {
      // For more themes, visit https://shiki.style/themes
      themes: { light: "rose-pine-dawn", dark: "github-dark-dimmed" },
      wrap: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],},
});
