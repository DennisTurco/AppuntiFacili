/// <reference lib="webworker" />
// Esegue query SQL con sql.js (SQLite compilato in WebAssembly).
// Ogni esecuzione parte da un database "pulito": i database di esempio vengono
// ricaricati, così DELETE/UPDATE di prova non lasciano tracce.
import initSqlJs, { type Database, type SqlJsStatic } from "sql.js";
import wasmUrl from "sql.js/dist/sql-wasm.wasm?url";
import type { SchemaTable, WorkerEvent, WorkerRequest } from "./protocol";

const MAX_ROWS = 500;

const post = (event: WorkerEvent) => self.postMessage(event);

let sqlPromise: Promise<SqlJsStatic> | null = null;
const datasets = new Map<string, Promise<string>>();

const loadSql = () => (sqlPromise ??= initSqlJs({ locateFile: () => wasmUrl }));

/**
 * I file .sql del sito sono scritti per MySQL: si tolgono le istruzioni che SQLite
 * non capisce (CREATE DATABASE, USE, ALTER TABLE ... ADD, opzioni ENGINE, ecc.).
 */
function toSqlite(script: string): string {
  return script
    .replace(/\/\*![\s\S]*?\*\/\s*;?/g, "")
    .replace(/^\s*(CREATE\s+DATABASE|USE|SET|START\s+TRANSACTION|COMMIT|LOCK\s+TABLES|UNLOCK\s+TABLES)\b[^\n]*$/gim, "")
    .replace(/ALTER\s+TABLE\s+[^;]+;/gi, "")
    .replace(/\)\s*ENGINE\s*=[^;]*;/gi, ");")
    .replace(/\bAUTO_INCREMENT\b(\s*=\s*\d+)?/gi, "")
    .replace(/\bUNSIGNED\b/gi, "");
}

function loadDataset(name: string): Promise<string> {
  if (!/^[\w-]+$/.test(name)) return Promise.reject(new Error(`Nome di database non valido: ${name}`));
  let promise = datasets.get(name);
  if (!promise) {
    promise = fetch(`/files/informatica/database_${name}.sql`).then((r) => {
      if (!r.ok) throw new Error(`Database "${name}" non trovato`);
      return r.text().then(toSqlite);
    });
    datasets.set(name, promise);
  }
  return promise;
}

async function openDatabase(db?: string): Promise<Database> {
  const SQL = await loadSql();
  const database = new SQL.Database();
  database.run("PRAGMA foreign_keys = ON;");
  if (db) database.exec(await loadDataset(db));
  return database;
}

function readSchema(database: Database): SchemaTable[] {
  const [result] = database.exec("SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name");
  const names = (result?.values ?? []).map(([name]) => String(name));
  return names.map((name) => {
    const [info] = database.exec(`PRAGMA table_info("${name.replace(/"/g, '""')}")`);
    return {
      name,
      columns: (info?.values ?? []).map((row) => ({ name: String(row[1]), type: String(row[2] ?? ""), pk: Number(row[5]) > 0 })),
    };
  });
}

async function run(code: string, db?: string) {
  post({ type: "status", text: "Caricamento di SQLite…" });
  const database = await openDatabase(db);
  post({ type: "started" });
  let ok = true;
  try {
    let executed = 0;
    for (const statement of database.iterateStatements(code)) {
      executed++;
      const columns = statement.getColumnNames();
      if (columns.length === 0) {
        statement.step();
        const changed = database.getRowsModified();
        const kind = (statement.getSQL().trim().split(/\s+/)[0] ?? "").toUpperCase();
        post({ type: "info", text: ["INSERT", "UPDATE", "DELETE", "REPLACE"].includes(kind) ? `${kind}: ${changed} ${changed === 1 ? "riga modificata" : "righe modificate"}` : `${kind || "Istruzione"} eseguita` });
        statement.free();
        continue;
      }
      const rows: unknown[][] = [];
      let total = 0;
      while (statement.step()) {
        total++;
        if (rows.length < MAX_ROWS) rows.push(statement.get());
      }
      statement.free();
      post({ type: "table", table: { columns, rows, total } });
    }
    if (executed === 0) post({ type: "info", text: "Nessuna istruzione da eseguire" });
  } catch (error: any) {
    ok = false;
    post({ type: "stderr", text: `Errore: ${error?.message ?? error}\n` });
  } finally {
    database.close();
  }
  post({ type: "done", ok });
}

self.onmessage = async (e: MessageEvent<WorkerRequest>) => {
  const request = e.data;
  try {
    if (request.type === "schema") {
      const database = await openDatabase(request.db);
      post({ type: "schema", tables: readSchema(database) });
      database.close();
    } else {
      await run(request.code, request.db);
    }
  } catch (error: any) {
    post({ type: "stderr", text: `Errore: ${error?.message ?? error}\n` });
    post({ type: "done", ok: false });
  }
};
