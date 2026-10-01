import { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { toast } from "react-hot-toast";
import { navigate } from "astro:transitions/client";
import AuthCard, { Field } from "./AuthCard.jsx";

export default function RegisterForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSignUp = async (e) => {
    e.preventDefault();

    const newErrors = {};
    if (!name) newErrors.name = "Nome richiesto.";
    if (!email) newErrors.email = "Email richiesta.";
    if (!password) newErrors.password = "Password richiesta.";
    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { phone, full_name: name }, // salva nome e telefono in user_metadata
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    setLoading(false);

    if (error) {
      console.error(error.message);
      const message = error.message.includes("already registered") ? "Questa email è già in uso." : error.message;
      setErrors({ general: message });
      toast.error(message);
      return;
    }

    toast.success("Registrazione effettuata! Controlla la tua email per attivare l'account.");
    navigate("/login");
  };

  return (
    <AuthCard
      title="Crea un account"
      subtitle="Ti servirà per accedere alle video lezioni."
      footer={
        <p>
          Hai già un account? <a href="/login" className="link">Accedi</a>
        </p>
      }
    >
      <form onSubmit={handleSignUp} className="space-y-5" noValidate>
        <Field label="Nome" id="name" autoComplete="name" value={name} error={errors.name} onChange={(e) => setName(e.target.value)} />
        <Field
          label="Email"
          id="email"
          type="email"
          autoComplete="email"
          placeholder="nome@esempio.it"
          value={email}
          error={errors.email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Field
          label="Password"
          id="password"
          type="password"
          autoComplete="new-password"
          value={password}
          error={errors.password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Field
          label="Telefono (facoltativo)"
          id="phone"
          type="tel"
          autoComplete="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        {errors.general && <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>}
        <button type="submit" disabled={loading} className="btn btn-lg btn-primary w-full">
          {loading ? "Registrazione in corso..." : "Registrati"}
        </button>
      </form>
    </AuthCard>
  );
}
