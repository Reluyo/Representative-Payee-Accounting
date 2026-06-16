import { useState, useEffect, useCallback } from 'react';
import { exportToJSON } from '../db/queries';

const BACKUP_INTERVAL_DAYS = 30;
const LAST_BACKUP_KEY = 'lastBackupDate';

export interface StoredBackup {
  date: Date;
  filename: string;
  data: string;
  transactionCount: number;
}

export function useAutoBackup() {
  const [backupReady, setBackupReady] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<StoredBackup | null>(null);

  const checkAndCreateBackup = useCallback(async () => {
    const lastBackupStr = localStorage.getItem(LAST_BACKUP_KEY);
    const lastBackup = lastBackupStr ? new Date(lastBackupStr) : null;
    const now = new Date();

    const daysSinceLastBackup = lastBackup
      ? (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    if (daysSinceLastBackup < BACKUP_INTERVAL_DAYS) return;

    try {
      const data = await exportToJSON();
      const filename = `payee_backup_${now.toISOString().split('T')[0]}.json`;
      const dataStr = JSON.stringify(data, null, 2);

      // Hold backup in memory only — no IndexedDB storage.
      // If IndexedDB is cleared, a locally-stored backup is also lost,
      // so we prompt the user to download it to their device immediately.
      const backup: StoredBackup = {
        date: now,
        filename,
        data: dataStr,
        transactionCount: data.transactions?.length ?? 0,
      };

      localStorage.setItem(LAST_BACKUP_KEY, now.toISOString());
      setPendingBackup(backup);
      setBackupReady(true);
    } catch (error) {
      console.error('Auto-backup failed:', error);
    }
  }, []);

  useEffect(() => {
    checkAndCreateBackup();
  }, [checkAndCreateBackup]);

  const downloadBackup = useCallback((backup: StoredBackup) => {
    const blob = new Blob([backup.data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = backup.filename;
    a.click();
    URL.revokeObjectURL(url);
    setBackupReady(false);
    setPendingBackup(null);
  }, []);

  const dismissBanner = useCallback(() => {
    setBackupReady(false);
    setPendingBackup(null);
  }, []);

  return { backupReady, pendingBackup, downloadBackup, dismissBanner };
}
