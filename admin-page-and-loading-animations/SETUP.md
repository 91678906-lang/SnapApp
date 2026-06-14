# 🚀 Connecter Snapapp à Supabase (tu as déjà créé le projet ✅)

Tu as déjà ton projet **SnapAPP** sur Supabase. Bravo ! 🎉
Il reste **3 petites étapes**. Suis-les dans l'ordre.

---

## ① Crée la table qui rangera les demandes

1. Dans ton projet Supabase, ouvre le menu de gauche → **« SQL Editor »**
   (l'icône `>_`).
2. Clique **« New query »**, **colle tout ce bloc** ci-dessous, puis clique
   **« Run »** (ou Ctrl+Entrée) :

```sql
-- Crée la table des messages
create table messages (
  id uuid primary key default gen_random_uuid(),
  prenom text,
  nom text,
  email text,
  ville text,
  word1 text,
  word2 text,
  created_at timestamptz default now()
);

-- Autorise le site à lire/écrire (simple, parfait pour un petit projet)
alter table messages enable row level security;

create policy "tout le monde peut envoyer"
  on messages for insert with check (true);

create policy "tout le monde peut lire"
  on messages for select using (true);

create policy "tout le monde peut supprimer"
  on messages for delete using (true);

-- Active le TEMPS RÉEL sur cette table
alter publication supabase_realtime add table messages;
```

3. Tu dois voir un message « Success ». ✅

---

## ② Copie tes 2 valeurs dans le projet

1. Dans Supabase, menu de gauche tout en bas → ⚙️ **« Project Settings »** →
   **« API »** (ou « Data API »).
2. Copie :
   - **Project URL** (ex : `https://hlzoczlqlpfnunvlhtfo.supabase.co`)
   - **anon public** (la clé sous « Project API keys » — une très longue suite)
3. Colle-les dans le fichier **`src/lib/supabase-config.ts`** :

```ts
export const SUPABASE_URL = "colle ici ton Project URL";
export const SUPABASE_ANON_KEY = "colle ici ta clé anon public";
```

---

## ③ Remets le site en ligne

```
npm run build
```
Puis va sur 👉 **https://app.netlify.com/drop** et **glisse ton dossier `dist`**.

> ⚠️ À chaque fois que tu changes une valeur : refais `npm run build`
> ET re-glisse le dossier `dist`, sinon le site en ligne ne change pas.

---

## ✅ Teste !

- Sur ton **téléphone** : remplis le formulaire.
- Sur ton **ordi** : page admin (petit cadenas en bas de page) → mot de passe
  **`patate123`** → ta demande apparaît **instantanément** ! 🎉
- Actualise la page → **tout reste**. ✅

> Le bandeau admin doit afficher **« 🟢 En ligne (Supabase) »**.
> Si c'est « 🟡 local », tes 2 valeurs ne sont pas bonnes, ou tu as oublié
> de remettre le site en ligne.

---

## ❓ Un souci ?

- **Erreur dans la console / rien ne s'enregistre** → vérifie que tu as bien
  lancé tout le bloc SQL de l'étape ①.
- **Toujours en mode local** → un `"À_REMPLIR"` traîne encore dans
  `src/lib/supabase-config.ts`.
- Pour voir les demandes côté Supabase : menu **« Table Editor » → messages**.
