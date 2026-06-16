import { useState } from 'react';
import type { Transaction } from '../../types';
import { colors, spacing } from '../../design/tokens';
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
    <div className="pb-32 pt-6" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh', paddingLeft: spacing.screenPadding, paddingRight: spacing.screenPadding }}>
      {/* Header */}
      <h1 style={{ fontSize: '30px', fontWeight: 800, color: colors['ink/primary'], margin: 0 }}>
        Court report
      </h1>
      <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], margin: '8px 0 24px 0' }}>
        Ready to file with the court
      </p>

      {/* Period card */}
      <div
        className="rounded-card p-5 mb-4 flex justify-between items-start"
        style={{ backgroundColor: colors['surface/card'], border: `1px solid ${colors['border/hairline']}` }}
      >
        <div>
          <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
            Reporting period
          </p>
          <p style={{ fontSize: '19px', fontWeight: 800, color: colors['ink/primary'], margin: '6px 0 0 0' }}>
            {formatDate(new Date(startDate))} – {formatDate(new Date(endDate))}
          </p>
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

      {/* Account summary card */}
      <div
        className="rounded-card p-5 mb-4"
        style={{ backgroundColor: colors['surface/card'], border: `1px solid ${colors['border/hairline']}` }}
      >
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: colors['ink/primary'], margin: 0 }}>
          Account summary
        </h3>
        <div className="mt-4 space-y-3">
          <div
            className="flex justify-between py-3"
            style={{ borderBottom: `1px solid ${colors['border/divider']}` }}
          >
            <p style={{ fontSize: '16px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
              Opening balance
            </p>
            <p
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: colors['ink/primary'],
                margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              $25,440.55
            </p>
          </div>
          <div
            className="flex justify-between py-3"
            style={{ borderBottom: `1px solid ${colors['border/divider']}` }}
          >
            <p style={{ fontSize: '16px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
              Total spent
            </p>
            <p
              style={{
                fontSize: '17px',
                fontWeight: 800,
                color: colors['ink/primary'],
                margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatCurrency(totalSpent)}
            </p>
          </div>
          <div className="flex justify-between py-3">
            <p style={{ fontSize: '16px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
              Closing balance
            </p>
            <p
              style={{
                fontSize: '18px',
                fontWeight: 800,
                color: colors['positive'],
                margin: 0,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              $12,480.55
            </p>
          </div>
        </div>
      </div>

      {/* Breakdown card */}
      <div
        className="rounded-card p-5 mb-6"
        style={{ backgroundColor: colors['surface/card'], border: `1px solid ${colors['border/hairline']}` }}
      >
        <h3 style={{ fontSize: '17px', fontWeight: 800, color: colors['ink/primary'], margin: 0 }}>
          Where the money went
        </h3>
        <div className="mt-4 space-y-5">
          {categoryList.map(({ cat, amount, pct }) => {
            const catColor = categoryColors[cat] || { bg: colors['brand/tint'], text: colors['brand/primary'], letter: '?' };
            return (
              <div key={cat}>
                <div className="flex items-center gap-3 mb-2">
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: '8px',
                      backgroundColor: catColor.bg,
                      color: catColor.text,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '16px',
                    }}
                  >
                    {catColor.letter}
                  </div>
                  <div className="flex-1">
                    <p style={{ fontSize: '16px', fontWeight: 700, color: colors['ink/primary'], margin: 0 }}>
                      {cat}
                    </p>
                  </div>
                  <p
                    style={{
                      fontSize: '16px',
                      fontWeight: 800,
                      color: colors['ink/primary'],
                      margin: 0,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatCurrency(amount)}
                  </p>
                </div>
                {/* Proportion bar */}
                <div
                  style={{
                    height: '8px',
                    borderRadius: '4px',
                    backgroundColor: colors['border/hairline'],
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      height: '100%',
                      width: `${pct}%`,
                      backgroundColor: catColor.text,
                    }}
                  />
                </div>
                <p style={{ fontSize: '13px', fontWeight: 700, color: colors['ink/muted'], margin: '4px 0 0 0' }}>
                  {Math.round(pct)}%
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <button
        onClick={onGeneratePDF}
        className="w-full rounded-btn text-white font-bold mb-3"
        style={{
          backgroundColor: colors['brand/primary'],
          height: '68px',
          fontSize: '17px',
          boxShadow: '0 6px 16px rgba(47, 98, 217, 0.28)',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        Create PDF report
      </button>
      <button
        onClick={onEmail}
        className="w-full rounded-btn font-bold mb-6"
        style={{
          backgroundColor: colors['surface/card'],
          color: colors['brand/primary'],
          height: '60px',
          fontSize: '16px',
          border: `2px solid ${colors['border/btn-outline']}`,
          cursor: 'pointer',
        }}
      >
        Email to my attorney
      </button>

      {/* Footnote */}
      <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/disabled'], margin: '0', textAlign: 'center' }}>
        Every expense includes its receipt and date.
      </p>

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
