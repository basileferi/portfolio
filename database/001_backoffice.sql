-- =====================================================================
-- Back office migration — run ONCE in phpMyAdmin on `jh6rkj_portfolio`
-- (MariaDB 10.6). Non destructive: existing rows are kept and become
-- drafts (published = 0) so you can review / delete them from the back office.
-- Safe to re-run: every statement is idempotent.
-- =====================================================================

SET NAMES utf8mb4;
SET time_zone = '+00:00';

-- 1. Full Unicode (emoji, typographic quotes…) ------------------------
ALTER TABLE `projects` CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. New columns -------------------------------------------------------
ALTER TABLE `projects`
  ADD COLUMN IF NOT EXISTS `slug`       varchar(191) NULL AFTER `title`,
  ADD COLUMN IF NOT EXISTS `subtitle`   varchar(255) NULL AFTER `slug`,
  ADD COLUMN IF NOT EXISTS `highlights` text NULL AFTER `description`,
  ADD COLUMN IF NOT EXISTS `media`      text NULL AFTER `image_url`,
  ADD COLUMN IF NOT EXISTS `video_url`  varchar(255) NULL AFTER `media`,
  ADD COLUMN IF NOT EXISTS `year`       varchar(16) NULL AFTER `category`,
  ADD COLUMN IF NOT EXISTS `context`    varchar(120) NULL AFTER `year`,
  ADD COLUMN IF NOT EXISTS `role`       varchar(120) NULL AFTER `context`,
  ADD COLUMN IF NOT EXISTS `published`  tinyint(1) NOT NULL DEFAULT 0 AFTER `role`,
  ADD COLUMN IF NOT EXISTS `sort_order` int(11) NOT NULL DEFAULT 0 AFTER `published`,
  ADD COLUMN IF NOT EXISTS `updated_at` timestamp NULL DEFAULT NULL AFTER `created_at`;

ALTER TABLE `projects` MODIFY `tech_stack` varchar(500) NULL;

-- Legacy rows get a slug so the unique index can be created.
UPDATE `projects` SET `slug` = CONCAT('ancien-projet-', `id`) WHERE `slug` IS NULL OR `slug` = '';
ALTER TABLE `projects` MODIFY `slug` varchar(191) NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS `uniq_projects_slug` ON `projects` (`slug`);
CREATE INDEX IF NOT EXISTS `idx_projects_listing` ON `projects` (`published`, `sort_order`);

