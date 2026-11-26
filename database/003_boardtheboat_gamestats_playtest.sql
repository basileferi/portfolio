-- =====================================================================
-- Adds boardtheboat and Gamestats, completes Playtest (live link, text).
-- Run once in phpMyAdmin on `jh6rkj_portfolio` (SQL tab).
-- Safe to re-run: INSERT IGNORE never overwrites a project already
-- edited in the back office; the Playtest UPDATE rewrites its texts.
-- Images: public/projects/boardtheboat/*.webp, public/projects/gamestats/*.webp
-- (shipped with the next push of the site).
-- =====================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- 1. boardtheboat -------------------------------------------------------
INSERT IGNORE INTO `projects`
  (`title`, `slug`, `subtitle`, `category`, `year`, `context`, `role`, `tech_stack`,
   `image_url`, `media`, `video_url`, `repo_link`, `live_demo_link`,
   `description`, `highlights`, `published`, `sort_order`, `created_at`)
VALUES
('boardtheboat', 'boardtheboat', 'Carnet de bord pour décrocher un stage ou une alternance tech',
 'Développement Web', '2026', 'Projet étudiant - BUT, semestre 5', 'Développeur full-stack',
 'Symfony 8, PHP 8.4, MariaDB, Doctrine, Twig, Turbo, Stimulus, Messenger, JWT, GitHub Actions',
 '/projects/boardtheboat/1.webp',
 '["/projects/boardtheboat/1.webp","/projects/boardtheboat/2.webp","/projects/boardtheboat/3.webp"]',
 NULL, 'https://github.com/basileferi/boardtheboat', 'https://boardtheboat.basileferi.fr',
 '<p><strong>boardtheboat</strong> est un carnet de bord pour trouver un stage ou une alternance dans la tech. Chaque nuit, l''application interroge des sources publiques et gratuites, dédoublonne les entreprises et classe les offres selon le profil de l''utilisateur : à l''ouverture, la liste est déjà prête, qu''il s''agisse d''une offre publiée ou d''une candidature spontanée.</p>\n<p>Projet conçu et développé seul de bout en bout, du modèle de données à la mise en production, avec chaque choix d''architecture documenté dans un ADR.</p>\n<h3>Pipeline de données</h3>\n<ul><li><strong>Cinq sources :</strong> The Muse, Himalayas, Arbeitnow, France Travail (OAuth2) et l''API Recherche d''entreprises, chacune isolée derrière une interface commune et convertie en DTO.</li><li><strong>Fusion :</strong> import idempotent, dédoublonnage des entreprises par SIREN, puis domaine, puis nom normalisé, et filtre des intitulés tech et des contrats stage ou alternance.</li><li><strong>Classement :</strong> score de pertinence par profil et vérification des pages carrières des entreprises sans offre publiée, dans le respect du robots.txt.</li><li><strong>Exécution :</strong> Symfony Messenger et Scheduler, sans worker permanent sur l''hébergement mutualisé ; chaque exécution est historisée et les échecs sont signalés à l''administrateur.</li></ul>\n<h3>Application</h3>\n<ul><li><strong>Suivi des candidatures :</strong> une candidature envoyée programme sa relance, l''échéance arrive dans le carnet avec un brouillon de message prêt à copier.</li><li><strong>Interface :</strong> Twig, Turbo et Stimulus servis par AssetMapper, sans build Node. Site bilingue FR / EN, thème clair ou sombre, transitions entre les pages et sons générés avec la Web Audio API, désactivés quand l''utilisateur demande moins d''animations.</li><li><strong>API REST</strong> authentifiée par JWT, en plus des sessions classiques.</li></ul>\n<h3>Sécurité et qualité</h3>\n<ul><li>Content Security Policy stricte, limitation de débit sur l''authentification, voters Symfony pour que chacun n''accède qu''à ses propres données, aucune donnée nominative de dirigeant importée.</li><li>PHPStan niveau 8, vérification du style de code, lint Twig, YAML, conteneur et schéma Doctrine, <code>composer audit</code> et tests PHPUnit à chaque push.</li></ul>\n<h3>Mise en production</h3>\n<p>Pipeline CI/CD GitHub Actions : scan des secrets, contrôle qualité sur PHP 8.4 et MariaDB 10.6 comme en production, construction d''une archive sans dépendances de développement, puis déploiement après validation manuelle. Chaque version est publiée de façon atomique sur Infomaniak (un dossier par release et bascule d''un lien symbolique), la base est sauvegardée avant chaque migration et le retour arrière tient en une commande.</p>',
 'Pipeline nocturne sur cinq sources publiques et gratuites\nDédoublonnage des entreprises par SIREN, domaine et nom\nRelances de candidature planifiées dans le carnet\nSymfony 8, PHP 8.4, PHPStan niveau 8\nCSP stricte, rate limiting et contrôle d''accès par voters\nCI/CD GitHub Actions avec déploiement atomique et retour arrière',
 1, 3, '2026-09-29 00:00:00');

-- 2. Gamestats ----------------------------------------------------------
INSERT IGNORE INTO `projects`
  (`title`, `slug`, `subtitle`, `category`, `year`, `context`, `role`, `tech_stack`,
   `image_url`, `media`, `video_url`, `repo_link`, `live_demo_link`,
   `description`, `highlights`, `published`, `sort_order`, `created_at`)
VALUES
('Gamestats', 'gamestats', 'Data storytelling animé sur le jeu vidéo indépendant',
 'Motion Design', '2026', 'Projet étudiant - intégration web et motion design', 'Illustration, motion design & intégration',
 'Adobe Illustrator, After Effects, Lottie, GSAP, Chart.js, HTML & CSS, JavaScript',
 '/projects/gamestats/1.webp',
 '["/projects/gamestats/1.webp","/projects/gamestats/2.webp","/projects/gamestats/3.webp","/projects/gamestats/4.webp"]',
 NULL, 'https://github.com/basileferi/GameStats', 'https://gamestats.basileferi.fr',
 '<p><strong>Gamestats</strong> est un site de data storytelling animé qui répond à une question : <em>pourquoi les studios indépendants sont-ils essentiels à l''industrie du jeu vidéo ?</em> Huit écrans déroulent les chiffres clés du secteur en France (joueurs, chiffre d''affaires, budgets, récompenses, sorties, emploi), chacun relié à sa source.</p>\n<h3>Illustration et motion design</h3>\n<ul><li><strong>Illustrations originales</strong> dessinées sur Adobe Illustrator : boîte de jeu, label « certifié indépendant », carte de France reliée au clavier, à la manette et à la console, trophée.</li><li><strong>Animations</strong> réalisées sur After Effects puis exportées en JSON Lottie : des animations vectorielles légères, nettes à toutes les tailles d''écran.</li><li><strong>Direction artistique</strong> cohérente entre illustrations, graphiques et interface : palette orange, crème et rouge, titres en typographie display.</li></ul>\n<h3>Intégration</h3>\n<ul><li><strong>Navigation plein écran</strong> en scroll snap vertical, une statistique par écran, avec un indicateur de progression.</li><li><strong>Animations d''entrée GSAP</strong> rejouées à chaque section : titres révélés avec ScrambleText, textes découpés avec SplitText, illustrations Lottie lancées au bon moment.</li><li><strong>Graphiques Chart.js</strong> (aire polaire pour les budgets, histogramme pour l''emploi) aux couleurs de la charte.</li><li><strong>JavaScript orienté objet :</strong> chaque écran est décrit par une configuration et rendu par une classe <code>StatSection</code>, ajouter une statistique ne demande que quelques lignes.</li><li><strong>Responsive</strong>, hauteur d''écran corrigée sur mobile, bibliothèques et polices servies en local.</li></ul>',
 'Illustrations originales dessinées sur Adobe Illustrator\nAnimations After Effects exportées en Lottie\nEntrées animées GSAP : ScrambleText et SplitText\nGraphiques Chart.js intégrés à la direction artistique\nNavigation plein écran en scroll snap\nChaque chiffre relié à sa source',
 1, 4, '2026-01-09 00:00:00');

-- 3. Playtest: live link and complete page --------------------------------
UPDATE `projects` SET
  `live_demo_link` = 'https://playtest.basileferi.fr',
  `repo_link`      = 'https://github.com/basileferi/playtest',
  `context`        = 'Projet étudiant - SAÉ 203',
  `tech_stack`     = 'PHP, MariaDB, PDO, HTML & CSS, JavaScript, GitHub Actions',
  `description`    = '<p><strong>Playtest</strong> est une plateforme communautaire de notation de jeux vidéo. Les visiteurs parcourent le catalogue et consultent la fiche de chaque jeu ; une fois inscrits, ils notent les jeux sur 5 et laissent un commentaire. La note moyenne de chaque jeu est recalculée à chaque nouvel avis.</p>\n<h3>Fonctionnalités</h3>\n<ul><li><strong>Catalogue</strong> de jeux avec filtre des mieux notés et recherche par titre.</li><li><strong>Fiche jeu :</strong> visuel, note moyenne calculée en SQL et liste des avis de la communauté.</li><li><strong>Comptes :</strong> inscription, connexion par session PHP et page « mes notes » pour retrouver ses avis.</li></ul>\n<h3>Technique</h3>\n<ul><li>PHP sans framework et MariaDB, requêtes préparées PDO contre les injections SQL.</li><li>Configuration de la base sortie du code source et protégée côté serveur.</li><li>Remis en ligne sur Infomaniak avec un déploiement automatique GitHub Actions : vérification de la syntaxe PHP puis synchronisation rsync via SSH à chaque push.</li></ul>',
  `highlights`     = 'Comptes utilisateurs et authentification\nNotation sur 5 et commentaires\nNote moyenne recalculée à chaque avis\nRecherche et filtre des jeux les mieux notés\nRequêtes préparées PDO sur MariaDB\nDéploiement continu GitHub Actions vers Infomaniak',
  `published`      = 1,
  `updated_at`     = CURRENT_TIMESTAMP
WHERE `slug` = 'playtest';
