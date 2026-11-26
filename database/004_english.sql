-- =====================================================================
-- English version of the site: adds the *_en columns to `projects` and
-- fills them for the current projects.
-- Run ONCE in phpMyAdmin on `jh6rkj_portfolio` (SQL tab), BEFORE pushing
-- the code that saves these columns (otherwise back-office saves fail).
-- Safe to re-run: columns are added only if missing, and a project whose
-- English description is already filled (back office) is never overwritten.
-- Empty English fields fall back to French on the site.
-- =====================================================================

SET NAMES utf8mb4;

-- 1. Columns -----------------------------------------------------------
ALTER TABLE `projects`
  ADD COLUMN IF NOT EXISTS `title_en`       varchar(255) NULL AFTER `title`,
  ADD COLUMN IF NOT EXISTS `subtitle_en`    varchar(255) NULL AFTER `subtitle`,
  ADD COLUMN IF NOT EXISTS `category_en`    varchar(255) NULL AFTER `category`,
  ADD COLUMN IF NOT EXISTS `context_en`     varchar(120) NULL AFTER `context`,
  ADD COLUMN IF NOT EXISTS `role_en`        varchar(120) NULL AFTER `role`,
  ADD COLUMN IF NOT EXISTS `description_en` mediumtext   NULL AFTER `description`,
  ADD COLUMN IF NOT EXISTS `highlights_en`  text         NULL AFTER `highlights`;

-- 2. English texts ------------------------------------------------------
-- esop-g2elab
UPDATE `projects` SET
  `subtitle_en`    = 'Custom web application for scientific research',
  `category_en`    = 'Web Development',
  `context_en`     = 'Internship - G2eLab, Grenoble INP',
  `role_en`        = 'Full-stack developer',
  `highlights_en`  = '8-week internship in a research laboratory (smart grids)\nFastAPI REST API with automatic Swagger documentation\nVue 3 SPA to visualise simulations: curves and metrics\nTool delivered end to end, independently',
  `description_en` = '<p>Eight-week professional immersion internship at <strong>G2eLab</strong> (Grenoble Electrical Engineering Laboratory), a lab specialising in microgrids (<em>smart grids</em>).</p>\n<p>Mission: make a proprietary scientific computing library accessible through a modern interface, by delivering a working tool that simplifies a researcher''s day-to-day work.</p>\n<h3>Architecture</h3>\n<ul><li><strong>Backend - FastAPI (Python):</strong> high-performance RESTful API with automatic Swagger documentation. Connected to the in-house computing library, it turns complex results into usable JSON structures.</li><li><strong>Frontend - Vue 3 (SPA):</strong> responsive interface that visualises simulations dynamically in two forms: charts (load curves) and scalar values (performance metrics).</li></ul>\n<h3>What I took away</h3>\n<p>This internship confirmed that I want to keep building software applied to science: working with data, collaborating with a domain expert and delivering a robust tool from start to finish, on my own.</p>'
WHERE `slug` = 'esop-g2elab' AND COALESCE(`description_en`, '') = '';

-- kosmo
UPDATE `projects` SET
  `subtitle_en`    = 'Interactive 3D portfolio - this website',
  `category_en`    = 'Web Development',
  `context_en`     = 'Personal project',
  `role_en`        = 'Design & development',
  `highlights_en`  = 'Three.js scene with post-processing (grain, scanlines, chromatic aberration)\nScene load time cut by 30%\nContinuous deployment with GitHub Actions → Infomaniak\nPHP / MariaDB back office to manage projects',
  `description_en` = '<p>Design and development of an immersive 3D experience to showcase my projects. I optimised Three.js rendering performance, cutting scene load times by 30%, and the site is deployed to Infomaniak through a simple CI/CD pipeline with GitHub Actions.</p>'
WHERE `slug` = 'kosmo' AND COALESCE(`description_en`, '') = '';

