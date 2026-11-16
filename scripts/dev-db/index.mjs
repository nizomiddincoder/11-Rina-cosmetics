// Lokal ishlab chiqish uchun PostgreSQL (o'rnatish shart emas): npm run dev:db
// Ma'lumotlar loyiha ildizidagi .pgdata papkasida saqlanadi. To'xtatish: Ctrl+C
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '../..');

// Birinchi ishga tushirishda paketni shu papkaga o'rnatadi (root package.json'ga tegmaydi)
if (!fs.existsSync(path.join(here, 'node_modules', 'embedded-postgres'))) {
  console.log('[dev-db] embedded-postgres o\'rnatilmoqda (bir martalik)...');
  execSync('npm install --no-audit --no-fund', { cwd: here, stdio: 'inherit' });
}
const { default: EmbeddedPostgres } = await import('embedded-postgres');

const dataDir = path.join(root, '.pgdata');
const DB_NAME = 'rina';
const PORT = 5432;

const pg = new EmbeddedPostgres({
  databaseDir: dataDir,
  user: 'postgres',
  password: 'postgres',
  port: PORT,
  persistent: true,
});

const fresh = !fs.existsSync(path.join(dataDir, 'PG_VERSION'));
if (fresh) await pg.initialise();
await pg.start();
if (fresh) await pg.createDatabase(DB_NAME);

console.log(`\n[dev-db] PostgreSQL tayyor: localhost:${PORT}/${DB_NAME}\n`);

let stopping = false;
const stop = async () => {
  if (stopping) return;
  stopping = true;
  await pg.stop().catch(() => undefined);
  process.exit(0);
};
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
