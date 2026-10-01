/** Contenitore comune per i form di accesso e registrazione. */
export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <div className="flex justify-center py-12 md:py-20">
      <div className="w-full max-w-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
          {subtitle && <p className="mt-2 text-slate-600 dark:text-slate-400">{subtitle}</p>}
        </div>
        <div className="card mt-8 p-6 sm:p-8">{children}</div>
        {footer && <div className="mt-6 space-y-2 text-center text-sm text-slate-600 dark:text-slate-400">{footer}</div>}
      </div>
    </div>
  );
}

export function Field({ label, id, error, ...props }) {
  return (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      <input id={id} className="input" aria-invalid={error ? "true" : undefined} {...props} />
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
}