-- 3. Admin accounts ----------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id`            int(11) NOT NULL AUTO_INCREMENT,
  `username`      varchar(64) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `created_at`    timestamp NOT NULL DEFAULT current_timestamp(),
  `last_login_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uniq_admin_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS `admin_login_attempts` (
  `id`           int(11) NOT NULL AUTO_INCREMENT,
  `ip`           varchar(45) NOT NULL,
  `attempted_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `idx_attempts_ip_time` (`ip`, `attempted_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. Current portfolio projects (same content as src/data/projects.js) --
INSERT IGNORE INTO `projects`
  (`title`, `slug`, `subtitle`, `category`, `year`, `context`, `role`, `tech_stack`,
   `image_url`, `media`, `video_url`, `repo_link`, `live_demo_link`,
   `description`, `highlights`, `published`, `sort_order`, `created_at`)
VALUES
('ESOP - G2eLab', 'esop-g2elab', 'Application métier pour la recherche scientifique',
 'Développement Web', '2025', 'Stage — G2eLab, Grenoble INP', 'Développeur full-stack',
 'Vue 3, FastAPI (Python), RESTful API, Swagger / OpenAPI',
 '/projects/esop-g2elab/preview.svg', '[]', NULL, NULL, 'https://esop.g2elab.grenoble-inp.fr/',
 '<p>Stage d''immersion professionnelle de huit semaines au <strong>G2eLab</strong> (Laboratoire de Génie Électrique de Grenoble), laboratoire spécialisé dans les microréseaux (<em>smart grids</em>).</p>\n<p>Mission : rendre accessible une bibliothèque de calcul scientifique propriétaire via une interface moderne, en livrant un outil fonctionnel qui simplifie le travail quotidien d''un chercheur.</p>\n<h3>Architecture</h3>\n<ul><li><strong>Backend - FastAPI (Python) :</strong> API RESTful haute performance avec documentation Swagger automatique. Interfacée avec la bibliothèque de calcul interne, les résultats complexes sont traduits en structures JSON exploitables.</li><li><strong>Frontend - Vue 3 (SPA) :</strong> Interface responsive permettant la visualisation dynamique des simulations sous deux formes — graphique (courbes de charge) et scalaire (métriques de performance).</li></ul>\n<h3>Apports</h3>\n<p>Ce stage a confirmé mon envie de continuer vers la création de logiciels appliqués à la science : manipuler des données, collaborer avec un expert du domaine, et livrer un outil robuste de A à Z en autonomie.</p>',
 'Stage de 8 semaines en laboratoire de recherche (smart grids)\nAPI REST FastAPI avec documentation Swagger automatique\nSPA Vue 3 de visualisation des simulations : courbes et métriques\nOutil livré de A à Z en autonomie',
 1, 0, '2025-06-01 00:00:00'),

('Kosmo.', 'kosmo', 'Portfolio 3D interactif — site actuel',
 'Développement Web', '2024', 'Projet personnel', 'Design & développement',
 'Vue 3, Three.js, GSAP, Tailwind CSS, Pinia, Vite, PHP, MariaDB',
 '/projects/kosmo/preview.png', '[]', NULL, NULL, NULL,
 '<p>Développement et conception d''une expérience 3D immersive pour présenter mes projets. Optimisation des performances de rendu Three.js, réduisant les temps de chargement de la scène de 30 %. Déploiement sur Infomaniak via un pipeline CI/CD simple avec GitHub Actions.</p>',
 'Scène Three.js avec post-processing (grain, scanlines, aberration chromatique)\nTemps de chargement de la scène réduit de 30 %\nDéploiement continu GitHub Actions → Infomaniak\nBack-office PHP / MariaDB pour gérer les projets',
 1, 1, '2024-09-01 00:00:00'),

('Playtest', 'playtest', 'Site de notation de jeux vidéo',
 'Développement Web', '2024', 'Projet étudiant', 'Développeur full-stack',
 'PHP, MariaDB, HTML & CSS, JavaScript',
 '/projects/playtest/1.png', '["/projects/playtest/1.png","/projects/playtest/2.png"]', NULL,
 'https://github.com/basileferi/playtest', NULL,
 '<p>Plateforme communautaire permettant aux utilisateurs de se connecter, noter des jeux sur 5 et laisser des commentaires. Calcul de la note moyenne en temps réel, base de données MariaDB, architecture complète MVC.</p>',
 'Comptes utilisateurs et authentification\nNotation sur 5 et commentaires\nNote moyenne recalculée en temps réel\nArchitecture MVC et base MariaDB',
 1, 2, '2024-05-01 00:00:00'),

('SuitLimbo', 'suitlimbo', 'Gestion de contenus et déploiement AWS',
 'Développement Web', '2024', 'Projet étudiant', 'Intégration & déploiement',
 'WordPress, Elementor, Amazon Web Services',
 '/projects/suitlimbo/2.png',
 '["/projects/suitlimbo/1.png","/projects/suitlimbo/2.png","/projects/suitlimbo/3.png","/projects/suitlimbo/4.png","/projects/suitlimbo/5.png","/projects/suitlimbo/6.png","/projects/suitlimbo/7.png","/projects/suitlimbo/8.png","/projects/suitlimbo/9.png"]',
 NULL, NULL, NULL,
 '<p>Site e-commerce de costumes développé avec WordPress et l''extension Elementor. Déploiement et hébergement sur Amazon Web Services.</p>',
 'Boutique e-commerce WordPress + Elementor\nHébergement et déploiement sur Amazon Web Services',
 1, 3, '2024-03-01 00:00:00'),

('E-commerce Sneakers', 'boutique-sneakers', 'Boutique e-commerce dynamique avec gestion CSV',
 'Développement Web', '2023', 'Projet étudiant', 'Développeur web',
 'HTML, CSS, PHP, JavaScript, Bootstrap',
 '/projects/boutique-sneakers/preview.png', '[]', 'https://www.youtube-nocookie.com/embed/y2tu4FJsBso', NULL, NULL,
 '<p>Site e-commerce dynamique chargeant les produits depuis un fichier CSV. Système de panier, tri JavaScript en page boutique, et header changeant de couleur selon l''heure de connexion de l''utilisateur.</p>',
 'Catalogue produits chargé depuis un fichier CSV\nPanier et tri des produits en JavaScript\nHeader dont la couleur suit l''heure de connexion',
 1, 4, '2023-12-01 00:00:00'),

('Leaflet.js', 'leaflet-manuel', 'Manuel d''utilisation du plugin Leaflet.js',
 'Développement Web', '2023', 'Projet étudiant', 'Rédaction & intégration',
 'JavaScript, HTML & CSS',
 '/projects/Manuel/leaflet.png', '[]', NULL, NULL, '/projects/Manuel/man.html',
 '<p>Création d''un site web servant de manuel d''utilisation pour intégrer le plugin Leaflet.js à un site web.</p>',
 'Documentation pas à pas pour intégrer une carte Leaflet.js\nExemples de code interactifs',
 1, 5, '2023-06-01 00:00:00'),

('Tyler, The Creator', 'tyler-the-creator', 'Mini-site vitrine pour un artiste',
 'Développement Web', '2023', 'Projet étudiant', 'Intégration',
 'HTML & CSS',
 '/projects/MiniSite/img/chromakopia_2.jpg', '[]', NULL, NULL, '/projects/MiniSite/html_mini_site/index.html',
 '<p>Promotion d''un artiste via un mini-site web intégrant un formulaire de contact et des animations CSS.</p>',
 'Mini-site vitrine responsive\nFormulaire de contact et animations CSS',
 1, 6, '2023-03-01 00:00:00');

-- 5. Admin account ------------------------------------------------------
-- Generate the INSERT with:   npm run admin:create
-- then paste it here / in phpMyAdmin. Never store a clear-text password.