-- playtest
UPDATE `projects` SET
  `subtitle_en`    = 'Video game rating website',
  `category_en`    = 'Web Development',
  `context_en`     = 'Student project - SAÉ 203',
  `role_en`        = 'Full-stack developer',
  `highlights_en`  = 'User accounts and authentication\nRatings out of 5 and comments\nAverage rating recalculated with every review\nSearch and filter for the top-rated games\nPDO prepared statements on MariaDB\nContinuous deployment with GitHub Actions to Infomaniak',
  `description_en` = '<p><strong>Playtest</strong> is a community platform for rating video games. Visitors browse the catalogue and open each game''s page; once signed up, they rate games out of 5 and leave a comment. Each game''s average rating is recalculated with every new review.</p>\n<h3>Features</h3>\n<ul><li><strong>Game catalogue</strong> with a top-rated filter and search by title.</li><li><strong>Game page:</strong> artwork, average rating computed in SQL and the list of community reviews.</li><li><strong>Accounts:</strong> sign-up, login with PHP sessions and a "My ratings" page to find your reviews.</li></ul>\n<h3>Under the hood</h3>\n<ul><li>Framework-free PHP and MariaDB, with PDO prepared statements to prevent SQL injection.</li><li>Database configuration kept out of the source code and protected on the server.</li><li>Brought back online on Infomaniak with automatic GitHub Actions deployment: PHP syntax check, then rsync over SSH on every push.</li></ul>'
WHERE `slug` = 'playtest' AND COALESCE(`description_en`, '') = '';

-- boardtheboat
UPDATE `projects` SET
  `subtitle_en`    = 'A logbook for landing a tech internship or work-study placement',
  `category_en`    = 'Web Development',
  `context_en`     = 'Student project - BUT, semester 5',
  `role_en`        = 'Full-stack developer',
  `highlights_en`  = 'Nightly pipeline across five free, public data sources\nCompany deduplication by SIREN number, domain and name\nScheduled application follow-ups in the logbook\nSymfony 8, PHP 8.4, PHPStan level 8\nStrict CSP, rate limiting and voter-based access control\nGitHub Actions CI/CD with atomic deployment and rollback',
  `description_en` = '<p><strong>boardtheboat</strong> is a logbook for finding an internship or a work-study placement in tech. Every night, the app queries free public sources, deduplicates companies and ranks openings against the user''s profile: when they open it, the list is already waiting, whether it''s a published offer or a company worth a speculative application.</p>\n<p>Designed and built solo from end to end, from the data model to production, with every architecture decision documented in an ADR.</p>\n<h3>Data pipeline</h3>\n<ul><li><strong>Five sources:</strong> The Muse, Himalayas, Arbeitnow, France Travail (OAuth2) and the French government''s company search API (Recherche d''entreprises), each isolated behind a common interface and mapped to DTOs.</li><li><strong>Merging:</strong> idempotent import, company deduplication by SIREN number (the French company ID), then domain, then normalised name, plus filtering on tech job titles and internship or work-study contracts.</li><li><strong>Ranking:</strong> relevance score per profile, and checks of the careers pages of companies with no published offer, in line with robots.txt.</li><li><strong>Execution:</strong> Symfony Messenger and Scheduler, with no long-running worker on the shared hosting; every run is logged and failures are reported to the administrator.</li></ul>\n<h3>Application</h3>\n<ul><li><strong>Application tracking:</strong> sending an application schedules its follow-up; when it is due, it shows up in the logbook with a draft message ready to copy.</li><li><strong>Interface:</strong> Twig, Turbo and Stimulus served by AssetMapper, with no Node build. Bilingual FR / EN site, light or dark theme, page transitions and sounds generated with the Web Audio API, turned off when the user asks for reduced motion.</li><li><strong>REST API</strong> secured with JWT, alongside classic sessions.</li></ul>\n<h3>Security and quality</h3>\n<ul><li>Strict Content Security Policy, rate limiting on authentication, Symfony voters so that everyone can only access their own data, and no personal data about company directors imported.</li><li>PHPStan level 8, code style checks, Twig, YAML, container and Doctrine schema linting, <code>composer audit</code> and PHPUnit tests on every push.</li></ul>\n<h3>Going live</h3>\n<p>GitHub Actions CI/CD pipeline: secret scanning, quality checks on PHP 8.4 and MariaDB 10.6 to match production, a build archive without development dependencies, then deployment after manual approval. Each release is published atomically on Infomaniak (one folder per release and a symlink switch), the database is backed up before every migration and rolling back takes a single command.</p>'
WHERE `slug` = 'boardtheboat' AND COALESCE(`description_en`, '') = '';

