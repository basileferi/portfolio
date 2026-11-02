#!/usr/bin/env node
/**
 * Prints the SQL that creates (or updates) a back-office account.
 *
 *   npm run admin:create
 *
 * The password is hashed locally with bcrypt (cost 12) — only the hash ever
 * reaches the database. Paste the printed SQL into phpMyAdmin.
 */
import readline from 'node:readline'
import bcrypt from 'bcryptjs'

function ask(question, { hidden = false } = {}) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true })
    if (hidden) {
      rl._writeToOutput = (str) => {
        if (str.includes(question)) rl.output.write(str)
        else rl.output.write('*')
      }
    }
    rl.question(question, (answer) => {
      rl.close()
      if (hidden) process.stdout.write('\n')
      resolve(answer)
    })
  })
}

const sqlString = (s) => `'${String(s).replace(/\\/g, '\\\\').replace(/'/g, "''")}'`

const username = (await ask('Identifiant admin : ')).trim()
if (!/^[\w.@-]{3,64}$/.test(username)) {
  console.error('Identifiant invalide (3 à 64 caractères : lettres, chiffres, . _ @ -).')
  process.exit(1)
}

const password = await ask('Mot de passe (12 caractères min.) : ', { hidden: true })
if (password.length < 12) {
  console.error('Mot de passe trop court : 12 caractères minimum.')
  process.exit(1)
}
const confirm = await ask('Confirmez le mot de passe : ', { hidden: true })
if (confirm !== password) {
  console.error('Les mots de passe ne correspondent pas.')
  process.exit(1)
}

// PHP's password_verify() expects the $2y$ prefix (identical algorithm to $2b$).
const hash = bcrypt.hashSync(password, 12).replace(/^\$2[ab]\$/, '$2y$')

console.log('\n-- Collez cette requête dans phpMyAdmin (onglet SQL de jh6rkj_portfolio) :\n')
console.log(
  `INSERT INTO \`admin_users\` (\`username\`, \`password_hash\`) VALUES (${sqlString(username)}, ${sqlString(hash)})\n` +
  `  ON DUPLICATE KEY UPDATE \`password_hash\` = VALUES(\`password_hash\`);\n`
)
