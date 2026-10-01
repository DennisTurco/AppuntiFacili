// Gestisce i Web Worker che eseguono il codice: uno per linguaggio, riutilizzato tra
// le esecuzioni (il runtime si carica una volta sola) e ricreato se va fermato.
import type { Language, WorkerEvent, WorkerRequest } from "./protocol";

export type { Language, WorkerEvent } from "./protocol";

/** Secondi massimi di esecuzione prima di fermare il programma (es. ciclo infinito). */
const TIMEOUT_SECONDS: Record<Language, number> = {
  python: 15,
  javascript: 10,
  typescript: 10,
  sql: 10,
  csharp: 30,
};

export const LANGUAGE_LABEL: Record<Language, string> = {
  python: "Python",
  javascript: "JavaScript",
  typescript: "TypeScript",
  csharp: "C#",
  sql: "SQL (SQLite)",
};

function createWorker(language: Language): Worker {
  // Gli URL devono essere letterali perché Vite riconosca e compili i worker
  switch (language) {
    case "python":
      return new Worker(new URL("./python.worker.ts", import.meta.url), { type: "module" });
    case "javascript":
    case "typescript":
      return new Worker(new URL("./js.worker.ts", import.meta.url), { type: "module" });
    case "sql":
      return new Worker(new URL("./sql.worker.ts", import.meta.url), { type: "module" });
    case "csharp":
      return new Worker(new URL("./csharp.worker.ts", import.meta.url), { type: "module" });
  }
}

// JS/TS usano un worker nuovo ad ogni esecuzione: niente stato globale tra un run e l'altro
const FRESH_EACH_RUN: Language[] = ["javascript", "typescript"];

const workers = new Map<Language, Worker>();
const queues = new Map<Language, Promise<unknown>>();

function getWorker(language: Language): Worker {
  let worker = workers.get(language);
  if (!worker) {
    worker = createWorker(language);
    workers.set(language, worker);
  }
  return worker;
}

function killWorker(language: Language) {
  workers.get(language)?.terminate();
  workers.delete(language);
}

export interface Execution {
  /** Si risolve a fine esecuzione: true se il programma è terminato senza errori */
  done: Promise<boolean>;
  stop(): void;
}

/**
 * Esegue `request` nel worker del linguaggio. Le esecuzioni dello stesso linguaggio
 * sono in coda: un worker esegue un programma alla volta.
 */
export function execute(language: Language, request: WorkerRequest, onEvent: (event: WorkerEvent) => void): Execution {
  let stopRequested = false;
  let stopCurrent: (() => void) | null = null;

  const previous = queues.get(language) ?? Promise.resolve();
  const done = previous.catch(() => {}).then(
    () =>
      new Promise<boolean>((resolve) => {
        if (stopRequested) return resolve(false);
        if (FRESH_EACH_RUN.includes(language)) killWorker(language);
        const worker = getWorker(language);
        let timer: ReturnType<typeof setTimeout> | undefined;

        const finish = (ok: boolean) => {
          clearTimeout(timer);
          worker.removeEventListener("message", onMessage);
          worker.removeEventListener("error", onError);
          stopCurrent = null;
          resolve(ok);
        };

        const abort = (message: string) => {
          killWorker(language);
          if (message) onEvent({ type: "stderr", text: message });
          onEvent({ type: "done", ok: false });
          finish(false);
        };

        const onMessage = (e: MessageEvent<WorkerEvent>) => {
          const event = e.data;
          if (event.type === "started") {
            const seconds = TIMEOUT_SECONDS[language];
            timer = setTimeout(
              () => abort(`\n⏱ Esecuzione interrotta dopo ${seconds} secondi: forse c'è un ciclo infinito?\n`),
              seconds * 1000,
            );
          }
          onEvent(event);
          if (event.type === "done" || event.type === "schema") finish(event.type === "schema" || event.ok);
        };

        const onError = (e: ErrorEvent) => {
          e.preventDefault();
          abort(`Errore interno del runner: ${e.message || "impossibile avviare il worker"}\n`);
        };

        stopCurrent = () => abort("");
        worker.addEventListener("message", onMessage);
        worker.addEventListener("error", onError);
        worker.postMessage(request);
      }),
  );
  queues.set(language, done);

  return {
    done,
    stop() {
      stopRequested = true;
      stopCurrent?.();
    },
  };
}
