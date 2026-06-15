// ============================================================================
//  🔌 INITIALISATION DE SUPABASE
// ----------------------------------------------------------------------------
//  Supabase = une base de données gratuite et moderne, en temps réel.
//  Ce fichier crée la connexion ("client") qu'on utilisera dans le store.
// ============================================================================

import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./supabase-config";

// On crée le client Supabase (avec des valeurs "vides" si pas configuré,
// pour éviter une erreur au démarrage en mode local).
export const supabase = createClient(
  SUPABASE_URL.includes("REMPLIR") ? "https://placeholder.supabase.co" : SUPABASE_URL,
  SUPABASE_ANON_KEY.includes("REMPLIR") ? "placeholder-key" : SUPABASE_ANON_KEY
);
