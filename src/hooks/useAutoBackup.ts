import { useState, useEffect, useCallback } from 'react';
import { exportCloudData } from '../db/sync';
import { useAuth } from '../contexts/AuthContext';

const BACKUP_INTERVAL_DAYS = 30;
const LAST_BACKUP_KEY = 'lastBackupDate';
const SNOOZE_UNTIL_KEY = 'backupSnoozeUntil';

export interface StoredBackup {
  date: Date;
  filename: string;
  data: string;
  transactionCount: number;
}

export function useAutoBackup() {
  const { user } = useAuth();
  const [backupReady, setBackupReady] = useState(false);
  const [pendingBackup, setPendingBackup] = useState<StoredBackup | null>(null);

  const checkAndCreateBackup = useCallback(async () => {
    if (!user) return;

    const now = new Date();

    // Respect snooze — if snoozed until a future date, skip
    const snoozeStr = localStorage.getItem(SNOOZE_UNTIL_KEY);
    if (snoozeStr) {
      const snoozeUntil = new Date(snoozeStr);
      if (now < snoozeUntil) return;
      localStorage.removeItem(SNOOZE_UNTIL_KEY);
    }

    const lastBackupStr = localStorage.getItem(LAST_BACKUP_KEY);
    const lastBackup = lastBackupStr ? new Date(lastBackupStr) : null;

    const daysSinceLastBackup = lastBackup
      ? (now.getTime() - lastBackup.getTime()) / (1000 * 60 * 60 * 24)
      : Infinity;

    if (daysSinceLastBackup < BACKUP_INTERVAL_DAYS) return;

    try {
      const data = await exportCloudData(user.id);
      const filename = `payee_backup_${now.toISOString().split('T')[0]}.json`;
      const dataStr = JSON.stringify(data, null, 2);

      const backup: StoredBackup = {
        date: now,
        filename,
        data: dataStr,
        transactionCount: data.transactions?.length ?? 0,
      };

      setPendingBackup(backup);
      setBackupReady(true);
    } catch (error) {
      console.error('Auto-backup failed:', error);
    }
  }, [user]);

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
    // Mark backup as completed so it doesn't re-prompt
    localStorage.setItem(LAST_BACKUP_KEY, new Date().toISOString());
    setBackupReady(false);
    setPendingBackup(null);
  }, []);

  const dismissBanner = useCallback(() => {
    setBackupReady(false);
    setPendingBackup(null);
  }, []);

  const snoozeBanner = useCallback((untilDate: Date) => {
    localStorage.setItem(SNOOZE_UNTIL_KEY, untilDate.toISOString());
    setBackupReady(false);
    setPendingBackup(null);
  }, []);

  return { backupReady, pendingBackup, downloadBackup, dismissBanner, snoozeBanner };
}
