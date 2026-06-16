import { useState, useEffect } from 'react';
import type { Account, Category, Transaction } from '../../types';
import { getAccounts, getCategories, exportToJSON, initializeDB } from '../../db/queries';
import { Dashboard } from '../DirectionA/Dashboard';
import { History } from '../DirectionA/History';
import { CourtReport } from '../DirectionA/CourtReport';
import { ReceiptsGallery } from '../DirectionA/ReceiptsGallery';
import { Settings } from '../DirectionA/Settings';
import { BottomTabBar } from './BottomTabBar';
import { AddExpenseModal } from '../DirectionA/AddExpenseModal';
import { ScanReceiptCamera } from '../DirectionA/ScanReceiptCamera';
import { AccountSetupDirectionA } from '../Accounts/AccountSetupDirectionA';
import { useTransactions } from '../../hooks/useTransactions';
import { useAutoBackup } from '../../hooks/useAutoBackup';
import { BackupBanner } from '../UI/BackupBanner';
import { colors } from '../../design/tokens';

type Tab = 'home' | 'history' | 'receipts' | 'reports';

export function LayoutDirectionA() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | undefined>();

  const { transactions, addTransaction } = useTransactions(currentAccountId);
  const { backupReady, pendingBackup, downloadBackup, dismissBanner } = useAutoBackup();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDB();
        const [loadedAccounts, loadedCategories] = await Promise.all([
          getAccounts(),
          getCategories(),
        ]);

        setAccounts(loadedAccounts);
        setCategories(loadedCategories);

        if (loadedAccounts.length > 0) {
          setCurrentAccountId(loadedAccounts[0].id ?? null);
        }
      } catch (error) {
        console.error('Failed to initialize:', error);
      } finally {
        setLoading(false);
      }
    };

    initialize();
  }, []);

  const handleAccountCreated = async (account: Account) => {
    const newAccounts = await getAccounts();
    setAccounts(newAccounts);
    if (newAccounts.length === 1) {
      setCurrentAccountId(newAccounts[0].id ?? null);
    }
  };

  const handleAddExpense = () => {
    setShowAddExpense(true);
  };

  const handleScanReceipt = () => {
    setShowCamera(true);
  };

  const handleShowSettings = () => {
    setShowSettings(true);
  };

  const handleCameraCapture = (photoData: string) => {
    setShowCamera(false);
    setCapturedPhoto(photoData);
    setShowAddExpense(true);
  };

  const handleGeneratePDF = async () => {
    try {
      const data = await exportToJSON();
      const now = new Date();
      const filename = `court_report_${now.toISOString().split('T')[0]}.json`;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
    }
  };

  const handleEmail = () => {
    const subject = 'Court Accounting Report - Representative Payee';
    const body = `I have attached the representative payee accounting report for the court filing.\n\nThis report includes all transactions and supporting receipts for the requested period.`;
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  const handleExpenseSaved = async () => {
    // Refetch all data to ensure UI updates
    const [updatedAccounts, updatedCategories] = await Promise.all([
      getAccounts(),
      getCategories(),
    ]);
    setAccounts(updatedAccounts);
    setCategories(updatedCategories);

    // Keep current account selected
    if (currentAccountId) {
      setCurrentAccountId(currentAccountId);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colors['bg/page'] }}>
        <p style={{ color: colors['ink/muted'] }}>Loading...</p>
      </div>
    );
  }

  const currentAccount = accounts.find(a => a.id === currentAccountId);

  if (accounts.length === 0) {
    return <AccountSetupDirectionA onAccountCreated={handleAccountCreated} />;
  }

  return (
    <div style={{ backgroundColor: colors['bg/page'], minHeight: '100vh', paddingBottom: '120px' }}>
      {/* Auto-backup banner */}
      {backupReady && pendingBackup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 22px' }}>
          <BackupBanner
            backup={pendingBackup}
            onDownload={downloadBackup}
            onDismiss={dismissBanner}
          />
        </div>
      )}

      {/* Tab content */}
      {activeTab === 'home' && currentAccount && (
        <Dashboard
          account={currentAccount}
          userName={currentAccount.name.split(' ')[0] || 'Friend'}
          recentTransactions={transactions.slice(0, 4)}
          onAddExpense={handleAddExpense}
          onScanReceipt={handleScanReceipt}
          onSettings={handleShowSettings}
        />
      )}

      {activeTab === 'history' && currentAccount && (
        <History accountName={currentAccount.name} transactions={transactions} />
      )}

      {activeTab === 'receipts' && currentAccount && (
        <ReceiptsGallery
          accountName={currentAccount.name}
          transactions={transactions}
        />
      )}

      {activeTab === 'reports' && currentAccount && (
        <CourtReport
          accountName={currentAccount.name}
          transactions={transactions}
          onGeneratePDF={handleGeneratePDF}
          onEmail={handleEmail}
        />
      )}

      {/* Settings View - accessed via overlay */}
      {showSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1001 }}>
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.3)',
              zIndex: 1000,
            }}
            onClick={() => setShowSettings(false)}
          />
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 1001,
              overflowY: 'auto',
              backgroundColor: colors['bg/page'],
            }}
          >
            <button
              onClick={() => setShowSettings(false)}
              style={{
                position: 'fixed',
                top: '16px',
                left: '16px',
                fontSize: '28px',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                zIndex: 1002,
              }}
            >
              ←
            </button>
            <Settings onDataImported={() => setShowSettings(false)} />
          </div>
        </div>
      )}

      {/* Modals */}
      {showAddExpense && (
        <AddExpenseModal
          categories={categories}
          accountId={currentAccountId || 0}
          photoData={capturedPhoto}
          onClose={() => {
            setShowAddExpense(false);
            setCapturedPhoto(undefined);
          }}
          onSaved={handleExpenseSaved}
        />
      )}

      {showCamera && <ScanReceiptCamera onCapture={handleCameraCapture} onCancel={() => setShowCamera(false)} />}

      {/* Bottom tab bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
