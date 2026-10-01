import React, { useEffect, useMemo, useRef, useState } from 'react';

/*
  Quiz di fine lezione. Ogni domanda può essere di tre tipi:

  - "choice" (default): risposta multipla
      { question, answers: { a: "...", b: "..." }, correctAnswer: "b" }
  - "output": "Cosa stampa?" con risposta scritta, confrontata riga per riga
      { type: "output", question, code, lang, expected: "1\n2\n3" }
  - "bug": "Trova il bug", si clicca la riga sbagliata (numero di riga a partire da 1)
      { type: "bug", question, code, lang, bugLine: 3, fix: "codice corretto" }

  Campi opzionali per tutte: `code` + `lang` (blocco di codice mostrato sotto la domanda),
  `explanation` (mostrata dopo la verifica). Nel testo si può usare `codice inline` e **grassetto**.

  Per avere il codice evidenziato usare <CodeQuiz> (CodeQuiz.astro), che prepara
  l'HTML con Shiki in fase di build e poi usa questo componente.
*/

// Le risposte che si riferiscono alle altre ("Tutti i precedenti") restano in fondo
const PINNED_ANSWER = /precedent|sopra/i;

function shuffled(items) {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function answerOrder(q, shuffle) {
  const keys = Object.keys(q.answers ?? {});
  if (!shuffle) return keys;
  const pinned = keys.filter((k) => PINNED_ANSWER.test(String(q.answers[k])));
  return [...shuffled(keys.filter((k) => !pinned.includes(k))), ...pinned];
}

const normalizeOutput = (text) =>
  String(text ?? '')
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trimEnd())
    .join('\n')
    .replace(/^\n+|\n+$/g, '');

const bugLines = (q) => (Array.isArray(q.bugLine) ? q.bugLine : [q.bugLine]);

function isCorrect(q, answer) {
  if (answer === undefined || answer === null || answer === '') return false;
  switch (q.type ?? 'choice') {
    case 'output':
      return normalizeOutput(answer) === normalizeOutput(q.expected);
    case 'bug':
      return bugLines(q).includes(answer);
    default:
      return answer === q.correctAnswer;
  }
}

/** Testo con `codice inline` e **grassetto**. */
function Rich({ text }) {
  const parts = String(text ?? '').split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="rounded bg-slate-100 px-1 py-0.5 font-mono text-[0.9em] text-slate-800 dark:bg-slate-800 dark:text-slate-200">
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.length > 4 && part.startsWith('**') && part.endsWith('**')) return <strong key={i}>{part.slice(2, -2)}</strong>;
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

/**
 * Blocco di codice della domanda. Con `selectable` le righe diventano cliccabili
 * (domande "Trova il bug").
 */
