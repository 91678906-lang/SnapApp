// ============================================================================
//  ⭐ SECTION AVIS (style Trustpilot)
// ----------------------------------------------------------------------------
//  Une section "preuve sociale" : note globale + cartes d'avis clients.
//  ⚠️ Ce sont des avis de DÉMONSTRATION (écrits ici). Pour afficher les VRAIS
//     avis Trustpilot, il faut un compte entreprise Trustpilot + leur widget
//     officiel (voir explications données dans le chat).
// ============================================================================

// ---- Petit composant : une rangée d'étoiles (style Trustpilot, vert) ----
function Stars({ count = 5 }: { count?: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} étoiles sur 5`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`flex h-6 w-6 items-center justify-center rounded-sm ${
            i < count ? "bg-[#00b67a]" : "bg-slate-200"
          }`}
        >
          {/* L'étoile blanche */}
          <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        </span>
      ))}
    </div>
  );
}

// ---- La liste des avis (tu peux les modifier / en ajouter facilement) ----
const REVIEWS = [
  {
    name: "Marie L.",
    initial: "M",
    date: "il y a 2 jours",
    title: "Service rapide et efficace",
    text: "J'ai fait ma demande en 2 minutes, tout était clair et simple. J'ai reçu une confirmation par email tout de suite. Je recommande vivement !",
  },
  {
    name: "Thomas D.",
    initial: "T",
    date: "il y a 5 jours",
    title: "Très satisfait",
    text: "Site super intuitif, on comprend tout de suite comment ça marche. Le suivi de ma demande a été parfait. Bravo à l'équipe.",
  },
  {
    name: "Sofia R.",
    initial: "S",
    date: "il y a 1 semaine",
    title: "Je recommande à 100%",
    text: "Franchement bluffée par la simplicité. Pas de paperasse compliquée, tout se fait en ligne. Réponse rapide et professionnelle.",
  },
  {
    name: "Karim B.",
    initial: "K",
    date: "il y a 1 semaine",
    title: "Parfait du début à la fin",
    text: "Une expérience sans accroc. L'interface est belle et moderne, et ma demande a été traitée plus vite que prévu. Top !",
  },
];

export default function Reviews() {
  return (
    <section className="mx-auto max-w-5xl">
      {/* En-tête : note globale */}
      <div className="mb-8 flex flex-col items-center gap-3 text-center">
        <div className="flex items-center gap-2">
          {/* Petit logo "étoile" Trustpilot-like */}
          <span className="flex h-7 w-7 items-center justify-center rounded-sm bg-[#00b67a]">
            <svg className="h-5 w-5 text-white" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </span>
          <span className="text-lg font-bold text-slate-900">Trustpilot</span>
        </div>

        <Stars count={5} />

        <p className="text-slate-600">
          <strong className="text-slate-900">Excellent</strong> · Noté{" "}
          <strong className="text-slate-900">4,8 / 5</strong> sur la base de{" "}
          <strong className="text-slate-900">1 247 avis</strong>
        </p>
      </div>

      {/* Grille des avis */}
      <div className="grid gap-5 sm:grid-cols-2">
        {REVIEWS.map((r) => (
          <div
            key={r.name}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            {/* Haut de la carte : avatar + nom + date */}
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-100 font-bold text-amber-700">
                  {r.initial}
                </span>
                <div>
                  <p className="font-semibold text-slate-900">{r.name}</p>
                  <p className="text-xs text-slate-400">{r.date}</p>
                </div>
              </div>
              {/* Badge "Vérifié" */}
              <span className="flex items-center gap-1 text-xs font-medium text-[#00b67a]">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Vérifié
              </span>
            </div>

            {/* Étoiles de l'avis */}
            <div className="mb-2">
              <Stars count={5} />
            </div>

            {/* Titre + texte */}
            <h3 className="mb-1 font-bold text-slate-900">{r.title}</h3>
            <p className="text-sm leading-relaxed text-slate-600">{r.text}</p>
          </div>
        ))}
      </div>

      {/* Note de bas de section */}
      <p className="mt-6 text-center text-xs text-slate-400">
        Avis collectés auprès de nos utilisateurs.
      </p>
    </section>
  );
}
