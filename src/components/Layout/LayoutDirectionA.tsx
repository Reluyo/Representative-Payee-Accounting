import { useState, useEffect } from 'react';
import type { Account, Category, Transaction } from '../../types';
import type { OCRResult } from '../../utils/ocr';
import { getAccounts, getCategories, initializeDB, updateAccount } from '../../db/queries';
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
import { useReports } from '../../hooks/useReports';
import { useAutoBackup } from '../../hooks/useAutoBackup';
import { BackupBanner } from '../UI/BackupBanner';
import { colors } from '../../design/tokens';

type Tab = 'home' | 'history' | 'receipts' | 'reports' | 'settings';

export function LayoutDirectionA() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [currentAccountId, setCurrentAccountId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('home');
  const [loading, setLoading] = useState(true);
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<string | undefined>();
  const [capturedOCR, setCapturedOCR] = useState<OCRResult | undefined>();
  const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>();
  const [addReceiptToTransaction, setAddReceiptToTransaction] = useState<Transaction | undefined>();

  const { transactions, fetchTransactions, updateTransaction, deleteTransaction } = useTransactions(currentAccountId);
  const currentAccount = accounts.find(a => a.id === currentAccountId) ?? null;
  const { generateAndExportPDF, reportLoading } = useReports(currentAccountId, currentAccount?.name ?? '');
  const { backupReady, pendingBackup, downloadBackup, dismissBanner, snoozeBanner } = useAutoBackup();

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

  const handleAccountCreated = async () => {
    const newAccounts = await getAccounts();
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
          referenceNumber: `Receipt-${Date.now()}`,
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
        await updateTransaction(tx.id!, {
          receipts: [...(tx.receipts || []), newReceipt],
        });
        await fetchTransactions();
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
    // Find the transaction to reverse its effect on balance
    const tx = transactions.find(t => t.id === id);
    if (tx) {
      const delta = tx.type === 'income' ? -tx.amount : tx.amount;
      await updateAccount(currentAccount.id!, {
        balance: currentAccount.balance + delta,
        lastUpdated: new Date(),
      });
      const updatedAccounts = await getAccounts();
      setAccounts(updatedAccounts);
    }
    await deleteTransaction(id);
  };

  const handleGeneratePDF = async (startDate: Date, endDate: Date) => {
    try {
      await generateAndExportPDF(startDate, endDate, '');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Failed to generate PDF. Please try again.');
    }
  };

  const handleEmail = (startDate: Date, endDate: Date) => {
    // Generate the PDF first, then prompt the user to attach it
    handleGeneratePDF(startDate, endDate).then(() => {
      const subject = 'Court Accounting Report - Representative Payee';
      const body =
        `Please find the attached accounting report for the representative payee filing.\n\n` +
        `Period: ${startDate.toLocaleDateString()} – ${endDate.toLocaleDateString()}\n` +
        `Account: ${currentAccount?.name ?? ''}\n\n` +
        `The PDF was downloaded to your device. Please attach it to this email before sending.`;
      window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
  };

  const handleExpenseSaved = async (amount: number, type: 'income' | 'expense') => {
    if (!currentAccount?.id) return;

    // Update the account balance
    const delta = type === 'income' ? amount : -amount;
    await updateAccount(currentAccount.id, {
      balance: currentAccount.balance + delta,
      lastUpdated: new Date(),
    });

    const updatedAccounts = await getAccounts();
    setAccounts(updatedAccounts);
    // Refetch transactions to pick up the new/edited entry
    await fetchTransactions();
  };

  const handleDataImported = async () => {
    // Reload everything after import
    const [updatedAccounts, updatedCategories] = await Promise.all([
      getAccounts(),
      getCategories(),
    ]);
    setAccounts(updatedAccounts);
    setCategories(updatedCategories);
    if (updatedAccounts.length > 0) {
      setCurrentAccountId(updatedAccounts[0].id ?? null);
    }
    await fetchTransactions();
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
      {/* Auto-backup banner */}
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

      {/* PDF generation loading overlay */}
      {reportLoading && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', borderRadius: '20px', padding: '28px 32px', textAlign: 'center' }}>
            <p style={{ fontSize: '17px', fontWeight: 700, color: colors['ink/primary'], margin: 0 }}>Generating PDF...</p>
            <p style={{ fontSize: '14px', color: colors['ink/muted'], margin: '8px 0 0 0', fontWeight: 600 }}>This may take a moment for large reports</p>
          </div>
        </div>
      )}

      {/* Tab content */}
      {activeTab === 'home' && currentAccount && (
        <Dashboard
          account={currentAccount}
          accounts={accounts}
          userName={currentAccount.name.split(' ')[0] || 'Friend'}
          recentTransactions={transactions}
          onAddExpense={handleAddExpense}
          onScanReceipt={handleScanReceipt}
          onSettings={() => setActiveTab('settings')}
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
          onEmail={handleEmail}
        />
      )}

      {activeTab === 'settings' && (
        <Settings onDataImported={handleDataImported} />
      )}

      {/* Modals */}
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

      {/* Bottom tab bar */}
      <BottomTabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
