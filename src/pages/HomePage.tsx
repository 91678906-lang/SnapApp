// ============================================================================
//  🏠 PAGE D'ACCUEIL
//  Elle explique ce que fait le site et montre les loaders.
// ============================================================================

import { Link } from "react-router-dom";
import { SpinnerCircle, SpinnerDots, SpinnerRing } from "../components/Spinner";
import Reviews from "../components/Reviews";

export default function HomePage() {
  return (
    <div className="space-y-16">
      {/* ---------------- HERO (grande bannière de bienvenue) ---------------- */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-300 via-amber-300 to-yellow-400 px-6 py-16 text-center shadow-xl sm:px-12">
        {/* Petites bulles décoratives */}
        <div className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-white/30 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 rounded-full bg-white/30 blur-2xl" />

        <div className="relative mx-auto max-w-2xl space-y-5 text-slate-900">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/60 px-4 py-1.5 text-sm font-medium backdrop-blur">
            🎓 Jeu concours Snap Plus
          </span>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Gagne ton Snap+ offert !
          </h1>
          <p className="text-lg text-slate-700">
            Fais ta demande <strong className="text-amber-800">rapidement</strong>{" "}
            puis tu recevra un <strong className="text-amber-800">mail de confirmation</strong>. Puis profite ! Plus de 1 247 utilisateurs ont participé (voir avis).
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/utilisateur"
              className="rounded-xl bg-white px-6 py-3 font-semibold text-amber-700 shadow-lg transition hover:scale-105 hover:bg-amber-50"
            >
              ✍️ Commencer ma demande
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- COMMENT ÇA MARCHE (3 étapes) ---------------- */}
      <section className="mx-auto max-w-5xl">
        <h2 className="mb-8 text-center text-2xl font-bold text-slate-900">
          Comment ça marche ?
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            {
              icon: "📝",
              title: "1. L'utilisateur remplit le formulaire",
              text: "Sur la page utilisateur, on remplit d'abord 4 champs d'information.",
            },
            {
              icon: "💾",
              title: "2. Tout est sauvegardé",
              text: "Après une page de chargement, vous recevrez un sms ou mail affrimant la confirmation que vous etes un humain.",
            },
            {
              icon: "👀",
              title: "3. Profitez maintenant !",
              text: "Attendez de recevoir un message par mail, si vous etes tirez au sort, alors ovus pouvez dès maintenant profiter.",
            },
          ].map((step) => (
            <div
              key={step.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50 text-2xl">
                {step.icon}
              </div>
              <h3 className="mb-1 font-bold text-slate-900">{step.title}</h3>
              <p className="text-sm leading-relaxed text-slate-600">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- AVIS CLIENTS (style Trustpilot) ---------------- */}
      <Reviews />

      {/* ---------------- DÉMO DES LOADERS ---------------- */}
      <section className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="mb-2 text-center text-2xl font-bold text-slate-900">
          🔄 Les pages de chargement
        </h2>
        <p className="mb-8 text-center text-slate-600">
          Voici 3 styles de "ronds qui tournent". On les affiche pendant qu'une
          action est en cours.
        </p>
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-50 p-8">
            <SpinnerCircle />
            <div className="text-center">
              <p className="font-semibold text-slate-800">Le classique</p>
              <p className="text-xs text-slate-500">
                Une bordure qui tourne (le plus connu)
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-50 p-8">
            <SpinnerRing />
            <div className="text-center">
              <p className="font-semibold text-slate-800">L'anneau</p>
              <p className="text-xs text-slate-500">
                Dessiné en SVG, avec un dégradé
              </p>
            </div>
          </div>
          <div className="flex flex-col items-center gap-4 rounded-2xl bg-slate-50 p-8">
            <SpinnerDots />
            <div className="text-center">
              <p className="font-semibold text-slate-800">Les points</p>
              <p className="text-xs text-slate-500">
                Trois points qui sautillent
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
