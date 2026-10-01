// Blocchi di codice eseguibili: aggiunge Esegui / Modifica / Input ai blocchi preceduti
// da un marker <div data-runnable> (vedi src/plugins/remark-runnable.mjs e Playground.astro).
import { execute, LANGUAGE_LABEL, type Execution, type Language, type WorkerEvent } from "./runners";
import type { CodeEditor } from "./editor";
import type { SchemaTable, SqlTable } from "./runners/protocol";

const ICON_PLAY = `<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M4 2.5v11l9-5.5z"/></svg>`;
const ICON_STOP = `<svg viewBox="0 0 16 16" aria-hidden="true"><rect fill="currentColor" x="3.5" y="3.5" width="9" height="9" rx="1"/></svg>`;

const READS_INPUT: Partial<Record<Language, RegExp>> = {
  python: /input\s*\(/,
  csharp: /Console\.Read(Line|Key)?\s*\(/,
  javascript: /prompt\s*\(/,
  typescript: /prompt\s*\(/,
};

const isMac = typeof navigator !== "undefined" && /Mac|iPhone|iPad/.test(navigator.platform);

function el<K extends keyof HTMLElementTagNameMap>(tag: K, className?: string, text?: string) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function button(label: string, action: string, extra = "") {
  const b = el("button", `runnable-btn ${extra}`.trim());
  b.type = "button";
  b.dataset.action = action;
  b.innerHTML = label;
  return b;
}

function renderTable(table: SqlTable): HTMLElement {
  const wrap = el("div", "runnable-table-wrap");
  const t = el("table", "runnable-table");
  const head = t.createTHead().insertRow();
  for (const column of table.columns) head.appendChild(el("th", undefined, column));
  const body = t.createTBody();
  for (const row of table.rows) {
    const tr = body.insertRow();
    for (const value of row) {
      const td = tr.insertCell();
      if (value === null) {
        td.textContent = "NULL";
        td.className = "is-null";
      } else {
        td.textContent = value instanceof Uint8Array ? `<blob ${value.length} byte>` : String(value);
      }
    }
  }
  wrap.appendChild(t);
  const caption = table.total === 1 ? "1 riga" : `${table.total} righe`;
  const note = table.total > table.rows.length ? ` (mostrate le prime ${table.rows.length})` : "";
  wrap.appendChild(el("p", "runnable-table-caption", caption + note));
  if (table.rows.length === 0) wrap.querySelector("tbody")!.innerHTML = `<tr><td colspan="${table.columns.length}" class="is-null">Nessun risultato</td></tr>`;
  return wrap;
}

class Runnable {
  private readonly language: Language;
  private readonly original: string;
  private readonly db?: string;
  private readonly root: HTMLElement;
  private readonly codeArea: HTMLElement;
  private readonly staticBlock: HTMLElement;
  private readonly output: HTMLElement;
  private readonly outputBody: HTMLElement;
  private readonly stdinBox: HTMLElement;
  private readonly stdin: HTMLTextAreaElement;
  private readonly runBtn: HTMLButtonElement;
  private readonly stopBtn: HTMLButtonElement;
  private readonly editBtn: HTMLButtonElement;
  private readonly resetBtn: HTMLButtonElement;
  private editor: CodeEditor | null = null;
  private execution: Execution | null = null;
  private stopped = false;
  private tables: SchemaTable[] = [];
  private lastStream: { kind: "stdout" | "stderr"; node: HTMLElement } | null = null;

  constructor(marker: HTMLElement, block: HTMLElement) {
    this.language = marker.dataset.runnable as Language;
    this.db = marker.dataset.db || undefined;
    this.original = (block.querySelector("code")?.textContent ?? "").replace(/\n$/, "");
    this.staticBlock = block;

    this.root = el("div", "runnable not-prose");
    this.root.dataset.lang = this.language;

    // Barra degli strumenti
    const toolbar = el("div", "runnable-toolbar");
    const label = el("span", "runnable-lang", LANGUAGE_LABEL[this.language]);
    if (this.db) label.append(el("span", "runnable-db", `database: ${this.db}`));
    const actions = el("div", "runnable-actions");
    this.editBtn = button("Modifica", "edit");
    this.resetBtn = button("Ripristina", "reset");
    this.resetBtn.hidden = true;
    const stdinBtn = button("Input", "stdin");
    stdinBtn.title = "Valori letti dal programma (input, Console.ReadLine, prompt)";
    this.runBtn = button(`${ICON_PLAY}<span>Esegui</span>`, "run", "is-primary");
    this.runBtn.title = `Esegui (${isMac ? "⌘" : "Ctrl"}+Invio nell'editor)`;
    this.stopBtn = button(`${ICON_STOP}<span>Stop</span>`, "stop", "is-danger");
    this.stopBtn.hidden = true;
    if (this.language !== "sql") actions.append(stdinBtn);
    actions.append(this.editBtn, this.resetBtn, this.runBtn, this.stopBtn);
    toolbar.append(label, actions);

    // Codice: il blocco statico (evidenziato da Shiki) finché non si clicca "Modifica"
    this.codeArea = el("div", "runnable-code");

    // Input
    this.stdinBox = el("div", "runnable-stdin");
    this.stdinBox.hidden = true;
    const stdinLabel = el("label", undefined, "Input del programma: una riga per ogni lettura");
    this.stdin = el("textarea");
    this.stdin.rows = 3;
    this.stdin.spellcheck = false;
    this.stdin.value = marker.dataset.stdin ?? "";
    stdinLabel.appendChild(this.stdin);
    this.stdinBox.appendChild(stdinLabel);
    // Il riquadro Input si apre da solo se il programma legge dati dall'utente
    if (this.stdin.value || READS_INPUT[this.language]?.test(this.original)) this.stdinBox.hidden = false;

    // Output
    this.output = el("div", "runnable-output");
    this.output.hidden = true;
    this.output.setAttribute("aria-live", "polite");
    const outputHead = el("div", "runnable-output-head");
    outputHead.append(el("span", undefined, "Output"));
    const clear = button("Pulisci", "clear", "is-small");
    outputHead.append(clear);
    this.outputBody = el("div", "runnable-output-body");
    this.output.append(outputHead, this.outputBody);

    block.replaceWith(this.root);
    this.codeArea.appendChild(block);
    this.root.append(toolbar);
    if (marker.dataset.schema !== undefined && this.language === "sql") this.root.append(this.createSchemaPanel());
    this.root.append(this.codeArea, this.stdinBox, this.output);

    this.root.addEventListener("click", (e) => {
      const action = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-action]")?.dataset.action;
      if (action === "run") this.run();
      else if (action === "stop") {
        this.stopped = true;
        this.execution?.stop();
      }
      else if (action === "edit") this.openEditor(true);
      else if (action === "reset") this.editor?.setValue(this.original);
      else if (action === "stdin") {
        this.stdinBox.hidden = !this.stdinBox.hidden;
        if (!this.stdinBox.hidden) this.stdin.focus();
      } else if (action === "clear") {
        this.outputBody.replaceChildren();
        this.output.hidden = true;
      }
    });

    if (marker.dataset.editable !== undefined) this.openEditor(false);
  }

  private get code() {
    return this.editor ? this.editor.getValue() : this.original;
  }

  private async openEditor(focus: boolean) {
    if (this.editor) return;
    this.editBtn.disabled = true;
    const { createEditor } = await import("./editor");
    const host = el("div", "runnable-editor");
    const tables = Object.fromEntries(this.tables.map((t) => [t.name, t.columns.map((c) => c.name)]));
    this.editor = createEditor(host, { doc: this.original, language: this.language, onRun: () => this.run(), tables });
    // Il pulsante "Copia" può aver avvolto il <pre> in un .code-wrapper: si sostituisce tutto
    const wrapper = this.staticBlock.parentElement;
    (wrapper?.classList.contains("code-wrapper") ? wrapper : this.staticBlock).replaceWith(host);
    this.editBtn.hidden = true;
    this.resetBtn.hidden = false;
    if (focus) this.editor.focus();
  }

  private createSchemaPanel(): HTMLElement {
    const panel = el("div", "runnable-schema");
    panel.append(el("p", "runnable-schema-title", "Tabelle del database (clicca per vederne il contenuto)"));
    const list = el("div", "runnable-schema-list");
    list.append(el("span", "runnable-muted", "Caricamento…"));
    panel.append(list);

    execute("sql", { type: "schema", db: this.db }, (event) => {
      if (event.type !== "schema") return;
      this.tables = event.tables;
      list.replaceChildren(
        ...event.tables.map((table) => {
          const item = el("details", "runnable-schema-table");
          const summary = el("summary");
          const show = button(table.name, "noop", "is-small is-table");
          show.title = `SELECT * FROM ${table.name}`;
          show.addEventListener("click", async (e) => {
            e.preventDefault();
            await this.openEditor(false);
            this.editor!.setValue(`SELECT *\nFROM ${table.name};`);
            this.run();
          });
          summary.append(show, el("span", "runnable-muted", `${table.columns.length} colonne`));
          const columns = el("ul");
          for (const column of table.columns) {
            const li = el("li", undefined, column.name);
            if (column.type) li.append(el("span", "runnable-muted", ` ${column.type}`));
            if (column.pk) li.append(el("span", "runnable-pk", " PK"));
            columns.append(li);
          }
          item.append(summary, columns);
          return item;
        }),
      );
    });
    return panel;
  }

  private write(kind: "stdout" | "stderr", text: string) {
    if (this.lastStream?.kind !== kind) {
      const node = el("pre", `runnable-stream is-${kind}`);
      this.outputBody.append(node);
      this.lastStream = { kind, node };
    }
    this.lastStream.node.textContent += text;
  }

  private append(node: HTMLElement) {
    this.outputBody.append(node);
    this.lastStream = null;
  }

  private handle(event: WorkerEvent, status: HTMLElement) {
    switch (event.type) {
      case "status":
        status.textContent = event.text;
        status.hidden = false;
        break;
      case "started":
        status.hidden = true;
        break;
      case "stdout":
      case "stderr":
        status.hidden = true;
        this.write(event.type, event.text);
        break;
      case "image": {
        const img = el("img", "runnable-image");
        img.src = event.src;
        img.alt = "Grafico prodotto dal programma";
        this.append(img);
        break;
      }
      case "table":
        this.append(renderTable(event.table));
        break;
      case "info":
        this.append(el("p", "runnable-info", event.text));
        break;
      case "compile-errors": {
        status.hidden = true;
        const box = el("div", "runnable-errors");
        box.append(el("p", "runnable-errors-title", event.errors.length === 1 ? "1 errore di compilazione" : `${event.errors.length} errori di compilazione`));
        const list = el("ul");
        for (const error of event.errors) {
          const li = el("li");
          li.append(el("span", "runnable-errors-pos", `riga ${error.line}, col ${error.column}`), ` ${error.message} `, el("code", undefined, error.id));
          list.append(li);
        }
        box.append(list);
        this.append(box);
        break;
      }
    }
  }

  async run() {
    if (this.execution) return;
    this.output.hidden = false;
    this.outputBody.replaceChildren();
    this.lastStream = null;
    const status = el("p", "runnable-status", "Avvio…");
    this.outputBody.append(status);

    this.stopped = false;
    this.runBtn.hidden = true;
    this.stopBtn.hidden = false;
    this.root.dataset.running = "";
    const started = performance.now();

    this.execution = execute(
      this.language,
      { type: "run", code: this.code, stdin: this.stdin.value, db: this.db },
      (event) => this.handle(event, status),
    );
    const ok = await this.execution.done;
    this.execution = null;

    status.remove();
    const seconds = ((performance.now() - started) / 1000).toFixed(2);
    if (!this.outputBody.childElementCount) this.append(el("p", "runnable-muted", "(nessun output)"));
    const result = ok ? `✓ Completato in ${seconds} s` : this.stopped ? "■ Interrotto" : "✗ Terminato con errori";
    this.append(el("p", `runnable-result ${ok ? "is-ok" : "is-error"}`, result));

    this.runBtn.hidden = false;
    this.stopBtn.hidden = true;
    delete this.root.dataset.running;
  }
}

/** Blocco di codice associato al marker: il <pre> stesso o il wrapper del pulsante "Copia". */
function findBlock(marker: HTMLElement): HTMLElement | null {
  const next = marker.nextElementSibling as HTMLElement | null;
  if (!next) return null;
  if (next.tagName === "PRE") return next;
  if (next.classList.contains("code-wrapper") || next.querySelector(":scope > pre")) return next;
  return null;
}

function enhance() {
  for (const marker of document.querySelectorAll<HTMLElement>("[data-runnable]:not([data-enhanced])")) {
    const block = findBlock(marker);
    if (!block) continue;
    marker.dataset.enhanced = "";
    new Runnable(marker, block);
  }
}

document.addEventListener("astro:page-load", enhance);
