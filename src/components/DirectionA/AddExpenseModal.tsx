import { useState, useEffect } from 'react';
import type { Account, Category, Transaction } from '../../types';
import type { OCRResult } from '../../utils/ocr';
import { colors, spacing, radius } from '../../design/tokens';
import { createTransaction, updateTransaction } from '../../db/queries';

interface AddExpenseModalProps {
  categories: Category[];
  account: Account;
  photoData?: string;
  ocrResult?: OCRResult;
  editingTransaction?: Transaction;
  onClose: () => void;
  onSaved: (amount: number, type: 'income' | 'expense') => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  fontSize: '16px',
  fontWeight: 600,
  border: `1px solid ${colors['border/hairline']}`,
  borderRadius: '12px',
  boxSizing: 'border-box',
  color: colors['ink/primary'],
  backgroundColor: '#fff',
};

const labelStyle: React.CSSProperties = {
  fontSize: '15px',
  fontWeight: 600,
  color: colors['ink/muted'],
  display: 'block',
  marginBottom: '8px',
};

export function AddExpenseModal({
  categories,
  account,
  photoData,
  ocrResult,
  editingTransaction,
  onClose,
  onSaved,
}: AddExpenseModalProps) {
  const isEditing = !!editingTransaction;

  const [txType, setTxType] = useState<'income' | 'expense'>(
    editingTransaction?.type ?? 'expense'
  );
  const [date, setDate] = useState(() => {
    if (editingTransaction) {
      return new Date(editingTransaction.date).toISOString().split('T')[0];
    }
    return new Date().toISOString().split('T')[0];
  });
  const [amount, setAmount] = useState(
    editingTransaction ? String(editingTransaction.amount) : ''
  );
  const [category, setCategory] = useState(
    editingTransaction?.category ?? categories[0]?.name ?? ''
  );
  const [merchant, setMerchant] = useState(editingTransaction?.description ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill from OCR when available (only for new transactions)
  useEffect(() => {
    if (!ocrResult || isEditing) return;
    if (ocrResult.vendor && !merchant) setMerchant(ocrResult.vendor);
    if (ocrResult.amount && !amount) setAmount(String(ocrResult.amount));
    if (ocrResult.date && !date) {
      // Try to parse MM/DD/YYYY into YYYY-MM-DD for the date input
      const parts = ocrResult.date.split(/[\/\-]/);
      if (parts.length === 3) {
        const year = parts[2].length === 2 ? `20${parts[2]}` : parts[2];
        const formatted = `${year}-${parts[0].padStart(2, '0')}-${parts[1].padStart(2, '0')}`;
        if (!isNaN(Date.parse(formatted))) setDate(formatted);
      }
    }
  }, [ocrResult]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const parsedAmount = parseFloat(amount);
    if (!amount || parsedAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!merchant.trim()) {
      setError('Please enter a merchant or description');
      return;
    }

    setLoading(true);

    try {
      if (isEditing && editingTransaction?.id) {
        await updateTransaction(editingTransaction.id, {
          date: new Date(date),
          amount: parsedAmount,
          category: txType === 'income' ? 'Income' : category,
          description: merchant.trim(),
          type: txType,
        });
      } else {
        // Convert base64 data URL to Blob to save ~37% storage in IndexedDB
        const receipts = photoData
          ? await (async () => {
              const blob = await fetch(photoData).then(r => r.blob());
              return [{
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
              }];
            })()
          : [];

        await createTransaction({
          accountId: account.id!,
          date: new Date(date),
          amount: parsedAmount,
          category: txType === 'income' ? 'Income' : category,
          description: merchant.trim(),
          type: txType,
          status: 'confirmed',
          receipts,
          aiExtractedData: ocrResult
            ? {
                vendor: ocrResult.vendor,
                itemsDetected: ocrResult.items,
                timestamp: new Date(),
                confidence: ocrResult.confidence,
              }
            : undefined,
        });
      }

      onSaved(parsedAmount, txType);
      onClose();
    } catch (err) {
      setError('Failed to save. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'flex-end',
        zIndex: 1100,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: colors['bg/page'],
          borderRadius: '24px 24px 0 0',
          padding: `${spacing.screenPadding}px`,
          paddingBottom: '120px',
          maxHeight: '92vh',
          overflowY: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '23px', fontWeight: 800, color: colors['ink/primary'], margin: 0, marginBottom: '20px', fontFamily: "'Source Serif 4', serif" }}>
          {isEditing ? 'Edit entry' : 'Add entry'}
        </h2>

        {/* Income / Expense toggle */}
        <div style={{ display: 'flex', backgroundColor: colors['brand/tint'], borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
          {(['expense', 'income'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setTxType(t)}
              style={{
                flex: 1,
                padding: '10px 0',
                borderRadius: '9px',
                backgroundColor: txType === t ? colors['surface/card'] : 'transparent',
                fontSize: '15px',
                fontWeight: txType === t ? 800 : 700,
                color: txType === t
                  ? (t === 'income' ? '#16a34a' : colors['brand/primary'])
                  : colors['ink/muted'],
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: txType === t ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {t === 'expense' ? 'Expense' : 'Income'}
            </button>
          ))}
        </div>

        {photoData && (
          <div style={{ marginBottom: '20px', borderRadius: '16px', overflow: 'hidden', border: `1px solid ${colors['border/hairline']}` }}>
            <img src={photoData} alt="Receipt" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '150px', objectFit: 'cover' }} />
            <p style={{ fontSize: '12px', fontWeight: 600, color: ocrResult ? '#16a34a' : colors['ink/muted'], padding: '8px 12px', margin: 0 }}>
              {ocrResult ? `Receipt scanned — ${Math.round(ocrResult.confidence * 100)}% confidence` : 'Receipt photo attached'}
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Date</label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>
              {txType === 'income' ? 'Source / Description' : 'Merchant / Description'}
            </label>
            <input
              type="text"
              placeholder={txType === 'income' ? 'e.g., SSA Deposit, Pension' : 'e.g., Whole Foods, Pharmacy'}
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Amount</label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={inputStyle}
            />
          </div>

          {txType === 'expense' && (
            <div style={{ marginBottom: '16px' }}>
              <label style={labelStyle}>Category</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                style={inputStyle}
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {error && (
            <p style={{ fontSize: '14px', color: colors['warning'], marginTop: '0', marginBottom: '12px', fontWeight: 600 }}>
              {error}
            </p>
          )}

          <div style={{ display: 'flex', gap: '12px', paddingTop: '4px' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                flex: 1,
                backgroundColor: colors['surface/card'],
                color: colors['brand/primary'],
                height: '56px',
                border: `2px solid ${colors['border/btn-outline']}`,
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 800,
                borderRadius: `${radius.button}px`,
                fontFamily: 'inherit',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: txType === 'income' ? '#16a34a' : colors['brand/primary'],
                color: '#fff',
                height: '56px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                fontWeight: 800,
                opacity: loading ? 0.7 : 1,
                borderRadius: `${radius.button}px`,
                fontFamily: 'inherit',
              }}
            >
              {loading ? 'Saving...' : isEditing ? 'Update' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