-- gamestats
UPDATE `projects` SET
  `subtitle_en`    = 'Animated data storytelling about independent video games',
  `category_en`    = 'Motion Design',
  `context_en`     = 'Student project - web integration and motion design',
  `role_en`        = 'Illustration, motion design & web integration',
  `highlights_en`  = 'Original illustrations drawn in Adobe Illustrator\nAfter Effects animations exported to Lottie\nAnimated GSAP entrances: ScrambleText and SplitText\nChart.js charts blended into the art direction\nFull-screen scroll-snap navigation\nEvery figure linked to its source',
  `description_en` = '<p><strong>Gamestats</strong> is an animated data storytelling website built around one question: <em>why are independent studios essential to the video game industry?</em> Eight screens unfold the key figures of the sector in France (players, revenue, budgets, awards, releases, jobs), each linked to its source.</p>\n<h3>Illustration and motion design</h3>\n<ul><li><strong>Original illustrations</strong> drawn in Adobe Illustrator: a game box, a "certified indie" badge, a map of France connected to a keyboard, a controller and a console, and a trophy.</li><li><strong>Animations</strong> made in After Effects and exported as Lottie JSON: lightweight vector animations that stay crisp at any screen size.</li><li><strong>Consistent art direction</strong> across illustrations, charts and interface: an orange, cream and red palette, with display typography for headings.</li></ul>\n<h3>Integration</h3>\n<ul><li><strong>Full-screen navigation</strong> with vertical scroll snap, one statistic per screen and a progress indicator.</li><li><strong>GSAP entrance animations</strong> replayed on each section: headings revealed with ScrambleText, text split with SplitText, Lottie illustrations triggered at the right moment.</li><li><strong>Chart.js charts</strong> (a polar area chart for budgets, a bar chart for jobs) in the brand colours.</li><li><strong>Object-oriented JavaScript:</strong> each screen is described by a configuration and rendered by a <code>StatSection</code> class, so adding a statistic only takes a few lines.</li><li><strong>Responsive</strong>, with the screen height corrected on mobile, and libraries and fonts served locally.</li></ul>'
WHERE `slug` = 'gamestats' AND COALESCE(`description_en`, '') = '';

-- leaflet-manuel
UPDATE `projects` SET
  `subtitle_en`    = 'User guide for the Leaflet.js library',
  `category_en`    = 'Web Development',
  `context_en`     = 'Student project',
  `role_en`        = 'Technical writing & integration',
  `highlights_en`  = 'Step-by-step guide to adding a Leaflet.js map to a website\nInteractive code examples',
  `description_en` = '<p>A website that serves as a user guide for adding the Leaflet.js library to a website.</p>'
WHERE `slug` = 'leaflet-manuel' AND COALESCE(`description_en`, '') = '';

-- suitlimbo
UPDATE `projects` SET
  `subtitle_en`    = 'Content management and AWS deployment',
  `category_en`    = 'Web Development',
  `context_en`     = 'Student project',
  `role_en`        = 'Integration & deployment',
  `highlights_en`  = 'WordPress + Elementor online store\nHosting and deployment on Amazon Web Services',
  `description_en` = '<p>An online suit store built with WordPress and the Elementor plugin, deployed and hosted on Amazon Web Services.</p>'
WHERE `slug` = 'suitlimbo' AND COALESCE(`description_en`, '') = '';

-- boutique-sneakers
UPDATE `projects` SET
  `title_en`       = 'Sneaker E-commerce',
  `subtitle_en`    = 'Dynamic online store powered by a CSV file',
  `category_en`    = 'Web Development',
  `context_en`     = 'Student project',
  `role_en`        = 'Web developer',
  `highlights_en`  = 'Product catalogue loaded from a CSV file\nShopping cart and product sorting in JavaScript\nHeader colour that follows the time of the visit',
  `description_en` = '<p>A dynamic e-commerce website that loads its products from a CSV file, with a shopping cart, JavaScript sorting on the shop page and a header whose colour changes with the time of the user''s visit.</p>'
WHERE `slug` = 'boutique-sneakers' AND COALESCE(`description_en`, '') = '';

-- tyler-the-creator
UPDATE `projects` SET
  `subtitle_en`    = 'Showcase mini-site for an artist',
  `category_en`    = 'Web Development',
  `context_en`     = 'Student project',
  `role_en`        = 'Integration',
  `highlights_en`  = 'Responsive showcase mini-site\nContact form and CSS animations',
  `description_en` = '<p>A mini-site promoting an artist, with a contact form and CSS animations.</p>'
WHERE `slug` = 'tyler-the-creator' AND COALESCE(`description_en`, '') = '';
