# Back office : mise en place

Back office caché pour ajouter / modifier / ordonner / publier les projets sans toucher au code.

## 1. Base de données (une seule fois)

phpMyAdmin → base `jh6rkj_portfolio` → onglet **SQL** → coller le contenu de
[`001_backoffice.sql`](001_backoffice.sql) → Exécuter.

- Ajoute les colonnes manquantes à `projects` (slug, accroche, rôle, contexte, galerie…).
- Les anciennes lignes (ids 1 → 10) sont **conservées en brouillon** (`ancien-projet-N`) :
  supprimez-les ou reprenez-les depuis le back office.
- Insère les 7 projets actuels du site, publiés.
- Crée `admin_users` et `admin_login_attempts`.

Puis [`002_no_em_dash.sql`](002_no_em_dash.sql) une fois (retire les tirets cadratins des textes en base).

Puis [`003_boardtheboat_gamestats_playtest.sql`](003_boardtheboat_gamestats_playtest.sql) : ajoute
boardtheboat et Gamestats (publiés) et complète Playtest (lien en ligne, description).
Les images sont dans `public/projects/boardtheboat/` et `public/projects/gamestats/`.

Puis [`004_english.sql`](004_english.sql) : version anglaise du site (langue par défaut). Ajoute les colonnes
`title_en`, `subtitle_en`, `category_en`, `context_en`, `role_en`, `description_en`, `highlights_en`
et les remplit pour les projets actuels. **À exécuter avant de pousser le code** qui enregistre ces colonnes,
sinon l'enregistrement d'un projet depuis le back office échoue. Ne réécrit jamais un projet dont la description
anglaise est déjà remplie. Ensuite, les textes anglais se modifient dans le back office (section « Version anglaise ») ;
un champ anglais vide reprend le texte français.

## 2. Compte admin

```bash
npm run admin:create
```

Demande identifiant + mot de passe (12 caractères min.), affiche une requête `INSERT`
avec le mot de passe **haché bcrypt** → la coller dans phpMyAdmin. Relancer la commande
pour changer de mot de passe (même identifiant = mise à jour).

**Identifiant oublié ?** phpMyAdmin → table `admin_users` → colonne `username`.
**Mot de passe oublié ?** Il n'est stocké nulle part en clair (ni dépôt, ni GitHub) : relancer
`npm run admin:create` avec le même identifiant et un nouveau mot de passe, coller la requête.
Login et mot de passe ne vont **jamais** dans le dépôt ni dans une variable GitHub.

## 3. Secrets GitHub (Settings → Secrets and variables → Actions)

| Nom | Type | Valeur |
|---|---|---|
| `DB_PASSWORD` | Secret (**obligatoire**) | mot de passe MariaDB de `jh6rkj_basile` |
| `DB_HOST` / `DB_NAME` / `DB_USER` | Secret (optionnel) | défauts : `jh6rkj.myd.infomaniak.com` / `jh6rkj_portfolio` / `jh6rkj_basile` |
| `ADMIN_PATH` | **Variable** (optionnel) | URL cachée du back office, ex. `atelier-x9k2` (défaut `studio`) |

Le workflow génère `dist/api/config.php` au déploiement : le mot de passe n'est jamais dans le dépôt.
Sans `DB_PASSWORD`, l'API ne répond pas et la page Projets affiche « momentanément indisponibles » (plus de liste statique : la base est la seule source).

## 4. Utilisation

`https://basileferi.fr/studio` (ou `/<ADMIN_PATH>`) → connexion → **+ Nouveau projet**.
Images déposées = redimensionnées (WebP, ≤ 2400 px) puis stockées dans `/uploads/projects/`
(jamais écrasées par les déploiements). Un brouillon se prévisualise via le bouton **Aperçu**.

## Sécurité

HTTPS obligatoire, cookie de session `HttpOnly` + `SameSite=Strict` limité à `/api/`,
jeton CSRF sur chaque écriture, 5 essais / 15 min par IP, HTML des descriptions nettoyé
côté serveur, uploads vérifiés (type réel) et non exécutables, `noindex` sur le back office.

## Développement local

```bash
cp public/api/config.example.php public/api/config.php   # puis renseigner db_pass
npm run api:dev   # PHP sur :8000 (sert public/ + l'API)
npm run dev       # Vite proxifie /api et /uploads vers :8000
```

Infomaniak peut refuser les connexions MariaDB externes : sans base joignable,
aucun projet ne s'affiche. Pour voir les projets en ligne en local : `VITE_API_PROXY=https://basileferi.fr npm run dev`.
