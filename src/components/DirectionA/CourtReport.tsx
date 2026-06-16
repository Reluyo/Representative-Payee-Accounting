import { useState } from 'react';
import type { Transaction } from '../../types';
import { colors, spacing, radius } from '../../design/tokens';
import { formatCurrency, formatDate } from '../../utils/formatting';

interface CourtReportProps {
  accountName: string;
  transactions: Transaction[];
  onGeneratePDF: () => void;
  onEmail: () => void;
}

export function CourtReport({ accountName, transactions, onGeneratePDF, onEmail }: CourtReportProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(0);
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);

  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return txDate >= start && txDate <= end;
  });

  // Calculate summary
  const expenses = filteredTransactions.filter(tx => tx.type === 'expense');
  const income = filteredTransactions.filter(tx => tx.type === 'income');

  const totalSpent = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);

  // Group by category
  const byCategory = expenses.reduce((acc, tx) => {
    if (!acc[tx.category]) acc[tx.category] = 0;
    acc[tx.category] += tx.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryColors: Record<string, { bg: string; text: string; letter: string }> = {
    'Medical/Healthcare': { bg: '#E7EFFD', text: '#2F62D9', letter: 'M' },
    'Care Services': { bg: '#E2F2F1', text: '#2E8B8B', letter: 'C' },
    'Food & Groceries': { bg: '#E6F4E9', text: '#2F8B45', letter: 'G' },
    'Utilities': { bg: '#F7EEDD', text: '#B57E1F', letter: 'U' },
    'Housing & Rent': { bg: '#ECEAF8', text: '#6A5AC0', letter: 'H' },
    'Personal Care': { bg: '#F8E9EF', text: '#C45D7C', letter: 'P' },
  };

  const categoryList = Object.entries(byCategory)
    .map(([cat, amount]) => ({ cat, amount, pct: (amount / totalSpent) * 100 }))
    .sort((a, b) => b.amount - a.amount);

  return (
    <div className="pb-32" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh' }}>
      {/* Header with navy card */}
      <div
        style={{
          backgroundColor: colors['header/bg'],
          borderRadius: `0 0 ${radius.hero}px ${radius.hero}px`,
          padding: '22px 16px',
          color: '#fff',
          boxShadow: '0 12px 26px rgba(30, 58, 95, 0.24)',
        }}
      >
        <div style={{ fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '8px' }}>
          Court Accounting
        </div>
        <div style={{ fontSize: '26px', fontWeight: 700, fontFamily: "'Source Serif 4', serif", color: '#fff', margin: 0 }}>
          Statement of Account
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', marginTop: '4px', fontWeight: 600 }}>
          Conservatorship of {accountName}
        </div>
      </div>

      <div style={{ padding: '8px 16px 0' }}>

        {/* Period indicator with horizontal rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 4px 14px' }}>
          <div style={{ width: '28px', height: '3px', background: colors['brand/accent'], borderRadius: '2px' }} />
          <span style={{ fontSize: '13px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: colors['ink/muted'] }}>
            {formatDate(new Date(startDate))} – {formatDate(new Date(endDate))}
          </span>
        </div>

        {/* Period card with Change button */}
        <div
          style={{
            backgroundColor: colors['surface/card'],
            border: `1px solid ${colors['border/hairline']}`,
            borderRadius: `${radius.card}px`,
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '14px',
          }}
        >
          <div>
            <div style={{ fontSize: '14px', color: colors['ink/muted'], fontWeight: 600 }}>Reporting period</div>
            <div style={{ fontSize: '19px', fontWeight: 800, color: colors['ink/primary'], marginTop: '2px' }}>
              {formatDate(new Date(startDate))} – {formatDate(new Date(endDate))}
            </div>
          </div>
          <button
            onClick={() => setShowDatePicker(true)}
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: colors['brand/primary'],
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            Change
          </button>
        </div>

        {/* Account summary */}
        <div
          style={{
            backgroundColor: colors['surface/card'],
            border: `1px solid ${colors['border/hairline']}`,
            borderRadius: `${radius.card}px`,
            overflow: 'hidden',
            marginBottom: '14px',
          }}
        >
          <div style={{ backgroundColor: colors['brand/tint'], padding: '12px 18px', fontFamily: "'Source Serif 4', serif", fontSize: '16px', fontWeight: 700, borderBottom: `1px solid ${colors['border/hairline']}` }}>
            Summary
          </div>
          <div style={{ padding: '4px 18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${colors['border/divider']}` }}>
              <span style={{ fontSize: '16px', color: colors['ink/muted'], fontWeight: 600 }}>Opening balance</span>
              <span style={{ fontSize: '16px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>$25,440.55</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${colors['border/divider']}` }}>
              <span style={{ fontSize: '16px', color: colors['ink/muted'], fontWeight: 600 }}>Total disbursements</span>
              <span style={{ fontSize: '16px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(totalSpent)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${colors['border/divider']}` }}>
              <span style={{ fontSize: '16px', color: colors['ink/muted'], fontWeight: 600 }}>Income received</span>
              <span style={{ fontSize: '16px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(totalIncome)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0' }}>
              <span style={{ fontSize: '17px', fontWeight: 800 }}>Closing balance</span>
              <span style={{ fontSize: '18px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>$12,480.55</span>
            </div>
          </div>
        </div>

        {/* Disbursements by category */}
        <div
          style={{
            backgroundColor: colors['surface/card'],
            border: `1px solid ${colors['border/hairline']}`,
            borderRadius: `${radius.card}px`,
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          <div style={{ backgroundColor: colors['brand/tint'], padding: '12px 18px', fontFamily: "'Source Serif 4', serif", fontSize: '16px', fontWeight: 700, borderBottom: `1px solid ${colors['border/hairline']}` }}>
            Disbursements by category
          </div>
          <div style={{ padding: '2px 18px' }}>
            {categoryList.map(({ cat, amount, pct }) => {
              const catColor = categoryColors[cat] || { bg: colors['brand/tint'], text: colors['brand/primary'], letter: '?' };
              return (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: `1px solid ${colors['border/divider']}` }}>
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>
                    {cat} <span style={{ color: colors['ink/muted'], fontWeight: 600, fontSize: '14px' }}>· {Math.round(pct)}%</span>
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(amount)}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <button
          onClick={onGeneratePDF}
          style={{
            width: '100%',
            height: '64px',
            border: 'none',
            borderRadius: `${radius.button}px`,
            backgroundColor: colors['brand/primary'],
            color: '#fff',
            fontSize: '18px',
            fontWeight: 800,
            fontFamily: 'inherit',
            cursor: 'pointer',
            marginBottom: '16px',
          }}
        >
          Generate court PDF
        </button>
        <button
          onClick={onEmail}
          style={{
            width: '100%',
            height: '58px',
            border: `2px solid ${colors['border/btn-outline']}`,
            borderRadius: `${radius.button}px`,
            backgroundColor: colors['surface/card'],
            color: colors['brand/primary'],
            fontSize: '17px',
            fontWeight: 800,
            fontFamily: 'inherit',
            cursor: 'pointer',
            marginBottom: '12px',
          }}
        >
          Share with attorney
        </button>

        {/* Footnote */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 0 4px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: colors['brand/accent'] }} />
          <span style={{ fontSize: '13px', color: colors['ink/muted'], fontWeight: 600 }}>
            Prepared {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · 28 receipts attached
          </span>
        </div>
        <div style={{ height: '10px' }} />
      </div>

      {/* Date Range Picker Modal */}
      {showDatePicker && (
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
          onClick={() => setShowDatePicker(false)}
        >
          <div
            style={{
              width: '100%',
              backgroundColor: colors['bg/page'],
              borderRadius: '24px 24px 0 0',
              padding: `${spacing.screenPadding}px`,
              paddingBottom: '40px',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '23px', fontWeight: 800, color: colors['ink/primary'], margin: 0, marginBottom: '24px' }}>
              Select date range
            </h2>

            <div className="space-y-4">
              <div>
                <label style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
                  Start date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: `1px solid ${colors['border/hairline']}`,
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                    color: colors['ink/primary'],
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
                  End date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px',
                    fontSize: '16px',
                    fontWeight: 600,
                    border: `1px solid ${colors['border/hairline']}`,
                    borderRadius: '12px',
                    boxSizing: 'border-box',
                    color: colors['ink/primary'],
                  }}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="flex-1 rounded-btn font-bold"
                style={{
                  backgroundColor: colors['surface/card'],
                  color: colors['brand/primary'],
                  height: '56px',
                  border: `2px solid ${colors['border/btn-outline']}`,
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowDatePicker(false)}
                className="flex-1 rounded-btn text-white font-bold"
                style={{
                  backgroundColor: colors['brand/primary'],
                  height: '56px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 700,
                }}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
