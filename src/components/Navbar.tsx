// ============================================================================
//  🧭 LA BARRE DE NAVIGATION (en haut de chaque page)
// ----------------------------------------------------------------------------
//  On utilise "NavLink" du routeur : c'est comme un lien <a> mais il ajoute
//  automatiquement la classe "active" à la page actuellement affichée.
// ============================================================================

import { NavLink } from "react-router-dom";
import { cn } from "../utils/cn";

const links = [
  { to: "/", label: "Accueil", end: true },
  { to: "/utilisateur", label: "Ma demande" },
];
// ℹ️ La page "Admin" n'apparaît PAS ici : elle est volontairement cachée
// dans le footer, derrière un petit cadenas discret + un mot de passe.

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/80 backdrop-blur-lg">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        {/* Logo / nom du site : fond jaune + fantôme blanc 👻 */}
        <NavLink to="/" className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-400 shadow-md shadow-yellow-200">
            <svg className="h-5 w-5" viewBox="0 0 24 24" aria-hidden="true">
              {/* Le corps du fantôme (blanc) */}
              <path
                fill="#ffffff"
                d="M12 2a8 8 0 0 0-8 8v12l3-3 2.5 2.5L12 22l2.5-2.5L17 22l3-3V10a8 8 0 0 0-8-8z"
              />
              {/* Les yeux : petits ronds jaunes (couleur du fond) = effet "trou" */}
              <circle cx="9.5" cy="11" r="1.3" fill="#facc15" />
              <circle cx="14.5" cy="11" r="1.3" fill="#facc15" />
            </svg>
          </span>
          <span className="text-lg font-bold tracking-tight text-slate-900">
            Snap<span className="text-yellow-500">app</span>
          </span>
        </NavLink>

        {/* Liens de navigation */}
        <div className="flex items-center gap-1">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors sm:px-4",
                  isActive
                    ? "bg-yellow-50 text-amber-700"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
