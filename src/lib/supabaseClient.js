import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY

// Senza credenziali (es. sviluppo locale) usa un client fittizio: il sito funziona, l'autenticazione no.
const notConfigured = { message: 'Supabase non configurato' }
const offlineClient = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: async () => ({ data: { user: null, session: null }, error: notConfigured }),
    signUp: async () => ({ data: { user: null, session: null }, error: notConfigured }),
    signOut: async () => ({ error: null }),
  },
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('[supabase] PUBLIC_SUPABASE_URL / PUBLIC_SUPABASE_ANON_KEY mancanti: autenticazione disabilitata.')
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : offlineClient
