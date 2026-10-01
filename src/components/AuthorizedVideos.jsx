import { useState, useEffect } from "react";
import { Lock, LogIn, Loader2 } from "lucide-react";
import { supabase } from "../lib/supabaseClient";
import { videos } from "@/data/videos.ts";

function EmptyState({ icon: Icon, title, children }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-slate-300 px-6 py-14 text-center dark:border-slate-700">
      <Icon className="mx-auto h-8 w-8 text-slate-400" />
      <p className="mt-4 font-semibold text-slate-800 dark:text-slate-200">{title}</p>
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">{children}</div>
    </div>
  );
}

export default function AuthorizedVideos() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="col-span-full flex justify-center py-14 text-slate-400">
        <Loader2 className="h-6 w-6 animate-spin" aria-label="Caricamento" />
      </div>
    );
  }

  if (!user) {
    return (
      <EmptyState icon={LogIn} title="Accedi per vedere i video">
        <a href="/login" className="btn btn-primary mt-4">Accedi</a>
        <p className="mt-3">
          Non hai un account? <a href="/register" className="link">Registrati</a>
        </p>
      </EmptyState>
    );
  }

  const authorizedVideos = videos.filter((video) => video.allowed.includes(user.email));

  if (authorizedVideos.length === 0) {
    return (
      <EmptyState icon={Lock} title="Nessun video disponibile per il tuo account">
        <p>
          <a href="/contact" className="link">Contattami</a> per richiedere l'accesso.
        </p>
      </EmptyState>
    );
  }

  return authorizedVideos.map((video) => (
    <article key={video.url} className="card overflow-hidden">
      <div className="aspect-video bg-slate-100 dark:bg-slate-800">
        <iframe
          className="h-full w-full"
          src={video.url}
          title={video.title}
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <h2 className="px-5 py-4 text-lg font-semibold text-slate-900 dark:text-white">{video.title}</h2>
    </article>
  ));
}
