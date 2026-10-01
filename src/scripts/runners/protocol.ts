// Messaggi scambiati tra la pagina e i Web Worker che eseguono il codice.

export type Language = "python" | "javascript" | "typescript" | "csharp" | "sql";

export interface RunRequest {
  type: "run";
  code: string;
  stdin: string;
  /** Solo SQL: nome del database di esempio (public/files/informatica/database_<db>.sql) */
  db?: string;
}

export interface SchemaRequest {
  type: "schema";
  db?: string;
}

export type WorkerRequest = RunRequest | SchemaRequest;

export interface SqlTable {
  columns: string[];
  rows: unknown[][];
  /** Righe totali (le righe mostrate possono essere troncate) */
  total: number;
}

export interface CompileError {
  line: number;
  column: number;
  id: string;
  message: string;
}

export interface SchemaTable {
  name: string;
  columns: { name: string; type: string; pk: boolean }[];
}

export type WorkerEvent =
  /** Caricamento del runtime (primo avvio) */
  | { type: "status"; text: string }
  /** Il codice dello studente inizia ad essere eseguito: parte il timeout */
  | { type: "started" }
  | { type: "stdout"; text: string }
  | { type: "stderr"; text: string }
  | { type: "image"; src: string }
  | { type: "table"; table: SqlTable }
  | { type: "info"; text: string }
  | { type: "compile-errors"; errors: CompileError[] }
  | { type: "schema"; tables: SchemaTable[] }
  | { type: "done"; ok: boolean };
