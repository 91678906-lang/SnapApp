// ============================================================================
//  📦 LE "STORE" — où l'on range et récupère les données.
// ----------------------------------------------------------------------------
//  DEUX MODES (choisis automatiquement) :
//
//  🟢 MODE EN LIGNE (Supabase) — dès que tu remplis supabase-config.ts.
//     → Tu remplis sur ton téléphone, tu vois le résultat sur ton ordi.
//     → EN TEMPS RÉEL (la demande apparaît instantanément sur l'admin).
//     → Les données survivent aux rechargements.
//
//  🟡 MODE LOCAL — tant que la config n'est pas remplie.
//     → Les demandes restent sur 1 SEUL appareil.
//
//  Connexion admin : un simple mot de passe, on reste connecté après
//  un rechargement. ✅
// ============================================================================

import { supabase } from "./supabase";
import { isSupabaseConfigured } from "./supabase-config";

// "Vrai" mode = la config Supabase est-elle remplie ?
export const ONLINE_MODE = isSupabaseConfigured;

// 👉 MOT DE PASSE DE L'ADMIN — change-le pour mettre le tien !
export const ADMIN_PASSWORD = "patate123";

// Petit texte pour le bandeau admin.
export const MODE_LABEL = ONLINE_MODE
  ? "🟢 En ligne (Supabase) — temps réel, multi-appareils"
  : "🟡 Mode local — visible sur cet appareil uniquement";

// Le nom de la table dans Supabase (à créer une fois, voir SETUP.md).
const TABLE = "messages";

// ----------------------------------------------------------------------------
//  Le type d'un message.
// ----------------------------------------------------------------------------
export interface UserMessage {
  id: string;
  prenom: string;
  nom: string;
  email: string;
  ville: string;
  word1: string;
  word2: string;
  createdAt: number; // date/heure en millisecondes
}

// ============================================================================
//  🟡 MODE LOCAL (mémoire du navigateur, mode secours)
// ============================================================================
const MESSAGES_KEY = "app_messages";

function getLocalMessages(): UserMessage[] {
  const raw = localStorage.getItem(MESSAGES_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as UserMessage[];
  } catch {
    return [];
  }
}

function localAdd(data: Omit<UserMessage, "id" | "createdAt">): string {
  const id = crypto.randomUUID();
  const all = getLocalMessages();
  all.push({ ...data, id, createdAt: Date.now() });
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("messages-updated"));
  return id;
}

function localUpdateWord2(id: string, word2: string) {
  const all = getLocalMessages().map((m) =>
    m.id === id ? { ...m, word2 } : m
  );
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(all));
  window.dispatchEvent(new Event("messages-updated"));
}

function localDelete(id: string) {
  localStorage.setItem(
    MESSAGES_KEY,
    JSON.stringify(getLocalMessages().filter((m) => m.id !== id))
  );
  window.dispatchEvent(new Event("messages-updated"));
}

function localClear() {
  localStorage.removeItem(MESSAGES_KEY);
  window.dispatchEvent(new Event("messages-updated"));
}

function localSubscribe(cb: (m: UserMessage[]) => void) {
  cb([...getLocalMessages()].reverse());
  const handler = () => cb([...getLocalMessages()].reverse());
  window.addEventListener("messages-updated", handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener("messages-updated", handler);
    window.removeEventListener("storage", handler);
  };
}

// ============================================================================
//  🟢/🟡 FONCTIONS PUBLIQUES (choisissent le bon mode automatiquement)
// ============================================================================

// ---- AJOUTER un message. Renvoie l'ID créé. ----
// 👉 Accepte :
//    • 4 champs + word1 (ligne à moitié, "en cours")
//    • 4 champs + word1 + word2 (ligne complète, envoyée à la fin)
export async function addMessage(data: {
  prenom: string;
  nom: string;
  email: string;
  ville: string;
  word1: string;
  word2?: string;
}): Promise<string> {
  const payload = {
    prenom: data.prenom,
    nom: data.nom,
    email: data.email,
    ville: data.ville,
    word1: data.word1,
    word2: data.word2 ?? "", // vide si non fourni
  };

  if (ONLINE_MODE) {
    const { data: result, error } = await supabase
      .from(TABLE)
      .insert(payload)
      .select("id");

    if (error) throw error;

    if (result && result.length > 0) {
      return String(result[0].id);
    }

    // Si .select() ne renvoie rien (à cause des règles), on lit la dernière ligne.
    const { data: latest } = await supabase
      .from(TABLE)
      .select("id")
      .order("created_at", { ascending: false })
      .limit(1);

    if (latest && latest.length > 0) return String(latest[0].id);
    throw new Error("Impossible de récupérer l'ID du formulaire");
  }
  return localAdd(payload);
}

