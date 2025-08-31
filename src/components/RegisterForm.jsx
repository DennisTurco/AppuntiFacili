import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";
import { navigate } from 'astro:transitions/client';

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");

  const [errors, setErrors] = useState({ email: "", password: "", general: "" });

  const handleSignUp = async () => {
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
    if (!name) {
      newErrors.general = "Nome richiesto.";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    // registra utente
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { phone, full_name: name }, // salva nome e telefono in user_metadata
        emailRedirectTo: `${window.location.origin}/ImparareFacile/auth/callback`
      }
    });

    if (error) {
      console.error(error.message);
      if (error.message.includes("already registered")) {
        setErrors(prev => ({ ...prev, general: "Questa email è già in uso." }));
        toast.error("Questa email è già in uso.");
      } else {
        setErrors(prev => ({ ...prev, general: error.message }));
        toast.error(error.message);
      }
      return;
    }

    toast.success("Registrazione effettuata! Controlla la tua email per attivare l'account.");
    navigate("/ImparareFacile/login");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4 px-4">
      <h1 className="text-3xl font-bold mb-6">Registrati</h1>
      <input
        type="text"
        placeholder="Nome"
        value={name}
        onChange={e => setName(e.target.value)}
        className="w-full max-w-md mb-1 p-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.general && <div className="text-red-400 text-sm mb-2">{errors.general}</div>}

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
        className="w-full max-w-md mb-1 p-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      {errors.password && <div className="text-red-400 text-sm mb-2">{errors.password}</div>}

      <input
        type="tel"
        placeholder="Numero di telefono"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="w-full max-w-md mb-4 p-4 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <button
        onClick={handleSignUp}
        className="w-full max-w-md px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 font-semibold transition cursor-pointer"
      >
        Registrati
      </button>

      <div className="mt-4 text-center">
        Hai già un account?{" "}
        <a
          href="/ImparareFacile/login"
          className="text-blue-600 font-semibold underline hover:text-blue-800"
        >
          Login
        </a>
      </div>
    </div>
  );
}
