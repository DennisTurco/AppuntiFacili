import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function UserMenu() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };
    fetchUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (user) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-gray-800 font-semibold">{user.email}</span>
        <button
          onClick={logout}
          className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600 cursor-pointer"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <a
        href="/login"
        className="px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600"
      >
        Login
      </a>
      <a
        href="/register"
        className="px-3 py-1 rounded bg-green-500 text-white hover:bg-green-600"
      >
        Register
      </a>
    </>
  );
}
