#!/usr/bin/env node
/**
 * Generates dist/api/config.php from environment variables (GitHub secrets).
 * Run after `vite build`. The DB password never lives in the repository.
 *
 *   DB_PASSWORD   (required)  MariaDB password of the DB user
 *   DB_HOST       (optional)  default jh6rkj.myd.infomaniak.com
 *   DB_NAME       (optional)  default jh6rkj_portfolio
 *   DB_USER       (optional)  default jh6rkj_basile
 */
import { writeFileSync, existsSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const env = (name, fallback = '') => (process.env[name] ?? '').trim() || fallback

const password = process.env.DB_PASSWORD ?? ''
if (!password) {
  console.warn('[write-api-config] DB_PASSWORD is not set — dist/api/config.php NOT generated.')
  console.warn('[write-api-config] The site will fall back to the static projects list.')
  process.exit(0)
}

// Single-quoted PHP string literal.
const php = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`

const config = `<?php
// Generated at deploy time by scripts/write-api-config.mjs — do not commit.
return [
    'db_host' => ${php(env('DB_HOST', 'jh6rkj.myd.infomaniak.com'))},
    'db_port' => ${Number(env('DB_PORT', '3306')) || 3306},
    'db_name' => ${php(env('DB_NAME', 'jh6rkj_portfolio'))},
    'db_user' => ${php(env('DB_USER', 'jh6rkj_basile'))},
    'db_pass' => ${php(password)},
];
`

const dir = resolve('dist/api')
if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
writeFileSync(resolve(dir, 'config.php'), config, { mode: 0o600 })
console.log('[write-api-config] dist/api/config.php written.')
