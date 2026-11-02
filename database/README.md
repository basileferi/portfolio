# Back office — mise en place

Back office caché pour ajouter / modifier / ordonner / publier les projets sans toucher au code.

## 1. Base de données (une seule fois)

phpMyAdmin → base `jh6rkj_portfolio` → onglet **SQL** → coller le contenu de
[`001_backoffice.sql`](001_backoffice.sql) → Exécuter.

- Ajoute les colonnes manquantes à `projects` (slug, accroche, rôle, contexte, galerie…).
- Les anciennes lignes (ids 1 → 10) sont **conservées en brouillon** (`ancien-projet-N`) :
  supprimez-les ou reprenez-les depuis le back office.
- Insère les 7 projets actuels du site, publiés.
- Crée `admin_users` et `admin_login_attempts`.

## 2. Compte admin

```bash
npm run admin:create
```

Demande identifiant + mot de passe (12 caractères min.), affiche une requête `INSERT`
avec le mot de passe **haché bcrypt** → la coller dans phpMyAdmin. Relancer la commande
pour changer de mot de passe (même identifiant = mise à jour).

## 3. Secrets GitHub (Settings → Secrets and variables → Actions)

| Nom | Type | Valeur |
|---|---|---|
| `DB_PASSWORD` | Secret (**obligatoire**) | mot de passe MariaDB de `jh6rkj_basile` |
| `DB_HOST` / `DB_NAME` / `DB_USER` | Secret (optionnel) | défauts : `jh6rkj.myd.infomaniak.com` / `jh6rkj_portfolio` / `jh6rkj_basile` |
| `ADMIN_PATH` | **Variable** (optionnel) | URL cachée du back office, ex. `atelier-x9k2` (défaut `studio-43cc16`) |

Le workflow génère `dist/api/config.php` au déploiement : le mot de passe n'est jamais dans le dépôt.
Sans `DB_PASSWORD`, le site reste fonctionnel avec la liste statique `src/data/projects.js`.

## 4. Utilisation

`https://basileferi.fr/<ADMIN_PATH>` → connexion → **+ Nouveau projet**.
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
le site retombe sur la liste statique et le back office affiche une erreur.
