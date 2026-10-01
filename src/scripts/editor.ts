// Editor CodeMirror per i blocchi eseguibili: caricato solo quando serve (import dinamico).
import { EditorView, basicSetup } from "codemirror";
import { Compartment, EditorState, type Extension } from "@codemirror/state";
import { keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { StreamLanguage } from "@codemirror/language";
import { python } from "@codemirror/lang-python";
import { javascript } from "@codemirror/lang-javascript";
import { sql, SQLite } from "@codemirror/lang-sql";
import { csharp } from "@codemirror/legacy-modes/mode/clike";
import { oneDark } from "@codemirror/theme-one-dark";
import type { Language } from "./runners";

export interface CodeEditor {
  getValue(): string;
  setValue(value: string): void;
  focus(): void;
}

function languageSupport(language: Language, tables: Record<string, string[]>): Extension {
  switch (language) {
    case "python":
      return python();
    case "javascript":
      return javascript();
    case "typescript":
      return javascript({ typescript: true });
    case "sql":
      return sql({ dialect: SQLite, schema: tables, upperCaseKeywords: true });
    case "csharp":
      return StreamLanguage.define(csharp);
  }
}

const isDark = () => document.documentElement.classList.contains("dark");

const baseTheme = EditorView.theme({
  "&": { fontSize: "0.875rem" },
  ".cm-scroller": { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace", lineHeight: "1.6" },
  ".cm-content": { padding: "0.75rem 0" },
  "&.cm-focused": { outline: "none" },
});

export function createEditor(
  parent: HTMLElement,
  options: { doc: string; language: Language; onRun: () => void; tables?: Record<string, string[]> },
): CodeEditor {
  const theme = new Compartment();
  const view = new EditorView({
    parent,
    state: EditorState.create({
      doc: options.doc,
      extensions: [
        basicSetup,
        keymap.of([
          { key: "Mod-Enter", run: () => (options.onRun(), true) },
          indentWithTab,
        ]),
        EditorState.tabSize.of(4),
        languageSupport(options.language, options.tables ?? {}),
        baseTheme,
        theme.of(isDark() ? oneDark : []),
      ],
    }),
  });

  // Segue il cambio tema chiaro/scuro del sito
  const onThemeChange = () => {
    if (!view.dom.isConnected) return document.removeEventListener("themechange", onThemeChange);
    view.dispatch({ effects: theme.reconfigure(isDark() ? oneDark : []) });
  };
  document.addEventListener("themechange", onThemeChange);

  return {
    getValue: () => view.state.doc.toString(),
    setValue: (value) => view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } }),
    focus: () => view.focus(),
  };
}
