import { useState, useEffect, useCallback } from 'react';
import type { Account, Category, Transaction } from '../../types';
import type { OCRResult } from '../../utils/ocr';
import { defaultCategories } from '../../db/schema';
import { Dashboard } from '../DirectionA/Dashboard';
import { History } from '../DirectionA/History';
import { CourtReport } from '../DirectionA/CourtReport';
import { ReceiptsGallery } from '../DirectionA/ReceiptsGallery';
import { Settings } from '../DirectionA/Settings';
import { BottomTabBar } from './BottomTabBar';
import { AddExpenseModal } from '../DirectionA/AddExpenseModal';
import { ScanReceiptCamera } from '../DirectionA/ScanReceiptCamera';
import { AccountSetupDirectionA } from '../Accounts/AccountSetupDirectionA';
import { useReports } from '../../hooks/useReports';
import { useAutoBackup } from '../../hooks/useAutoBackup';
import { BackupBanner } from '../UI/BackupBanner';
import { useAuth } from '../../contexts/AuthContext';
import {
  fetchAccountsFromCloud,
  fetchCategoriesFromCloud,
  fetchTransactionsFromCloud,
  createAccountCloud,
  updateAccountCloud,
  createTransactionCloud,
  updateTransactionCloud,
  deleteTransactionCloud,
  deleteAccountCloud,
  initCategoriesCloud,
} from '../../db/sync';
import { colors } from '../../design/tokens';

type Tab = 'home' | 'history' | 'receipts' | 'reports';

