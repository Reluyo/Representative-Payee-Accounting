import { useState, useEffect } from 'react';
import type { Account, Category, Transaction } from '../../types';
import { getAccounts, getCategories, exportToJSON, initializeDB } from '../../db/queries';
import { Dashboard } from '../DirectionA/Dashboard';
import { History } from '../DirectionA/History';
import { CourtReport } from '../DirectionA/CourtReport';
import { BottomTabBar } from './BottomTabBar';
import { AccountSetup } from '../Accounts/AccountSetup';
import { useTransactions } from '../../hooks/useTransactions';
import { useAutoBackup } from '../../hooks/useAutoBackup';
import { BackupBanner } from '../UI/BackupBanner';

type Tab = 'home' | 'history' | 'receipts' | 'reports';

export function LayoutDirectionA() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);

  const { transactions } = useTransactions(currentAccountId);
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
    // TODO: Open expense entry modal/form
    console.log('Add expense');
  };

  const handleScanReceipt = () => {
    // TODO: Open camera/receipt scanner
    console.log('Scan receipt');
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
    // TODO: Implement email functionality
    console.log('Email to attorney');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: '#F4F7FB' }}>
        <p style={{ color: '#5B6B82' }}>Loading...</p>
      </div>
    );
  }

  const currentAccount = accounts.find(a => a.id === currentAccountId);

  if (accounts.length === 0) {
    return <AccountSetup onAccountCreated={handleAccountCreated} />;
  }

  return (
    <div style={{ backgroundColor: '#F4F7FB', minHeight: '100vh' }}>
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
        />
      )}

      {activeTab === 'history' && currentAccount && (
        <History accountName={currentAccount.name} transactions={transactions} />
      )}

      {activeTab === 'receipts' && (
        <div
          style={{
            paddingTop: '48px',
            paddingLeft: '22px',
            paddingRight: '22px',
            paddingBottom: '200px',
            color: '#5B6B82',
            fontSize: '16px',
          }}
        >
          <h2 style={{ fontSize: '30px', fontWeight: 800, margin: 0 }}>Receipts</h2>
          <p style={{ marginTop: '24px' }}>Gallery of saved receipts (coming soon)</p>
        </div>
      )}

      {activeTab === 'reports' && currentAccount && (
        <CourtReport
          accountName={currentAccount.name}
          transactions={transactions}
          onGeneratePDF={handleGeneratePDF}
          onEmail={handleEmail}
        />
      )}

      {/* Bottom tab bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
