import { useState } from 'react';
import { colors, radius } from '../../design/tokens';
import type { StoredBackup } from '../../hooks/useAutoBackup';

interface BackupBannerProps {
  backup: StoredBackup;
  onDownload: (backup: StoredBackup) => void;
  onDismiss: () => void;
  onSnooze: (untilDate: Date) => void;
}

const snoozeOptions = [
  { label: 'Tomorrow', days: 1 },
  { label: '3 days', days: 3 },
  { label: '1 week', days: 7 },
  { label: '2 weeks', days: 14 },
  { label: '1 month', days: 30 },
] as const;

export function BackupBanner({ backup, onDownload, onDismiss, onSnooze }: BackupBannerProps) {
  const [showSnooze, setShowSnooze] = useState(false);

  const handleSnooze = (days: number) => {
    const until = new Date();
    until.setDate(until.getDate() + days);
    onSnooze(until);
  };

  return (
    <div
      style={{
        backgroundColor: colors['surface/card'],
        borderRadius: `${radius.card}px`,
        border: `1px solid ${colors['border/hairline']}`,
        padding: '16px',
        boxShadow: '0 8px 24px rgba(30, 58, 95, 0.16)',
      }}
    >
      {/* Main row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Icon */}
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            backgroundColor: colors['brand/tint'],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '18px',
          }}
        >
          💾
        </div>

        {/* Text */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '15px', fontWeight: 700, color: colors['ink/primary'], margin: 0 }}>
            Monthly backup ready
          </p>
          <p style={{ fontSize: '13px', fontWeight: 600, color: colors['ink/muted'], margin: '4px 0 0 0' }}>
            {backup.transactionCount} transactions &middot; {backup.filename}
          </p>
        </div>

        {/* Close */}
        <button
          onClick={onDismiss}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors['ink/disabled'],
            fontSize: '18px',
            lineHeight: 1,
            padding: '2px',
            flexShrink: 0,
          }}
          aria-label="Dismiss"
        >
          ✕
        </button>
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px', marginTop: '14px' }}>
        <button
          onClick={() => onDownload(backup)}
          style={{
            flex: 1,
            padding: '10px 0',
            backgroundColor: colors['brand/primary'],
            color: '#fff',
            border: 'none',
            borderRadius: `${radius.button}px`,
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
            boxShadow: '0 4px 12px rgba(30, 58, 95, 0.2)',
          }}
        >
          Save to Files
        </button>
        <button
          onClick={() => setShowSnooze(!showSnooze)}
          style={{
            flex: 1,
            padding: '10px 0',
            backgroundColor: colors['surface/card'],
            color: colors['ink/muted'],
            border: `1.5px solid ${colors['border/btn-outline']}`,
            borderRadius: `${radius.button}px`,
            fontSize: '14px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Remind me later
        </button>
      </div>

      {/* Snooze options */}
      {showSnooze && (
        <div
          style={{
            marginTop: '12px',
            paddingTop: '12px',
            borderTop: `1px solid ${colors['border/divider']}`,
          }}
        >
          <p style={{ fontSize: '13px', fontWeight: 700, color: colors['ink/muted'], margin: '0 0 8px 0' }}>
            Remind me in...
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {snoozeOptions.map(opt => (
              <button
                key={opt.days}
                onClick={() => handleSnooze(opt.days)}
                style={{
                  padding: '7px 14px',
                  backgroundColor: colors['brand/tint'],
                  color: colors['brand/primary'],
                  border: `1px solid ${colors['border/hairline']}`,
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
