/// <reference lib="webworker" />
// Esegue JavaScript / TypeScript. Il TypeScript viene solo "spogliato" dei tipi con
// Sucrase (nessun type-check), poi il codice gira come modulo ES dentro il worker.
import { transform } from "sucrase";
import type { WorkerEvent, WorkerRequest } from "./protocol";

const post = (event: WorkerEvent) => self.postMessage(event);

/** Rappresentazione leggibile di un valore, simile a quella di console.log in Node. */
function inspect(value: unknown, depth = 0, seen = new WeakSet<object>()): string {
  if (typeof value === "string") return depth === 0 ? value : JSON.stringify(value);
  if (typeof value === "bigint") return `${value}n`;
  if (typeof value === "symbol") return value.toString();
  if (typeof value === "function") return value.toString().startsWith("class") ? `[class ${value.name}]` : `[Function: ${value.name || "(anonymous)"}]`;
  if (value === null || typeof value !== "object") return String(value);
  if (value instanceof Error) return value.stack && depth === 0 ? `${value.name}: ${value.message}` : `[${value.name}: ${value.message}]`;
  if (value instanceof Date) return value.toISOString();
  if (value instanceof RegExp) return value.toString();
  if (seen.has(value)) return "[Circular]";
  if (depth > 3) return Array.isArray(value) ? "[Array]" : "[Object]";
  seen.add(value);

  const inner = (v: unknown) => inspect(v, depth + 1, seen);
  let result: string;
  if (Array.isArray(value)) {
    result = `[ ${value.map(inner).join(", ")} ]`;
    if (value.length === 0) result = "[]";
  } else if (value instanceof Map) {
    result = `Map(${value.size}) { ${[...value].map(([k, v]) => `${inner(k)} => ${inner(v)}`).join(", ")} }`;
  } else if (value instanceof Set) {
    result = `Set(${value.size}) { ${[...value].map(inner).join(", ")} }`;
  } else if (value instanceof Promise) {
    result = "Promise { <pending> }";
  } else {
    const name = value.constructor && value.constructor !== Object ? `${value.constructor.name} ` : "";
    const entries = Object.entries(value).map(([k, v]) => `${/^[A-Za-z_$][\w$]*$/.test(k) ? k : JSON.stringify(k)}: ${inner(v)}`);
    result = entries.length ? `${name}{ ${entries.join(", ")} }` : `${name}{}`;
  }
  seen.delete(value);
  return result;
}

function format(args: unknown[]): string {
  // Supporta i segnaposto più comuni: console.log("%s ha %d anni", nome, eta)
  if (typeof args[0] === "string" && /%[sdifoO]/.test(args[0])) {
    let i = 1;
    const head = args[0].replace(/%[sdifoO%]/g, (m) => {
      if (m === "%%") return "%";
      if (i >= args.length) return m;
      const v = args[i++];
      return m === "%d" || m === "%i" ? String(parseInt(String(v))) : m === "%f" ? String(Number(v)) : inspect(v, 1);
    });
    args = [head, ...args.slice(i)];
  }
  return args.map((a) => inspect(a)).join(" ") + "\n";
}

// In dev il client di Vite scrive "[vite] connected." anche nei worker
const isViteLog = (args: unknown[]) => import.meta.env.DEV && typeof args[0] === "string" && args[0].startsWith("[vite]");
const out = (...args: unknown[]) => isViteLog(args) || post({ type: "stdout", text: format(args) });
const err = (...args: unknown[]) => post({ type: "stderr", text: format(args) });
const counts = new Map<string, number>();
const timers = new Map<string, number>();

Object.assign(self.console, {
  log: out,
  info: out,
  debug: out,
  warn: err,
  error: err,
  table: (data: unknown) => out(data),
  count: (label = "default") => {
    counts.set(label, (counts.get(label) ?? 0) + 1);
    out(`${label}: ${counts.get(label)}`);
  },
  time: (label = "default") => void timers.set(label, performance.now()),
  timeEnd: (label = "default") => out(`${label}: ${(performance.now() - (timers.get(label) ?? 0)).toFixed(3)}ms`),
  assert: (condition: unknown, ...args: unknown[]) => {
    if (!condition) err("Assertion failed", ...args);
  },
});

self.addEventListener("unhandledrejection", (e) => {
  err("Uncaught (in promise)", e.reason);
});

// prompt() non esiste nei worker: legge le righe del riquadro "Input"
let stdinLines: string[] = [];
(self as any).prompt = (message = "") => {
  const line = stdinLines.shift() ?? null;
  post({ type: "stdout", text: `${message}${line ?? ""}\n` });
  return line;
};

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const request = e.data;
  if (request.type !== "run") return;
  stdinLines = request.stdin ? request.stdin.replace(/\r\n/g, "\n").split("\n") : [];

  let source = request.code;
  try {
    // Sucrase toglie i tipi; anche il JS passa da qui così gli errori di sintassi sono uniformi
    source = transform(source, { transforms: ["typescript"], disableESTransforms: true, filePath: "main.ts" }).code;
  } catch (error: any) {
    err(`SyntaxError: ${error.message}`);
    post({ type: "done", ok: false });
    return;
  }

  const url = URL.createObjectURL(new Blob([source], { type: "text/javascript" }));
  post({ type: "started" });
  try {
    await import(/* @vite-ignore */ url);
    post({ type: "done", ok: true });
  } catch (error: any) {
    err(error instanceof Error ? `${error.name}: ${error.message}` : error);
    post({ type: "done", ok: false });
  } finally {
    URL.revokeObjectURL(url);
  }
};
