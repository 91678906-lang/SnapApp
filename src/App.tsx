// ============================================================================
//  🏗️ APP — le squelette du site
// ----------------------------------------------------------------------------
//  On utilise un "HashRouter" : c'est lui qui décide quelle page afficher
//  selon l'adresse (ex : #/admin -> la page admin).
//
//  <Routes> contient toutes les pages. <Route> relie une adresse à une page.
// ============================================================================

import { HashRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import UserPage from "./pages/UserPage";
import AdminPage from "./pages/AdminPage";

export default function App() {
  return (
    <HashRouter>
      <div className="flex min-h-screen flex-col bg-slate-50 text-slate-900">
        {/* La barre de navigation (visible partout) */}
        <Navbar />

        {/* La zone où s'affiche la page courante */}
        <main className="flex-1 px-4 py-10">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/utilisateur" element={<UserPage />} />
            <Route path="/admin" element={<AdminPage />} />
            {/* Si l'adresse n'existe pas, on revient à l'accueil. */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Le pied de page — l'accès admin est caché ici 🤫 */}
        <footer className="border-t border-slate-200 bg-white py-6">
          <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 text-sm text-slate-400 sm:flex-row">
            <p>Fait avec ❤️ pour apprendre le développement web · Snapapp</p>

            {/* 🔒 ACCÈS ADMIN SECRET
                Un petit cadenas très discret (presque invisible).
                Au survol il devient visible. Il mène à la page admin,
                qui demandera ensuite le mot de passe. */}
            <Link
              to="/admin"
              title="Espace réservé"
              className="text-slate-300 transition hover:text-yellow-500"
              aria-label="Espace réservé"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="11" width="18" height="11" rx="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </Link>
          </div>
        </footer>
      </div>
    </HashRouter>
  );
}
