import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  const handleLogin = async () => {
    const newErrors = { email: "", password: "", general: "" };
    let hasError = false;

    // validazioni base
    if (!email) {
      newErrors.email = "Email richiesta.";
      hasError = true;
    }
    if (!password) {
      newErrors.password = "Password richiesta.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    // tenta login con Supabase
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setErrors(prev => ({ ...prev, general: "Email o password non corretti." }));
      return;
    }

    alert("Login riuscito!");
    window.location.href = "/videolezioni"; // pagina protetta
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 px-4">
      <h1 className="text-3xl font-bold mb-6">Accedi</h1>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full max-w-md mb-1 p-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.email && <div className="text-red-400 text-sm mb-2">{errors.email}</div>}

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full max-w-md mb-4 p-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.password && <div className="text-red-400 text-sm mb-2">{errors.password}</div>}

      <button
        onClick={handleLogin}
        className="w-full max-w-md px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 font-semibold transition cursor-pointer"
      >
        Accedi
      </button>

      {errors.general && (
        <div className="text-red-500 text-sm mt-2">{errors.general}</div>
      )}

      <div className="mt-4 text-center">
        Non hai un account?{" "}
        <a
          href="/register"
          className="text-green-600 font-semibold underline hover:text-green-800"
        >
          Registrati
        </a>
      </div>
    </div>
  );
}
