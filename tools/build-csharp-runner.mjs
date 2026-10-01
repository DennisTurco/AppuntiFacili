// Compila il runner C# (tools/csharp-runner) e copia il risultato in public/runners/csharp.
// Richiede l'SDK .NET 10. L'output viene committato: la build del sito (Vercel) non ha .NET.
//
//   pnpm build:csharp

import { execSync } from "node:child_process";
import { cpSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const project = join(root, "tools", "csharp-runner");
const target = join(root, "public", "runners", "csharp");
const out = mkdtempSync(join(tmpdir(), "csharp-runner-"));

try {
  execSync(`dotnet publish -c Release -o "${out}"`, { cwd: project, stdio: "inherit" });
  rmSync(target, { recursive: true, force: true });
  cpSync(join(out, "wwwroot", "_framework"), join(target, "_framework"), { recursive: true });
  console.log(`\nRunner C# copiato in ${target}`);
} finally {
  rmSync(out, { recursive: true, force: true });
}
