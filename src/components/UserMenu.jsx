import { useState, useEffect, useRef } from "react";
import { LogOut, LogIn, UserPlus, User, ChevronDown } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const itemClass =
  "flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800";

export default function UserMenu({ mobile = false }) {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Chiude il dropdown se clicchi fuori o premi Esc
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) setOpen(false);
    };
    const handleKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKey);

    return () => {
      listener.subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
  };

  const items = user ? (
    <>
      <div className="truncate px-3 py-2 text-xs text-slate-500 dark:text-slate-400" title={user.email}>
        {user.email}
      </div>
      <a href="/videolezioni" className={itemClass}>
        <User className="h-4 w-4" />
        Le mie video lezioni
      </a>
      <button onClick={logout} className={`${itemClass} hover:text-red-600 dark:hover:text-red-400`}>
        <LogOut className="h-4 w-4" />
        Esci
      </button>
    </>
  ) : (
    <>
      <a href="/login" className={itemClass}>
        <LogIn className="h-4 w-4" />
        Accedi
      </a>
      <a href="/register" className={itemClass}>
        <UserPlus className="h-4 w-4" />
        Registrati
      </a>
    </>
  );

  // Nel menu mobile le voci sono mostrate direttamente, senza dropdown
  if (mobile) return <div className="flex flex-col gap-1">{items}</div>;

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
      >
        <User className="h-4 w-4" />
        <span>{user ? "Account" : "Accedi"}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          {items}
        </div>
      )}
    </div>
  );
}
