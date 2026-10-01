### Commands

- `npm run dev`: run the project;
- `npm run build`: to build the project (generate also the sitemaps)
- `pnpm install --no-frozen-lockfile`: to update pnpm-lock file

- To check for the sitemap:
  1. Build the project
  2. `npm run preview`
  3. go to site: [localhost](http://localhost:4321/sitemap-index.xml)

- `pnpm build:csharp`: rebuild the C# runner (needs the .NET 10 SDK) into `public/runners/csharp`; the output is committed because the Vercel build has no .NET
- `pnpm search:dev`: build the site and create the search index in `public/pagefind`, so search also works with `npm run dev`

### Interactive lessons

**Runnable code blocks** (Python, JavaScript, TypeScript, C#, SQL): code runs in the browser, inside a Web Worker.

````md
```python run
print("ciao")
```

```csharp run stdin="Mario\n42"
var nome = Console.ReadLine();
```

```sql run db=scuola
SELECT * FROM Studente;
```
````

- In Informatica lessons every block of a supported language is runnable by default: `norun` excludes a single block, `runnable: false` in the frontmatter disables the whole lesson (`runnable: true` enables it on any other page).
- `db=` loads one of the databases in `public/files/informatica/database_<name>.sql` (`scuola`, `vaccari`, `viaggi`).
- Standalone editor: `<Playground lang="sql" db="scuola" schema code="SELECT * FROM Scuola;" />` (no import needed).

**Quizzes**: `<Quiz>` now explains answers, shuffles them and has "Riprova". `<CodeQuiz>` (no import, no `client:load`) adds highlighted code and two new question types:

```jsx
<CodeQuiz questions={[
  { type: "output", question: "Cosa stampa?", lang: "python", code: `print(2 ** 3)`, expected: "8" },
  { type: "bug", question: "Trova il bug", lang: "python", code: `...`, bugLine: 2, fix: `...`, explanation: "..." },
  { question: "...", answers: { a: "...", b: "..." }, correctAnswer: "a", explanation: "..." },
]} />
```

**Search**: Pagefind indexes lessons and blog posts (not drafts) after `astro build`. Use `data-pagefind-ignore` to exclude parts of a page.
