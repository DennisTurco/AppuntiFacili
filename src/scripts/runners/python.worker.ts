/// <reference lib="webworker" />
// Esegue codice Python con Pyodide (CPython compilato in WebAssembly).
import type { WorkerEvent, WorkerRequest } from "./protocol";

const PYODIDE_URL = "https://cdn.jsdelivr.net/pyodide/v314.0.7/full/pyodide.mjs";

const post = (event: WorkerEvent) => self.postMessage(event);

// Prepara l'ambiente: input() che legge dal riquadro "Input" e mostra il valore letto,
// come farebbe un terminale.
const SETUP = `
import builtins, sys

def _input(prompt=""):
    sys.stdout.write(str(prompt))
    sys.stdout.flush()
    line = sys.stdin.readline()
    if not line:
        raise EOFError("input() non ha ricevuto dati: scrivili nel riquadro Input")
    line = line.rstrip("\\n")
    print(line)
    return line

builtins.input = _input
`;

// Dopo l'esecuzione: le figure matplotlib diventano immagini PNG
const COLLECT_FIGURES = `
import sys
_figures = []
if "matplotlib.pyplot" in sys.modules:
    import io, base64
    import matplotlib.pyplot as plt
    for num in plt.get_fignums():
        buf = io.BytesIO()
        plt.figure(num).savefig(buf, format="png", bbox_inches="tight")
        _figures.append(base64.b64encode(buf.getvalue()).decode())
    plt.close("all")
_figures
`;

let pyodidePromise: Promise<any> | null = null;
let stdinLines: string[] = [];

function loadRuntime() {
  pyodidePromise ??= (async () => {
    post({ type: "status", text: "Caricamento di Python (solo al primo avvio)…" });
    const { loadPyodide } = await import(/* @vite-ignore */ PYODIDE_URL);
    const pyodide = await loadPyodide({ env: { MPLBACKEND: "AGG" } });

    const decoder = new TextDecoder();
    pyodide.setStdout({ write: (buf: Uint8Array) => (post({ type: "stdout", text: decoder.decode(buf) }), buf.length) });
    pyodide.setStderr({ write: (buf: Uint8Array) => (post({ type: "stderr", text: decoder.decode(buf) }), buf.length) });
    pyodide.setStdin({ stdin: () => stdinLines.shift(), autoEOF: true });
    pyodide.runPython(SETUP);
    return pyodide;
  })();
  return pyodidePromise;
}

/** Toglie dal traceback i frame interni di Pyodide, lasciando solo quelli del programma. */
function cleanTraceback(message: string): string {
  const lines = message.trimEnd().split("\n");
  const first = lines.findIndex((line) => /^\s*File "main\.py"/.test(line));
  if (first === -1) return message.trimEnd() + "\n";
  const head = lines[0].startsWith("Traceback") ? [lines[0]] : [];
  // Toglie anche i frame di SETUP (la nostra input()), che compaiono come File "<exec>"
  const rest = lines.slice(first);
  const body: string[] = [];
  for (let i = 0; i < rest.length; i++) {
    if (/^\s*File "<exec>"/.test(rest[i])) {
      while (rest[i + 1]?.startsWith("    ")) i++;
      continue;
    }
    body.push(rest[i]);
  }
  return [...head, ...body].join("\n") + "\n";
}

async function run(code: string, stdin: string) {
  const pyodide = await loadRuntime();
  stdinLines = stdin ? stdin.replace(/\r\n/g, "\n").split("\n").map((l) => l + "\n") : [];

  try {
    post({ type: "status", text: "Caricamento dei pacchetti…" });
    await pyodide.loadPackagesFromImports(code);
  } catch {
    // un pacchetto sconosciuto darà ModuleNotFoundError durante l'esecuzione
  }

  const globals = pyodide.globals.get("dict")();
  globals.set("__name__", "__main__");
  post({ type: "started" });
  let ok = true;
  try {
    await pyodide.runPythonAsync(code, { globals, filename: "main.py" });
  } catch (err: any) {
    ok = false;
    post({ type: "stderr", text: cleanTraceback(String(err?.message ?? err)) });
  } finally {
    globals.destroy();
    // Svuota il buffer: un prompt di input() senza "a capo" non deve finire nel run successivo
    pyodide.runPython("import sys; sys.stdout.flush(); sys.stderr.flush()");
  }

  try {
    const figures = pyodide.runPython(COLLECT_FIGURES);
    for (const png of figures.toJs()) post({ type: "image", src: `data:image/png;base64,${png}` });
    figures.destroy();
  } catch {
    // nessuna figura
  }
  post({ type: "done", ok });
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  if (e.data.type !== "run") return;
  try {
    await run(e.data.code, e.data.stdin);
  } catch (err: any) {
    post({ type: "stderr", text: `Impossibile avviare Python: ${err?.message ?? err}\n` });
    post({ type: "done", ok: false });
  }
};
