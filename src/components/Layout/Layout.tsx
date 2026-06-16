import React, { useState, useEffect } from 'react';
import type { Account, Category, Transaction } from '../../types';
import { getAccounts, getCategories, exportToJSON, importFromJSON, initializeDB } from '../../db/queries';
import { AccountSetup } from '../Accounts/AccountSetup';
import { TransactionForm } from '../Transactions/TransactionForm';
import { TransactionList } from '../Transactions/TransactionList';
import { ReportGenerator } from '../Reports/ReportGenerator';
import { BackupBanner } from '../UI/BackupBanner';
import { Button } from '../UI/Button';
import { useTransactions } from '../../hooks/useTransactions';
import { useAutoBackup, getStoredBackups } from '../../hooks/useAutoBackup';
import type { StoredBackup } from '../../hooks/useAutoBackup';

export function Layout() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'transactions' | 'reports' | 'settings'>('transactions');
  const [loading, setLoading] = useState(true);
  const [storedBackups, setStoredBackups] = useState<StoredBackup[]>([]);

  const { transactions, addTransaction, deleteTransaction } = useTransactions(currentAccountId);
  const { backupReady, pendingBackup, downloadBackup, dismissBanner } = useAutoBackup();

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDB();
        const [loadedAccounts, loadedCategories, backups] = await Promise.all([
          getAccounts(),
          getCategories(),
          getStoredBackups(),
        ]);

        setAccounts(loadedAccounts);
        setCategories(loadedCategories);
        setStoredBackups(backups);

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

  // Refresh stored backups list when settings tab is opened
  useEffect(() => {
    if (activeTab === 'settings') {
      getStoredBackups().then(setStoredBackups);
    }
  }, [activeTab]);

  const handleAccountCreated = async (account: Account) => {
    const newAccounts = await getAccounts();
    setAccounts(newAccounts);
    if (newAccounts.length === 1) {
      setCurrentAccountId(newAccounts[0].id ?? null);
    }
  };

  const handleTransactionAdded = async (transaction: Omit<Transaction, 'id'>) => {
    void addTransaction(transaction);
  };

  const handleExportBackup = async () => {
    try {
      const data = await exportToJSON();
      const now = new Date();
      const filename = `payee_backup_${now.toISOString().split('T')[0]}.json`;
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const handleImportBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const data = JSON.parse(text);
      await importFromJSON(data);

      const newAccounts = await getAccounts();
      setAccounts(newAccounts);
      if (newAccounts.length > 0) {
        setCurrentAccountId(newAccounts[0].id ?? null);
      }

      alert('Backup restored successfully!');
    } catch (error) {
      console.error('Import failed:', error);
      alert('Failed to restore backup. Please check the file format.');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const currentAccount = accounts.find(a => a.id === currentAccountId) ?? null;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Representative Payee Accounting
          </h1>
          {currentAccount && (
            <p className="text-gray-600">
              Account: <span className="font-semibold">{currentAccount.name}</span>
            </p>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Auto-backup banner — shown at top whenever a monthly backup is ready */}
        {backupReady && pendingBackup && (
          <div className="mb-6">
            <BackupBanner
              backup={pendingBackup}
              onDownload={downloadBackup}
              onDismiss={dismissBanner}
            />
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="mb-8">
            <AccountSetup onAccountCreated={handleAccountCreated} />
          </div>
        ) : (
          <>
            {/* Account Selection */}
            <div className="mb-6">
              <div className="flex gap-2 flex-wrap">
                {accounts.map(account => (
                  <button
                    key={account.id}
                    onClick={() => setCurrentAccountId(account.id ?? null)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                      currentAccountId === account.id
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {account.name}
                    <span className="ml-2 text-sm">
                      {account.balance.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-4 mb-6">
              {(['transactions', 'reports', 'settings'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 font-semibold rounded-lg capitalize ${
                    activeTab === tab
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 border border-gray-300'
                  }`}
                >
                  {tab === 'transactions' && '💳 '}
                  {tab === 'reports' && '📊 '}
                  {tab === 'settings' && '⚙️ '}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="space-y-6">
              {activeTab === 'transactions' && (
                <>
                  <TransactionForm
                    categories={categories}
                    accountId={currentAccountId || 0}
                    onTransactionAdded={handleTransactionAdded}
                  />
                  <TransactionList
                    transactions={transactions}
                    onDeleteTransaction={deleteTransaction}
                  />
                </>
              )}

              {activeTab === 'reports' && (
                <ReportGenerator
                  accountId={currentAccountId}
                  accountName={currentAccount?.name || 'Account'}
                />
              )}

              {activeTab === 'settings' && (
                <div className="space-y-4">
                  {/* Manual backup */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-2xl font-bold mb-1">Backup & Restore</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      A backup is automatically created every 30 days when you open the app.
                      You can also save one manually at any time.
                    </p>
                    <div className="space-y-3">
                      <Button variant="primary" onClick={handleExportBackup}>
                        📥 Save Backup to Files
                      </Button>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Restore from Backup File
                        </label>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer p-2"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Stored backups inside the app */}
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-xl font-bold mb-1">Backups Stored in App</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      The last {3} automatic backups are kept inside this app.
                      Tap any to download it to your phone's Files.
                    </p>
                    {storedBackups.length === 0 ? (
                      <p className="text-sm text-gray-400 italic">
                        No automatic backups yet. One will be created the next time you open the app after 30 days.
                      </p>
                    ) : (
                      <ul className="space-y-2">
                        {storedBackups.map(backup => (
                          <li
                            key={backup.id}
                            className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3 gap-3"
                          >
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-gray-800 truncate">
                                {backup.filename}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(backup.date).toLocaleDateString('en-US', {
                                  month: 'long', day: 'numeric', year: 'numeric',
                                })} · {backup.transactionCount} transactions
                              </p>
                            </div>
                            <button
                              onClick={() => downloadBackup(backup)}
                              className="flex-shrink-0 text-sm font-semibold text-blue-600 hover:text-blue-800"
                            >
                              Download
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
