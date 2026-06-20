import { useRef, useState } from 'react';
import { colors, spacing, radius } from '../../design/tokens';
import { exportCloudData, importCloudData, clearCloudData } from '../../db/sync';
import { getGeminiApiKey, setGeminiApiKey } from '../../utils/gemini';
import { useAuth } from '../../contexts/AuthContext';

interface SettingsProps {
  onDataImported: () => void;
}

export function Settings({ onDataImported }: SettingsProps) {
  const { user, signOut } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [apiKey, setApiKey] = useState(getGeminiApiKey);
  const [showKey, setShowKey] = useState(false);
  const [keySaved, setKeySaved] = useState(false);

  const handleSaveApiKey = () => {
    setGeminiApiKey(apiKey);
    setKeySaved(true);
    setTimeout(() => setKeySaved(false), 2000);
  };

  const [exporting, setExporting] = useState(false);

  const handleExport = async () => {
    if (!user) return;
    setExporting(true);
    try {
      const data = await exportCloudData(user.id);
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `payee_accounting_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export data');
    } finally {
      setExporting(false);
    }
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const confirmed = window.confirm(
      'This will add the backup data to what you already have. If you load the same backup twice, you may see duplicate entries.\n\nTo start fresh from a backup instead, use "Delete Everything & Restore from Backup" below.\n\nContinue?'
    );

    if (!confirmed) {
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    try {
      if (!user) throw new Error('Not signed in');
      const text = await file.text();
      const data = JSON.parse(text);
      await importCloudData(user.id, data);
      alert('Data restored successfully.');
      onDataImported();
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to import data. Please check the file format.');
    }

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClearAndReplace = async () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.json';
    fileInput.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const confirmed = window.confirm(
        'WARNING: This will delete all your current data and replace it with the backup file. You cannot undo this.\n\nAre you sure?'
      );
      if (!confirmed) return;

      try {
        if (!user) throw new Error('Not signed in');
        const text = await file.text();
        const data = JSON.parse(text);
        await clearCloudData(user.id);
        await importCloudData(user.id, data);
        alert('All data replaced successfully.');
        onDataImported();
      } catch (error) {
        console.error('Replace failed:', error);
        alert('Failed to replace data. Your original data may have been cleared. Please try again with a valid backup file.');
      }
    };
    fileInput.click();
  };

  return (
    <div className="pb-32 pt-6" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh', paddingLeft: spacing.screenPadding, paddingRight: spacing.screenPadding }}>
      {/* Header */}
      <h1 style={{ fontSize: '30px', fontWeight: 800, color: colors['ink/primary'], margin: 0 }}>
        Settings
      </h1>
      <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], margin: '8px 0 24px 0' }}>
        Manage your data & preferences
      </p>

      {/* Backup & Restore */}
      <div
        style={{
          backgroundColor: colors['surface/card'],
          borderRadius: '24px',
          padding: '20px',
          border: `1px solid ${colors['border/hairline']}`,
          marginBottom: '16px',
        }}
      >
        <h3 style={{ fontSize: '19px', fontWeight: 800, color: colors['ink/primary'], margin: 0, marginBottom: '16px' }}>
          Backup & Restore
        </h3>

        <button
          onClick={handleExport}
          disabled={exporting}
          style={{
            width: '100%',
            padding: '14px 16px',
            backgroundColor: colors['brand/primary'],
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: exporting ? 'wait' : 'pointer',
            opacity: exporting ? 0.7 : 1,
            marginBottom: '12px',
            boxShadow: '0 6px 16px rgba(47, 98, 217, 0.28)',
          }}
        >
          {exporting ? 'Preparing backup…' : 'Export Backup'}
        </button>

        <button
          onClick={handleImportClick}
          style={{
            width: '100%',
            padding: '14px 16px',
            backgroundColor: colors['surface/card'],
            color: colors['brand/primary'],
            border: `2px solid ${colors['border/btn-outline']}`,
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
            marginBottom: '10px',
          }}
        >
          Restore Backup (Keep Current Data)
        </button>

        <button
          onClick={handleClearAndReplace}
          style={{
            width: '100%',
            padding: '14px 16px',
            backgroundColor: '#fef2f2',
            color: '#dc2626',
            border: `2px solid #fca5a5`,
            borderRadius: '16px',
            fontSize: '16px',
            fontWeight: 700,
            cursor: 'pointer',
          }}
        >
          Delete Everything & Restore from Backup
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleImport}
          style={{ display: 'none' }}
        />

        <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/disabled'], margin: '16px 0 0 0', textAlign: 'center' }}>
          Your data is securely synced to the cloud and available on all your devices. Exporting downloads a full copy (including receipt images) you can keep as an offline backup.
        </p>
      </div>

      {/* AI Receipt Scanning */}
      <div
        style={{
          backgroundColor: colors['surface/card'],
          borderRadius: '24px',
          padding: '20px',
          border: `1px solid ${colors['border/hairline']}`,
          marginBottom: '16px',
        }}
      >
        <h3 style={{ fontSize: '19px', fontWeight: 800, color: colors['ink/primary'], margin: 0, marginBottom: '4px' }}>
          AI Receipt Scanning
        </h3>
        <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/muted'], margin: '0 0 16px 0', lineHeight: 1.5 }}>
          Optionally use Google Gemini to improve receipt reading. The free plan allows 15 scans per minute.
        </p>

        <label style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
          Gemini API Key
        </label>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
          <input
            type={showKey ? 'text' : 'password'}
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Enter your Gemini API key"
            style={{
              flex: 1,
              padding: '10px 12px',
              fontSize: '14px',
              fontWeight: 600,
              border: `1px solid ${colors['border/hairline']}`,
              borderRadius: '12px',
              color: colors['ink/primary'],
              backgroundColor: '#fff',
              boxSizing: 'border-box',
            }}
          />
          <button
            type="button"
            onClick={() => setShowKey(!showKey)}
            style={{
              padding: '10px 12px',
              backgroundColor: colors['brand/tint'],
              color: colors['brand/primary'],
              border: `1px solid ${colors['border/hairline']}`,
              borderRadius: '12px',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              fontFamily: 'inherit',
              flexShrink: 0,
            }}
          >
            {showKey ? 'Hide' : 'Show'}
          </button>
        </div>
        <button
          onClick={handleSaveApiKey}
          style={{
            width: '100%',
            padding: '12px 16px',
            backgroundColor: keySaved ? colors['positive'] : colors['brand/primary'],
            color: 'white',
            border: 'none',
            borderRadius: '16px',
            fontSize: '15px',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {keySaved ? 'Saved!' : 'Save API Key'}
        </button>

        <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/disabled'], margin: '12px 0 0 0', lineHeight: 1.5 }}>
          Your key is stored only on this device. Only the receipt text is sent to Google, never the photo. If the scan is unclear, you can retry or type the details yourself.
        </p>
      </div>

      {/* About */}
      <div
        style={{
          backgroundColor: colors['surface/card'],
          borderRadius: '24px',
          padding: '20px',
          border: `1px solid ${colors['border/hairline']}`,
        }}
      >
        <h3 style={{ fontSize: '19px', fontWeight: 800, color: colors['ink/primary'], margin: 0, marginBottom: '12px' }}>
          About
        </h3>
        <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
          Representative Payee Accounting
        </p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/disabled'], margin: '8px 0 0 0' }}>
          Version 1.0.0
        </p>
        <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/muted'], margin: '16px 0 0 0', lineHeight: 1.6 }}>
          Track and report spending for court filings. Your data syncs securely across devices.
        </p>
        {user && (
          <p style={{ fontSize: '13px', fontWeight: 600, color: colors['ink/disabled'], margin: '8px 0 0 0' }}>
            Signed in as {user.email}
          </p>
        )}
      </div>

      {/* Sign out */}
      <button
        onClick={signOut}
        style={{
          width: '100%',
          padding: '16px',
          marginTop: '16px',
          backgroundColor: colors['surface/card'],
          color: '#ef4444',
          border: `1px solid ${colors['border/hairline']}`,
          borderRadius: `${radius.button}px`,
          fontSize: '16px',
          fontWeight: 800,
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        Sign out
      </button>
    </div>
  );
}
