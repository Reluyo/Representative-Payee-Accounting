import React, { useState, useEffect } from 'react';
import type { Account, Category, Transaction } from '../../types';
import { getAccounts, getCategories, exportToJSON, importFromJSON, initializeDB } from '../../db/queries';
import { AccountSetup } from '../Accounts/AccountSetup';
import { TransactionForm } from '../Transactions/TransactionForm';
import { TransactionList } from '../Transactions/TransactionList';
import { ReportGenerator } from '../Reports/ReportGenerator';
import { Button } from '../UI/Button';
import { useTransactions } from '../../hooks/useTransactions';

export function Layout() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'transactions' | 'reports' | 'settings'>('transactions');
  const [loading, setLoading] = useState(true);

  const {
    transactions,
    addTransaction,
    deleteTransaction,
  } = useTransactions(currentAccountId);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initializeDB();
        const loadedAccounts = await getAccounts();
        const loadedCategories = await getCategories();

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
      setCurrentAccountId(newAccounts[0].id || null);
    }
  };

  const handleTransactionAdded = async (transaction: Omit<Transaction, 'id'>) => {
    void addTransaction(transaction);
  };

  const handleExportBackup = async () => {
    try {
      const data = await exportToJSON();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `backup_${new Date().getTime()}.json`;
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
        setCurrentAccountId(newAccounts[0].id || null);
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Representative Payee Accounting
              </h1>
              {currentAccount && (
                <p className="text-gray-600">
                  Account: <span className="font-semibold">{currentAccount.name}</span>
                </p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                    onClick={() => setCurrentAccountId(account.id || null)}
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
              <button
                onClick={() => setActiveTab('transactions')}
                className={`px-4 py-2 font-semibold rounded-lg ${
                  activeTab === 'transactions'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                💳 Transactions
              </button>
              <button
                onClick={() => setActiveTab('reports')}
                className={`px-4 py-2 font-semibold rounded-lg ${
                  activeTab === 'reports'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                📊 Reports
              </button>
              <button
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 font-semibold rounded-lg ${
                  activeTab === 'settings'
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300'
                }`}
              >
                ⚙️ Settings
              </button>
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
                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-2xl font-bold mb-4">Backup & Restore</h3>
                    <div className="space-y-3">
                      <Button
                        variant="primary"
                        onClick={handleExportBackup}
                      >
                        📥 Export Backup
                      </Button>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Restore from Backup
                        </label>
                        <input
                          type="file"
                          accept=".json"
                          onChange={handleImportBackup}
                          className="block w-full text-sm text-gray-600 border border-gray-300 rounded-lg cursor-pointer"
                        />
                      </div>
                      <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
                        💡 Regularly export backups to prevent data loss. Your data is stored locally on this device.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-lg shadow p-6">
                    <h3 className="text-2xl font-bold mb-4">Account Management</h3>
                    <Button
                      variant="secondary"
                      onClick={() => {
                        const accountName = prompt('Enter new account name:', 'New Account');
                        if (accountName) {
                          // TODO: Implement account creation
                        }
                      }}
                    >
                      ➕ Add Another Account
                    </Button>
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