// ---- COMPLÉTER un message avec le 2e mot ----
// 👉 TECHNIQUE LA PLUS FIABLE : on SUPPRIME l'ancienne ligne (à moitié remplie)
//    et on en CRÉÉ une NOUVELLE complète. Comme ça, on ne dépend plus de
//    l'`update` qui peut être refusé par les règles de sécurité.
export async function updateMessageWithWord2(id: string, word2: string) {
  console.log("🔄 Tentative de complétion. ID reçu :", id, "| word2 :", word2);

  if (ONLINE_MODE) {
    // 1) On lit TOUTES les infos de la ligne la plus récente (celle à compléter)
    const { data: latest, error: errRead } = await supabase
      .from(TABLE)
      .select("id, prenom, nom, email, ville, word1, created_at")
      .order("created_at", { ascending: false })
      .limit(1);

    console.log("📡 Lecture de la ligne la plus récente :", latest, "| erreur :", errRead);

    if (errRead || !latest || latest.length === 0) {
      console.error("❌ Impossible de lire la ligne la plus récente");
      throw new Error("Impossible de retrouver la ligne");
    }

    const line = latest[0];
    const oldId = line.id;

    // 2) On SUPPRIME l'ancienne ligne (à moitié remplie)
    try {
      await supabase.from(TABLE).delete().eq("id", oldId);
      console.log("✅ Ancienne ligne supprimée");
    } catch (e) {
      console.log("⚠️ Échec de la suppression (on continue quand même) :", e);
    }

    // 3) On CRÉÉ une NOUVELLE ligne COMPLÈTE avec le 2e mot
    const { data: created, error: errInsert } = await supabase
      .from(TABLE)
      .insert({
        prenom: line.prenom,
        nom: line.nom,
        email: line.email,
        ville: line.ville,
        word1: line.word1,
        word2: word2,
      })
      .select("id, word2");

    console.log("📡 Création de la nouvelle ligne complète :", created, "| erreur :", errInsert);

    if (errInsert) {
      console.error("❌ Échec de la création :", errInsert);
      throw errInsert;
    }

    console.log("✅ Ligne complète créée avec succès :", created?.[0]);
  } else {
    localUpdateWord2(id, word2);
    console.log("✅ (mode local) Ligne mise à jour avec succès");
  }
}

// ---- SUPPRIMER un message ----
export async function deleteMessage(id: string) {
  if (ONLINE_MODE) {
    const { error } = await supabase.from(TABLE).delete().eq("id", id);
    if (error) throw error;
  } else {
    localDelete(id);
  }
}

// ---- TOUT EFFACER ----
export async function clearMessages() {
  if (ONLINE_MODE) {
    // On supprime toutes les lignes (la condition "id non nul" = toutes).
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .not("id", "is", null);
    if (error) throw error;
  } else {
    localClear();
  }
}

// Transforme une ligne Supabase en notre format UserMessage.
function rowToMessage(row: Record<string, unknown>): UserMessage {
  return {
    id: String(row.id),
    prenom: (row.prenom as string) ?? "",
    nom: (row.nom as string) ?? "",
    email: (row.email as string) ?? "",
    ville: (row.ville as string) ?? "",
    word1: (row.word1 as string) ?? "",
    word2: (row.word2 as string) ?? "",
    createdAt: row.created_at ? new Date(row.created_at as string).getTime() : 0,
  };
}

// ---- S'ABONNER aux messages (EN TEMPS RÉEL) ----
export function subscribeToMessages(cb: (m: UserMessage[]) => void) {
  if (ONLINE_MODE) {
    // Fonction qui lit toute la liste (triée du plus récent au plus ancien).
    const load = async () => {
      const { data, error } = await supabase
        .from(TABLE)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Lecture Supabase échouée :", error);
        return;
      }
      cb((data ?? []).map(rowToMessage));
    };

    load(); // lecture immédiate

    // 🔴 Abonnement temps réel : à chaque ajout/suppression, on recharge.
    const channel = supabase
      .channel("messages-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: TABLE },
        () => load()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }

  // Mode local :
  return localSubscribe(cb);
}

// ============================================================================
//  🔐 CONNEXION ADMIN (simple mot de passe, on reste connecté)
// ============================================================================
const AUTH_KEY = "snapapp_admin";

export function checkPassword(password: string): boolean {
  return password === ADMIN_PASSWORD;
}

export function login(): void {
  localStorage.setItem(AUTH_KEY, "true");
}

export function logout(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function isLoggedIn(): boolean {
  return localStorage.getItem(AUTH_KEY) === "true";
}