function CodeBlock({ code, html, selectable, selected, correctLines, checked, onSelect }) {
  const ref = useRef(null);

  useEffect(() => {
    const lines = ref.current ? [...ref.current.querySelectorAll('.line')] : [];
    lines.forEach((line, i) => {
      const n = i + 1;
      line.classList.toggle('is-selected', selectable && selected === n);
      line.classList.toggle('is-correct', selectable && checked && correctLines?.includes(n));
      line.classList.toggle('is-wrong', selectable && checked && selected === n && !correctLines?.includes(n));
      if (selectable) {
        line.dataset.line = String(n);
        line.tabIndex = checked ? -1 : 0;
        line.setAttribute('role', 'button');
        line.setAttribute('aria-label', `Riga ${n}`);
        line.setAttribute('aria-pressed', String(selected === n));
      }
    });
  });

  const pick = (target) => {
    const line = target.closest('.line');
    if (!line || !ref.current?.contains(line) || checked) return;
    onSelect(Number(line.dataset.line));
  };

  const handlers = selectable
    ? {
        onClick: (e) => pick(e.target),
        onKeyDown: (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            pick(e.target);
          }
        },
      }
    : {};

  const className = `quiz-code not-prose${selectable ? ' is-selectable' : ''}${checked ? ' is-checked' : ''}`;

  if (html) {
    return <div ref={ref} className={className} data-no-copy {...handlers} dangerouslySetInnerHTML={{ __html: html }} />;
  }
  return (
    <div ref={ref} className={className} data-no-copy {...handlers}>
      <pre className="quiz-plain-code">
        <code>
          {String(code).replace(/\n$/, '').split('\n').map((line, i) => (
            <span key={i} className="line">
              {line}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}

function storageKey(id) {
  try {
    return `quiz:${window.location.pathname}:${id}`;
  } catch {
    return null;
  }
}

export default function Quiz({ questions = [], shuffle = true, title }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [round, setRound] = useState(0);
  const [orders, setOrders] = useState(() => questions.map((q) => answerOrder(q, false)));
  const [best, setBest] = useState(null);

  // Identificatore stabile del quiz (per ricordare il miglior punteggio)
  const id = useMemo(() => {
    let hash = 0;
    for (const ch of questions.map((q) => q.question).join('|')) hash = (hash * 31 + ch.charCodeAt(0)) | 0;
    return (hash >>> 0).toString(36);
  }, [questions]);

  // Mescola dopo il mount (non durante il render lato server: eviterebbe l'idratazione)
  useEffect(() => {
    setOrders(questions.map((q) => answerOrder(q, shuffle)));
  }, [round, shuffle, questions]);

  useEffect(() => {
    const key = storageKey(id);
    try {
      const saved = key && window.localStorage.getItem(key);
      if (saved) setBest(JSON.parse(saved));
    } catch {}
  }, [id]);

  const results = questions.map((q, i) => isCorrect(q, answers[i]));
  const score = results.filter(Boolean).length;
  const answered = questions.filter((_, i) => answers[i] !== undefined && answers[i] !== '').length;
  const total = questions.length;

  function setAnswer(i, value) {
    if (checked) return;
    setAnswers((prev) => ({ ...prev, [i]: value }));
  }

  function check() {
    setChecked(true);
    if (!best || score > best.score) {
      const record = { score, total };
      setBest(record);
      try {
        const key = storageKey(id);
        if (key) window.localStorage.setItem(key, JSON.stringify(record));
      } catch {}
    }
  }

  function retry(onlyWrong) {
    setChecked(false);
    setRound((r) => r + 1);
    setAnswers(onlyWrong ? Object.fromEntries(Object.entries(answers).filter(([i]) => results[i])) : {});
  }

  const percent = total ? Math.round((score / total) * 100) : 0;
  const verdict = percent === 100 ? 'Perfetto!' : percent >= 70 ? 'Ottimo lavoro!' : percent >= 40 ? 'Ci sei quasi: rivedi le risposte sbagliate.' : 'Rileggi la lezione e riprova.';

  return (
    <div className="quiz not-prose my-8" data-pagefind-ignore>
      <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-display text-lg font-bold text-slate-900 dark:text-white">{title ?? 'Mettiti alla prova'}</p>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {checked ? `${score}/${total} corrette` : `${answered}/${total} risposte`}
          {best && !checked && <span className="ml-2">· miglior punteggio {best.score}/{best.total}</span>}
        </p>
      </div>

      <ol className="space-y-4">
        {questions.map((q, i) => {
          const type = q.type ?? 'choice';
          const ok = results[i];
          const border = checked
            ? ok
              ? 'border-emerald-400 dark:border-emerald-600'
              : 'border-rose-300 dark:border-rose-700'
            : 'border-slate-200 dark:border-slate-700';

          return (
            <li key={i} className={`rounded-xl border bg-white p-4 shadow-sm dark:bg-slate-900 ${border}`}>
              <div className="flex items-start justify-between gap-3">
                <p className="font-semibold text-slate-900 dark:text-slate-100">
                  <Rich text={q.question} />
                </p>
                {type !== 'choice' && (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                    {type === 'output' ? 'Cosa stampa?' : 'Trova il bug'}
                  </span>
                )}
              </div>

              {q.code && (
                <div className="mt-3">
                  {type === 'bug' && !checked && (
                    <p className="mb-1.5 text-xs text-slate-500 dark:text-slate-400">Clicca la riga che contiene l'errore.</p>
                  )}
                  <CodeBlock
                    code={q.code}
                    html={q.codeHtml}
                    selectable={type === 'bug'}
                    selected={answers[i]}
                    correctLines={type === 'bug' ? bugLines(q) : null}
                    checked={checked}
                    onSelect={(line) => setAnswer(i, line)}
                  />
                </div>
              )}

              {type === 'choice' && (
                <div className="mt-3 space-y-1.5" role="radiogroup">
                  {(orders[i] ?? Object.keys(q.answers ?? {})).map((key, position) => {
                    const selected = answers[i] === key;
                    let state = 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 dark:border-slate-700 dark:hover:border-blue-700 dark:hover:bg-blue-950/30';
                    if (selected && !checked) state = 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/40';
                    if (checked && key === q.correctAnswer) state = 'border-emerald-500 bg-emerald-50 dark:border-emerald-600 dark:bg-emerald-950/40';
                    else if (checked && selected) state = 'border-rose-400 bg-rose-50 dark:border-rose-700 dark:bg-rose-950/40';
                    else if (checked) state = 'border-slate-200 opacity-70 dark:border-slate-700';
                    const text = String(q.answers[key]);
                    return (
                      <label
                        key={key}
                        className={`flex cursor-pointer items-start gap-3 rounded-lg border px-3 py-2 text-sm text-slate-700 transition-colors dark:text-slate-300 ${state} ${checked ? 'cursor-default' : ''}`}
                      >
                        <input
                          type="radio"
                          name={`quiz-${id}-${i}`}
                          value={key}
                          checked={selected}
                          onChange={() => setAnswer(i, key)}
                          disabled={checked}
                          className="mt-0.5 accent-blue-600"
                        />
                        <span className="w-4 shrink-0 font-semibold text-slate-400">{String.fromCharCode(65 + position)}</span>
                        {text.includes('\n') ? (
                          <pre className="m-0 whitespace-pre-wrap font-mono text-[0.85em]">{text}</pre>
                        ) : (
                          <span>
                            <Rich text={text} />
                          </span>
                        )}
                      </label>
                    );
                  })}
                </div>
              )}

              {type === 'output' && (
                <label className="mt-3 block">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Scrivi l'output esatto (una riga per ogni riga stampata)</span>
                  <textarea
                    value={answers[i] ?? ''}
                    onChange={(e) => setAnswer(i, e.target.value)}
                    readOnly={checked}
                    rows={Math.max(2, String(q.expected ?? '').split('\n').length)}
                    spellCheck={false}
                    className="mt-1 block w-full rounded-lg border border-slate-300 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                  />
                </label>
              )}

              {checked && (
                <div className="mt-3 space-y-2 text-sm">
                  <p className={`font-semibold ${ok ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-700 dark:text-rose-400'}`}>
                    {ok ? '✓ Corretto' : answers[i] === undefined || answers[i] === '' ? '✗ Nessuna risposta' : '✗ Sbagliato'}
                    {!ok && type === 'bug' && <span className="font-normal"> · il bug è alla riga {bugLines(q).join(', ')}</span>}
                  </p>
                  {!ok && type === 'output' && (
                    <div>
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Output corretto:</p>
                      <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-100 px-3 py-2 font-mono text-sm text-slate-900 dark:bg-slate-800 dark:text-slate-100">{q.expected}</pre>
                    </div>
                  )}
                  {q.explanation && (
                    <p className="rounded-lg bg-blue-50 px-3 py-2 text-slate-700 dark:bg-blue-950/40 dark:text-slate-300">
                      <span className="font-semibold text-blue-700 dark:text-blue-300">Spiegazione: </span>
                      <Rich text={q.explanation} />
                    </p>
                  )}
                  {type === 'bug' && q.fix && (
                    <div>
                      <p className="mb-1 text-xs font-semibold text-slate-500 dark:text-slate-400">Versione corretta:</p>
                      <CodeBlock code={q.fix} html={q.fixHtml} />
                    </div>
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ol>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        {!checked ? (
          <button type="button" onClick={check} className="btn btn-primary">
            Controlla le risposte
          </button>
        ) : (
          <>
            {score < total && (
              <button type="button" onClick={() => retry(true)} className="btn btn-primary">
                Riprova le sbagliate
              </button>
            )}
            <button type="button" onClick={() => retry(false)} className="btn btn-secondary">
              Ricomincia da capo
            </button>
          </>
        )}
        {!checked && answered < total && answered > 0 && (
          <span className="text-sm text-slate-500 dark:text-slate-400">Mancano {total - answered} risposte</span>
        )}
      </div>

      {checked && (
        <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex items-baseline justify-between gap-2">
            <p className="font-bold text-slate-900 dark:text-white">
              {score}/{total} · {verdict}
            </p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{percent}%</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
            <div
              className={`h-full rounded-full transition-all ${percent >= 70 ? 'bg-emerald-500' : percent >= 40 ? 'bg-amber-500' : 'bg-rose-500'}`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
