// ============================================================================
//  ⚙️ CONFIGURATION SUPABASE — SEULEMENT 2 VALEURS À COPIER ! 🎉
// ----------------------------------------------------------------------------
//  Tant que ces 2 lignes contiennent "À_REMPLIR", le site reste en MODE LOCAL.
//  Dès que tu copies tes 2 valeurs, le site partage les demandes entre ton
//  téléphone et ton ordi, EN TEMPS RÉEL. (Voir SETUP.md pour les obtenir.)
//
//  Où trouver ces 2 valeurs ? Sur supabase.com → ton projet SnapAPP →
//  en bas du menu de gauche : ⚙️ "Project Settings" → "API" → tu copies :
//    • "Project URL"           -> SUPABASE_URL
//    • "Project API keys" -> la clé "anon public" -> SUPABASE_ANON_KEY
// ============================================================================

// 1️⃣ L'adresse de ton projet (ex : https://hlzoczlqlpfnunvlhtfo.supabase.co)
export const SUPABASE_URL = "https://hlzoczlqlpfnunvlhtfo.supabase.co";

// 2️⃣ Ta clé publique "anon" (une très longue suite de caractères)
export const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhsem9jemxxbHBmbnVudmxodGZvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE0Njk4NzksImV4cCI6MjA5NzA0NTg3OX0.c68wzIVLaM9teNcOUT4tTN-QkEK9NAgNi9pcCBAEDvg";

// Détection automatique : as-tu rempli la config ?
export const isSupabaseConfigured =
  !SUPABASE_URL.includes("REMPLIR") && !SUPABASE_ANON_KEY.includes("REMPLIR");
