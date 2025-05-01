import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const backupPath = path.join(__dirname, 'backups');

exec(`mongodump --db blogDB --out ${backupPath}`, (error) => {
  if (error) {
    console.error('Backup failed:', error);
    return;
  }
  console.log(`Backup saved to ${backupPath}`);
});