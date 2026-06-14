// ============================================================================
//  🔐 PAGE ADMIN — version SIMPLE (juste un mot de passe)
//    - Pas connecté  -> écran de connexion (un seul champ : le mot de passe)
//    - Connecté      -> tableau de bord avec tous les envois (en ligne)
// ============================================================================

import { useState } from "react";
import {
  ADMIN_PASSWORD,
  ONLINE_MODE,
  MODE_LABEL,
  checkPassword,
  clearMessages,
  deleteMessage,
  isLoggedIn,
  login,
  logout,
} from "../lib/store";
import { useMessages } from "../hooks/useMessages";
import { FullScreenLoader, SpinnerCircle } from "../components/Spinner";

export default function AdminPage() {
  // Est-on connecté ? On lit la mémoire au démarrage (reste connecté après
  // un rechargement, grâce à localStorage). ✅
  const [connected, setConnected] = useState(isLoggedIn());

  // 🔐 ÉCRAN DE CONNEXION
  if (!connected) {
    return <LoginScreen onSuccess={() => setConnected(true)} />;
  }

  // 📊 TABLEAU DE BORD (connecté)
  return <Dashboard onLogout={() => { logout(); setConnected(false); }} />;
}

// ============================================================================
//  🔐 L'ÉCRAN DE CONNEXION (un seul champ : le mot de passe)
// ============================================================================
function LoginScreen({ onSuccess }: { onSuccess: () => void }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setChecking(true);
    setError(false);

    // Petit temps d'attente pour montrer le joli rond qui tourne. 🔄
    setTimeout(() => {
      if (checkPassword(password)) {
        login();
        onSuccess();
      } else {
        setError(true);
        setChecking(false);
      }
    }, 700);
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-3xl shadow-lg shadow-yellow-200">
            🔐
          </div>
          <h1 className="text-2xl font-bold text-slate-900">Zone admin</h1>
          <p className="mt-1 text-slate-600">
            Réservé à l'administrateur. Entre ton mot de passe.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">
              Mot de passe
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="••••••••"
              disabled={checking}
              autoFocus
              className={`w-full rounded-xl border px-4 py-3 outline-none transition focus:ring-4 disabled:opacity-60 ${
                error
                  ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                  : "border-slate-300 focus:border-yellow-500 focus:ring-yellow-100"
              }`}
            />
            {error && (
              <p className="mt-2 text-sm font-medium text-red-600">
                ❌ Mot de passe incorrect. Réessaie.
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={checking || !password}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-yellow-200 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {checking ? (
              <>
                <SpinnerCircle size={22} /> Vérification…
              </>
            ) : (
              <>Se connecter →</>
            )}
          </button>
        </form>

        <p className="mt-6 rounded-lg bg-amber-50 p-3 text-center text-xs text-amber-700">
          🔑 Mot de passe : <strong>{ADMIN_PASSWORD}</strong>
          <br />
          (à changer dans <code>src/lib/store.ts</code>)
        </p>
      </div>
    </div>
  );
}

// ============================================================================
//  📊 LE TABLEAU DE BORD (une fois connecté)
// ============================================================================
function Dashboard({ onLogout }: { onLogout: () => void }) {
  // La liste des messages, mise à jour AUTOMATIQUEMENT et EN TEMPS RÉEL.
  const { messages, loading } = useMessages();

  if (loading) {
    return <FullScreenLoader message="Téléchargement des messages…" />;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Bandeau indiquant le mode de fonctionnement (Supabase / Local) */}
      <div
        className={`rounded-xl px-4 py-2 text-center text-xs font-medium ${
          ONLINE_MODE ? "bg-green-50 text-green-700" : "bg-amber-50 text-amber-700"
        }`}
      >
        {MODE_LABEL}
      </div>

      {/* ----- En-tête ----- */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-400 to-amber-500 text-xl text-white shadow-md">
            📊
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Tableau de bord</h1>
            <p className="text-sm text-slate-500">
              Les formulaires envoyés par les utilisateurs
            </p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
        >
          ↩️ Se déconnecter
        </button>
      </div>

      {/* ----- Statistiques ----- */}
      <div className="grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-extrabold text-amber-600">{messages.length}</p>
          <p className="text-sm text-slate-500">message(s) reçu(s)</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm">
          <p className="text-3xl font-extrabold text-emerald-600">
            {messages.length > 0 ? "🔴" : "⚪"}
          </p>
          <p className="text-sm text-slate-500">
            {messages.length > 0 ? "En direct" : "En attente"}
          </p>
        </div>
      </div>

      {/* ----- La liste des messages ----- */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 className="font-bold text-slate-900">Messages reçus</h2>
          {messages.length > 0 && (
            <button
              onClick={async () => {
                if (confirm("Effacer tous les messages ?")) await clearMessages();
              }}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
            >
              🗑️ Tout effacer
            </button>
          )}
        </div>

        {messages.length === 0 ? (
          <div className="px-5 py-12 text-center text-slate-400">
            <p className="text-4xl">📭</p>
            <p className="mt-2 text-sm">
              Aucun message pour l'instant. Va sur la{" "}
              <a href="#/utilisateur" className="font-medium text-amber-600 underline">
                page utilisateur
              </a>{" "}
              pour en envoyer un !
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {messages.map((m) => (
              <li key={m.id} className="px-5 py-4 transition hover:bg-slate-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-yellow-50 text-sm font-bold text-amber-600">
                      {(m.prenom ?? "?").charAt(0).toUpperCase() || "?"}
                    </span>
                    <div className="min-w-0 space-y-0.5">
                      <p className="truncate font-semibold text-slate-900">
                        {m.prenom} {m.nom}
                      </p>
                      <p className="truncate text-sm text-slate-500">✉️ {m.email}</p>
                      <p className="truncate text-sm text-slate-500">📍 {m.ville}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteMessage(m.id)}
                    className="shrink-0 rounded-lg px-2.5 py-1.5 text-sm text-slate-400 transition hover:bg-red-50 hover:text-red-600"
                    title="Supprimer ce message"
                  >
                    ✕
                  </button>
                </div>

                <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Mots
                  </span>
                  <span className="rounded-lg bg-yellow-50 px-3 py-1 text-sm font-semibold text-amber-700">
                    {m.word1}
                  </span>
                  <span className="rounded-lg bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">
                    {m.word2}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-400">
                  {new Date(m.createdAt).toLocaleString("fr-FR")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-center text-xs text-slate-400">
        💡 Cette liste se met à jour TOUTE SEULE : remplis le formulaire depuis
        la page utilisateur (même sur ton téléphone) et regarde ici.
      </p>
    </div>
  );
}
