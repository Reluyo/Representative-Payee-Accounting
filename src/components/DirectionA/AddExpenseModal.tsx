import { useState } from 'react';
import type { Category, Transaction } from '../../types';
import { Button } from '../UI/Button';
import { colors, spacing } from '../../design/tokens';
import { createTransaction } from '../../db/queries';

interface AddExpenseModalProps {
  categories: Category[];
  accountId: number;
  onClose: () => void;
  onSaved: () => void;
}

export function AddExpenseModal({ categories, accountId, onClose, onSaved }: AddExpenseModalProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '');
  const [merchant, setMerchant] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!merchant.trim()) {
      setError('Please enter a merchant or description');
      return;
    }

    setLoading(true);

    try {
      await createTransaction({
        accountId,
        date: new Date(date),
        amount: parseFloat(amount),
        category,
        description: merchant.trim(),
        type: 'expense',
        status: 'confirmed',
        receipts: [],
      });

      onSaved();
      onClose();
    } catch (err) {
      setError('Failed to save expense');
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
        zIndex: 999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: '100%',
          backgroundColor: colors['bg/page'],
          borderRadius: '24px 24px 0 0',
          padding: `${spacing.screenPadding}px`,
          paddingBottom: '40px',
        }}
        onClick={e => e.stopPropagation()}
      >
        <h2 style={{ fontSize: '23px', fontWeight: 800, color: colors['ink/primary'], margin: 0, marginBottom: '24px' }}>
          Add expense
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: `1px solid ${colors['border/hairline']}`,
                borderRadius: '12px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
              Merchant / Description
            </label>
            <input
              type="text"
              placeholder="e.g., Whole Foods, Pharmacy"
              value={merchant}
              onChange={e => setMerchant(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: `1px solid ${colors['border/hairline']}`,
                borderRadius: '12px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
              Amount
            </label>
            <input
              type="number"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: `1px solid ${colors['border/hairline']}`,
                borderRadius: '12px',
                boxSizing: 'border-box',
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                fontSize: '16px',
                border: `1px solid ${colors['border/hairline']}`,
                borderRadius: '12px',
                boxSizing: 'border-box',
              }}
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <p style={{ fontSize: '14px', color: colors['warning'], marginTop: '12px' }}>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-btn font-bold"
              style={{
                backgroundColor: colors['surface/card'],
                color: colors['brand/primary'],
                height: '56px',
                border: `2px solid ${colors['border/btn-outline']}`,
                cursor: 'pointer',
                fontSize: '16px',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-btn text-white font-bold"
              style={{
                backgroundColor: colors['brand/primary'],
                height: '56px',
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontSize: '16px',
                opacity: loading ? 0.7 : 1,
              }}
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