export function LayoutDirectionA() {
  const { user } = useAuth();
  const userId = user!.id;

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | undefined>();
  const [capturedOCR, setCapturedOCR] = useState<OCRResult | undefined>();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [showSettings, setShowSettings] = useState(false);
  const [addReceiptToTransaction, setAddReceiptToTransaction] = useState<Transaction | undefined>();

  const currentAccount = accounts.find(a => a.id === currentAccountId) ?? null;
  const { generateAndExportPDF, generateAndExportCSV, reportLoading } = useReports(currentAccountId, currentAccount?.name ?? '');
  const { backupReady, pendingBackup, downloadBackup, dismissBanner, snoozeBanner } = useAutoBackup();

  const fetchTransactionsForAccount = useCallback(async (accountId: number) => {
    const txs = await fetchTransactionsFromCloud(userId, accountId);
    setTransactions(txs);
  }, [userId]);

  useEffect(() => {
    const initialize = async () => {
      try {
        await initCategoriesCloud(userId, defaultCategories);
        const [loadedAccounts, loadedCategories] = await Promise.all([
          fetchAccountsFromCloud(userId),
          fetchCategoriesFromCloud(userId),
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
  }, [userId]);

  useEffect(() => {
    if (currentAccountId) {
      fetchTransactionsForAccount(currentAccountId);
    }
  }, [currentAccountId, fetchTransactionsForAccount]);

  const refreshAccounts = async () => {
    const updated = await fetchAccountsFromCloud(userId);
    setAccounts(updated);
  };

  const handleAccountCreated = async () => {
    const newAccounts = await fetchAccountsFromCloud(userId);
    setAccounts(newAccounts);
    if (newAccounts.length === 1) {
      setCurrentAccountId(newAccounts[0].id ?? null);
    }
  };

  const handleAddExpense = () => {
    setEditingTransaction(undefined);
    setCapturedPhoto(undefined);
    setCapturedOCR(undefined);
    setShowAddExpense(true);
  };

  const handleScanReceipt = () => {
    setShowCamera(true);
  };

  const handleCameraCapture = async (photoData: string, ocrResult?: OCRResult) => {
    setShowCamera(false);

    if (addReceiptToTransaction?.id) {
      const tx = addReceiptToTransaction;
      setAddReceiptToTransaction(undefined);
      try {
        const blob = await fetch(photoData).then(r => r.blob());
        const newReceipt = {
          referenceNumber: (() => { const now = new Date(); return `${now.getFullYear()}${String(now.getMonth()+1).padStart(2,'0')}${String(now.getDate()).padStart(2,'0')}0001`; })(),
          fileName: `receipt_${Date.now()}.jpg`,
          fileType: blob.type || 'image/jpeg',
          fileSize: blob.size,
          uploadedDate: new Date(),
          data: '',
          blobData: blob,
          originalText: ocrResult?.text ?? '',
          extractedFields: {
            vendor: ocrResult?.vendor,
            amount: ocrResult?.amount,
            date: ocrResult?.date,
            items: ocrResult?.items,
          },
        };
        await updateTransactionCloud(tx.id!, {
          receipts: [...(tx.receipts || []), newReceipt],
        });
        if (currentAccountId) await fetchTransactionsForAccount(currentAccountId);
      } catch (err) {
        console.error('Failed to add receipt:', err);
      }
      return;
    }

    setCapturedPhoto(photoData);
    setCapturedOCR(ocrResult);
    setEditingTransaction(undefined);
    setShowAddExpense(true);
  };

  const handleAddReceiptToTransaction = (tx: Transaction) => {
    setAddReceiptToTransaction(tx);
    setShowCamera(true);
  };

  const handleEditTransaction = (tx: Transaction) => {
    setEditingTransaction(tx);
    setCapturedPhoto(undefined);
    setCapturedOCR(undefined);
    setShowAddExpense(true);
  };

  const handleDeleteTransaction = async (id: number) => {
    if (!currentAccount) return;
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      const delta = tx.type === 'income' ? -tx.amount : tx.amount;
      await updateAccountCloud(currentAccount.id!, {
        balance: currentAccount.balance + delta,
        lastUpdated: new Date(),
      });
    }
    await deleteTransactionCloud(id);
    await refreshAccounts();
    if (currentAccountId) await fetchTransactionsForAccount(currentAccountId);
  };

  const handleGeneratePDF = async (startDate: Date, endDate: Date) => {
    try {
      await generateAndExportPDF(startDate, endDate, '');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleGenerateCSV = async (startDate: Date, endDate: Date) => {
    try {
      await generateAndExportCSV(startDate, endDate, '');
    } catch (error) {
      console.error('Failed to generate CSV:', error);
      alert('Failed to generate CSV. Please try again.');
    }
  };

  const handleExpenseSaved = async (amount: number, type: 'income' | 'expense') => {
    if (!currentAccount?.id) return;

    const delta = type === 'income' ? amount : -amount;
    await updateAccountCloud(currentAccount.id, {
      balance: currentAccount.balance + delta,
      lastUpdated: new Date(),
    });

    await refreshAccounts();
    if (currentAccountId) await fetchTransactionsForAccount(currentAccountId);
  };

  const handleDataImported = async () => {
    const [updatedAccounts, updatedCategories] = await Promise.all([
      fetchAccountsFromCloud(userId),
      fetchCategoriesFromCloud(userId),
    ]);
    setAccounts(updatedAccounts);
    setCategories(updatedCategories);
    if (updatedAccounts.length > 0) {
      setCurrentAccountId(updatedAccounts[0].id ?? null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen" style={{ backgroundColor: colors['bg/page'] }}>
        <p style={{ color: colors['ink/muted'] }}>Loading...</p>
      </div>
    );
  }

  if (accounts.length === 0) {
    return <AccountSetupDirectionA onAccountCreated={handleAccountCreated} />;
  }

  return (
    <div style={{ backgroundColor: colors['bg/page'], minHeight: '100vh', paddingBottom: '120px' }}>
      {backupReady && pendingBackup && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50, padding: '16px 22px' }}>
          <BackupBanner
            backup={pendingBackup}
            onDownload={downloadBackup}
            onDismiss={dismissBanner}
            onSnooze={snoozeBanner}
          />
        </div>
      )}

      {reportLoading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px 32px', textAlign: 'center' }}>
            <p style={{ fontSize: '17px', fontWeight: 700, color: colors['ink/primary'], margin: 0 }}>Generating PDF...</p>
            <p style={{ fontSize: '14px', color: colors['ink/muted'], margin: '8px 0 0 0', fontWeight: 600 }}>This may take a moment for large reports</p>
          </div>
        </div>
      )}

      {activeTab === 'home' && currentAccount && (
        <Dashboard
          account={currentAccount}
          accounts={accounts}
          userName={currentAccount.name.split(' ')[0] || 'Friend'}
          recentTransactions={transactions}
          onAddExpense={handleAddExpense}
          onScanReceipt={handleScanReceipt}
          onSettings={() => setShowSettings(true)}
          onViewAll={() => setActiveTab('history')}
          onAccountChange={setCurrentAccountId}
        />
      )}

      {activeTab === 'history' && currentAccount && (
        <History
          accountName={currentAccount.name}
          transactions={transactions}
          onEdit={handleEditTransaction}
          onDelete={handleDeleteTransaction}
          onAddReceipt={handleAddReceiptToTransaction}
        />
      )}

      {activeTab === 'receipts' && currentAccount && (
        <ReceiptsGallery
          accountName={currentAccount.name}
          transactions={transactions}
        />
      )}

      {activeTab === 'reports' && currentAccount && (
        <CourtReport
          account={currentAccount}
          transactions={transactions}
          onGeneratePDF={handleGeneratePDF}
          onGenerateCSV={handleGenerateCSV}
        />
      )}

      {showAddExpense && currentAccount && (
        <AddExpenseModal
          categories={categories}
          account={currentAccount}
          photoData={capturedPhoto}
          ocrResult={capturedOCR}
          editingTransaction={editingTransaction}
          onClose={() => {
            setShowAddExpense(false);
            setCapturedPhoto(undefined);
            setCapturedOCR(undefined);
            setEditingTransaction(undefined);
          }}
          onSaved={handleExpenseSaved}
        />
      )}

      {showCamera && (
        <ScanReceiptCamera
          onCapture={handleCameraCapture}
          onCancel={() => setShowCamera(false)}
        />
      )}

      {showSettings && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: colors['bg/page'], zIndex: 1200, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '16px' }}>
            <button
              onClick={() => setShowSettings(false)}
              style={{
                background: colors['brand/tint'], border: `1px solid ${colors['border/hairline']}`,
                borderRadius: '10px', padding: '8px 16px', fontSize: '15px', fontWeight: 700,
                color: colors['brand/primary'], cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              Done
            </button>
          </div>
          <Settings onDataImported={handleDataImported} />
        </div>
      )}

      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
