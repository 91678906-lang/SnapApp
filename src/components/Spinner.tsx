// ============================================================================
//  🔄 LES LOADERS (ronds qui tournent)
// ----------------------------------------------------------------------------
//  Un "loader" sert à montrer à l'utilisateur : "attends, ça charge...".
//  On les affiche pendant qu'une action est en cours (connexion, envoi...).
//
//  On va voir 3 techniques, de la plus simple à la plus "pro" :
//    1. Le rond avec une bordure qui tourne (le plus connu)
//    2. Les 3 points qui sautillent
//    3. Un anneau SVG animé (joli dégradé)
// ============================================================================

// ----------------------------------------------------------------------------
//  1️⃣ Le rond classique : un cercle dont SEULEMENT le haut de la bordure
//     est coloré, et qui tourne sur lui-même indéfiniment.
// ----------------------------------------------------------------------------
export function SpinnerCircle({
  size = 48,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <div
      role="status"
      aria-label="Chargement en cours"
      className={`inline-block animate-spin rounded-full border-4 border-slate-200 border-t-yellow-500 ${className}`}
      style={{ width: size, height: size }}
    />
  );
}

// ----------------------------------------------------------------------------
//  2️⃣ Les 3 points : chacun s'agrandit à tour de rôle.
// ----------------------------------------------------------------------------
export function SpinnerDots({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} role="status">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-3 w-3 animate-bounce rounded-full bg-yellow-400"
          style={{ animationDelay: `${i * 0.15}s` }}
        />
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------------
//  3️⃣ L'anneau SVG : un cercle dessiné avec un "trait" qui se remplit.
//     Plus joli, parfait pour afficher un pourcentage si besoin.
// ----------------------------------------------------------------------------
export function SpinnerRing({
  size = 56,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <svg
      className={`animate-spin ${className}`}
      width={size}
      height={size}
      viewBox="0 0 50 50"
      role="status"
      aria-label="Chargement en cours"
    >
      {/* Cercle de fond (gris clair) */}
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="#e2e8f0"
        strokeWidth="5"
      />
      {/* Cercle coloré qui se dessine partiellement */}
      <circle
        cx="25"
        cy="25"
        r="20"
        fill="none"
        stroke="url(#ringGradient)"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray="90 200" // donne l'effet "arc de cercle"
      />
      <defs>
        <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#eab308" />
        </linearGradient>
      </defs>
    </svg>
  );
}

// ----------------------------------------------------------------------------
//  🎁 En bonus : un grand écran de chargement complet (centré, plein écran),
//     avec un petit message. Idéal pour les "pages de chargement".
// ----------------------------------------------------------------------------
export function FullScreenLoader({ message = "Chargement..." }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6">
      <SpinnerRing size={72} />
      <p className="text-lg font-medium text-slate-600">{message}</p>
    </div>
  );
}
