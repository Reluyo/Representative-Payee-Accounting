import type { StoredBackup } from '../../hooks/useAutoBackup';

interface BackupBannerProps {
  backup: StoredBackup;
  onDownload: (backup: StoredBackup) => void;
  onDismiss: () => void;
}

export function BackupBanner({ backup, onDownload, onDismiss }: BackupBannerProps) {
  return (
    <div className="bg-green-50 border border-green-300 rounded-lg px-4 py-3 flex items-center justify-between gap-3 shadow-sm">
      <div className="flex items-center gap-2 min-w-0">
        <span className="text-green-600 text-xl flex-shrink-0">💾</span>
        <div className="min-w-0">
          <p className="text-green-900 font-semibold text-sm">Monthly backup ready</p>
          <p className="text-green-700 text-xs truncate">
            {backup.transactionCount} transactions • {backup.filename}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <button
          onClick={() => onDownload(backup)}
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-3 py-1.5 rounded transition-colors"
        >
          Save to Files
        </button>
        <button
          onClick={onDismiss}
          className="text-green-600 hover:text-green-800 text-lg leading-none px-1"
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>
    </div>
  );
}
