import { exec } from 'child_process';
import { join } from 'path';
import fs from 'fs/promises';
import { format } from 'date-fns';

const BACKUP_DIR = join(process.cwd(), 'backups');

export async function createBackup() {
  try {
    // Ensure backup directory exists
    await fs.mkdir(BACKUP_DIR, { recursive: true });

    const timestamp = format(new Date(), 'yyyy-MM-dd-HH-mm-ss');
    const backupPath = join(BACKUP_DIR, `backup-${timestamp}.sqlite`);
    
    // Copy current database to backup
    await fs.copyFile(
      join(process.cwd(), 'database.sqlite'),
      backupPath
    );

    console.log(`✅ Database backup created: ${backupPath}`);
  } catch (error) {
    console.error('❌ Backup failed:', error);
  }
}