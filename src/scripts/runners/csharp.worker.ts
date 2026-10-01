/// <reference lib="webworker" />
// Esegue codice C#: il runtime .NET (WebAssembly) e il compilatore Roslyn vengono
// caricati da /runners/csharp (vedi tools/csharp-runner e `pnpm build:csharp`).
import type { CompileError, WorkerEvent, WorkerRequest } from "./protocol";

const FRAMEWORK_URL = "/runners/csharp/_framework/";

const post = (event: WorkerEvent) => self.postMessage(event);

interface RunnerExports {
  GetReferenceNames(): string[];
  AddReference(name: string, image: Uint8Array): void;
  Run(code: string, stdin: string): Promise<string>;
}

let runnerPromise: Promise<RunnerExports> | null = null;

function loadRuntime() {
  runnerPromise ??= (async () => {
    post({ type: "status", text: "Caricamento di .NET e del compilatore C# (solo al primo avvio, ~11 MB)…" });
    // Senza questo flag dotnet.js, dentro un Web Worker, si comporta da thread secondario
    // di un runtime multithread e resta in attesa per sempre
    (globalThis as any).dotnetSidecar = true;
    const { dotnet } = await import(/* @vite-ignore */ `${FRAMEWORK_URL}dotnet.js`);
    const runtime = await dotnet.create();
    runtime.setModuleImports("runner", {
      write: (text: string, isError: boolean) => post({ type: isError ? "stderr" : "stdout", text }),
    });
    const exports = await runtime.getAssemblyExports("CSharpRunner.dll");
    const runner: RunnerExports = exports.Runner;

    post({ type: "status", text: "Preparazione del compilatore…" });
    const names = runner.GetReferenceNames();
    const images = await Promise.all(
      names.map(async (name) => {
        const response = await fetch(`${FRAMEWORK_URL}${name}.dll`);
        if (!response.ok) throw new Error(`Riferimento mancante: ${name}.dll`);
        return new Uint8Array(await response.arrayBuffer());
      }),
    );
    names.forEach((name, i) => runner.AddReference(name, images[i]));
    return runner;
  })();
  runnerPromise.catch(() => (runnerPromise = null));
  return runnerPromise;
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const request = e.data;
  if (request.type !== "run") return;
  try {
    const runner = await loadRuntime();
    post({ type: "status", text: "Compilazione…" });
    // il timeout parte qui: la prima compilazione (JIT di Roslyn) può essere lenta
    post({ type: "started" });
    const result = JSON.parse(await runner.Run(request.code, request.stdin)) as {
      compiled: boolean;
      errors: CompileError[];
      exitCode: number | null;
      libraryOnly: boolean;
    };
    if (!result.compiled) {
      post({ type: "compile-errors", errors: result.errors });
      post({ type: "done", ok: false });
      return;
    }
    if (result.libraryOnly) {
      post({
        type: "info",
        text: "✓ Compilato senza errori. Non c'è niente da eseguire: aggiungi delle istruzioni (ad esempio Console.WriteLine) per vedere un output.",
      });
    }
    post({ type: "done", ok: result.exitCode === 0 });
  } catch (error: any) {
    post({ type: "stderr", text: `Impossibile eseguire il codice C#: ${error?.message ?? error}\n` });
    post({ type: "done", ok: false });
  }
};
