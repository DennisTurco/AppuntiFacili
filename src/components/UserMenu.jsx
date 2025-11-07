import { useState, useEffect, useRef } from "react";
import { LogOut, LogIn, UserPlus, User } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function UserMenu() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    // Chiude il dropdown se clicchi fuori
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      listener.subscription.unsubscribe();
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Bottone principale "Account" */}
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 lg:px-3 py-2 transition-colors"
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-medium">Account</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className={`w-4 h-4 mt-0.5 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19.5 8.25l-7.5 7.5-7.5-7.5"
          />
        </svg>
      </button>

      {/* Dropdown */}
      {open && (
        <div
          className="absolute right-0 mt-2 w-44  rounded-md shadow-md py-2 z-50"
        >
          {user ? (
            <>
              <div className="px-3 py-1 text-xs">
                {user.email}
              </div>
              <button
                onClick={logout}
                className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              >
                <LogIn className="w-4 h-4" />
                Accedi
              </a>
              <a
                href="/register"
                className="flex items-center gap-2 px-3 py-2 text-sm hover:text-green-600 dark:hover:text-green-400 transition-colors"
              >
                <UserPlus className="w-4 h-4" />
                Registrati
              </a>
            </>
          )}
        </div>
      )}
    </div>
  );
}
