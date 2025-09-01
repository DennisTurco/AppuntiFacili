import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";
import { navigate } from 'astro:transitions/client';

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    let hasError = false;

    // validazioni base
    if (!email) {
      toast.warning("Inserisci la tua email");
      hasError = true;
    }
    if (!password) {
      toast.warning("Inserisci la password");
      hasError = true;
    }

    if (hasError) return;

    // tenta login con Supabase
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast.error("Email o password non corretti.");
      return;
    }

    toast.success("Login riuscito 🎉");
    navigate("/videolezioni");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 px-4">
      <h1 className="text-3xl font-bold mb-6">Accedi</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full max-w-md mb-1 p-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full max-w-md mb-4 p-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleLogin}
        className="w-full max-w-md px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition cursor-pointer"
      >
        Accedi
      </button>

      <div className="mt-4 text-center">
        Non hai un account?{" "}
        <a
          href="/register"
          className="text-green-600 font-semibold underline hover:text-green-800"
        >
          Registrati
        </a>
      </div>

      <div className="mt-4 text-center">
        Problemi con l'accesso?{" "}
        <a
          href="/ImparareFacile/contact"
          className="text-green-600 font-semibold underline hover:text-red-400"
        >
          Contattami
        </a>
      </div>
    </div>
  );
}
