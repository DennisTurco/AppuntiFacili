import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";
import { navigate } from "astro:transitions/client";
import AuthCard, { Field } from "./AuthCard.jsx";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Inserisci email e password");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);

    if (error) {
      toast.error("Email o password non corretti.");
      return;
    }

    toast.success("Login riuscito!");
    navigate("/videolezioni");
  };

  return (
    <AuthCard
      title="Accedi"
      subtitle="Entra per vedere le tue video lezioni."
      footer={
        <>
          <p>
            Non hai un account? <a href="/register" className="link">Registrati</a>
          </p>
          <p>
            Problemi con l'accesso? <a href="/contact" className="link">Contattami</a>
          </p>
        </>
      }
    >
      <form onSubmit={handleLogin} className="space-y-5" noValidate>
        <Field
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="nome@esempio.it"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading} className="btn btn-lg btn-primary w-full">
          {loading ? "Accesso in corso..." : "Accedi"}
        </button>
      </form>
    </AuthCard>
  );
}
