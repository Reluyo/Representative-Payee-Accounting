import { useState } from 'react';
import type { Account, Transaction } from '../../types';
import { colors, spacing, radius } from '../../design/tokens';
import { formatCurrency, formatDate } from '../../utils/formatting';

interface CourtReportProps {
  account: Account;
  transactions: Transaction[];
  onGeneratePDF: (startDate: Date, endDate: Date) => void;
  onEmail: (startDate: Date, endDate: Date) => void;
}

export function CourtReport({ account, transactions, onGeneratePDF, onEmail }: CourtReportProps) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setMonth(0);
    date.setDate(1);
    return date.toISOString().split('T')[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split('T')[0]);
  // Temp state for the picker — only commit on "Apply"
  const [tempStart, setTempStart] = useState(startDate);
  const [tempEnd, setTempEnd] = useState(endDate);

  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.date);
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    return txDate >= start && txDate <= end;
  });

  const expenses = filteredTransactions.filter(tx => tx.type === 'expense');
  const income = filteredTransactions.filter(tx => tx.type === 'income');

  const totalSpent = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);

  // Compute opening balance by reversing the period's transactions from the current balance
  const closingBalance = account.balance;
  const openingBalance = closingBalance - totalIncome + totalSpent;

  const byCategory = expenses.reduce((acc, tx) => {
    if (!acc[tx.category]) acc[tx.category] = 0;
    acc[tx.category] += tx.amount;
    return acc;
  }, {} as Record<string, number>);

  const categoryList = Object.entries(byCategory)
    .map(([cat, amount]) => ({ cat, amount, pct: totalSpent > 0 ? (amount / totalSpent) * 100 : 0 }))
    .sort((a, b) => b.amount - a.amount);

  const receiptCount = filteredTransactions.filter(tx => tx.receipts && tx.receipts.length > 0).length;

  const openPicker = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setShowDatePicker(true);
  };

  const applyDates = () => {
    setStartDate(tempStart);
    setEndDate(tempEnd);
    setShowDatePicker(false);
  };

  const cancelPicker = () => {
    // Discard temp changes
    setShowDatePicker(false);
  };

  const handleGeneratePDF = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    onGeneratePDF(start, end);
  };

  const handleEmail = () => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(23, 59, 59, 999);
    onEmail(start, end);
  };

  return (
    <div className="pb-32" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh' }}>
      {/* Header */}
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
          Account for {account.name}
        </div>
      </div>

      <div style={{ padding: '8px 16px 0' }}>

        {/* Period indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '18px 4px 14px' }}>
          <div style={{ width: '28px', height: '3px', background: colors['brand/accent'], borderRadius: '2px' }} />
          <span style={{ fontSize: '14px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: colors['ink/muted'] }}>
            {formatDate(new Date(startDate))} – {formatDate(new Date(endDate))}
          </span>
        </div>

        {/* Period card */}
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
            onClick={openPicker}
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
              <span style={{ fontSize: '16px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(openingBalance)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${colors['border/divider']}` }}>
              <span style={{ fontSize: '16px', color: colors['ink/muted'], fontWeight: 600 }}>Total spent</span>
              <span style={{ fontSize: '16px', fontWeight: 700, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(totalSpent)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '13px 0', borderBottom: `1px solid ${colors['border/divider']}` }}>
              <span style={{ fontSize: '16px', color: colors['ink/muted'], fontWeight: 600 }}>Income received</span>
              <span style={{ fontSize: '16px', fontWeight: 700, fontVariantNumeric: 'tabular-nums', color: '#16a34a' }}>{formatCurrency(totalIncome)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0' }}>
              <span style={{ fontSize: '17px', fontWeight: 800 }}>Closing balance</span>
              <span style={{ fontSize: '18px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(closingBalance)}</span>
            </div>
          </div>
        </div>

        {/* Disbursements by category */}
        {categoryList.length > 0 && (
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
              Expenses by category
            </div>
            <div style={{ padding: '2px 18px' }}>
              {categoryList.map(({ cat, amount, pct }) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '13px 0', borderBottom: `1px solid ${colors['border/divider']}` }}>
                  <span style={{ fontSize: '16px', fontWeight: 700 }}>
                    {cat} <span style={{ color: colors['ink/muted'], fontWeight: 600, fontSize: '14px' }}>· {Math.round(pct)}%</span>
                  </span>
                  <span style={{ fontSize: '16px', fontWeight: 800, fontVariantNumeric: 'tabular-nums' }}>{formatCurrency(amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {filteredTransactions.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: colors['ink/muted'], fontWeight: 600, fontSize: '15px' }}>
            No transactions in this period.
          </div>
        )}

        {/* Action buttons */}
        <button
          onClick={handleGeneratePDF}
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
            marginBottom: '12px',
          }}
        >
          Generate court PDF
        </button>
        <button
          onClick={handleEmail}
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
          Email report
        </button>

        {/* Footnote */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 0 4px' }}>
          <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: colors['brand/accent'] }} />
          <span style={{ fontSize: '14px', color: colors['ink/muted'], fontWeight: 600 }}>
            Prepared {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            {receiptCount > 0 ? ` · ${receiptCount} receipt${receiptCount !== 1 ? 's' : ''} attached` : ' · No receipts attached'}
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
          onClick={cancelPicker}
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

            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
                Start date
              </label>
              <input
                type="date"
                value={tempStart}
                onChange={e => setTempStart(e.target.value)}
                style={{ width: '100%', padding: '12px', fontSize: '16px', fontWeight: 600, border: `1px solid ${colors['border/hairline']}`, borderRadius: '12px', boxSizing: 'border-box', color: colors['ink/primary'] }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], display: 'block', marginBottom: '8px' }}>
                End date
              </label>
              <input
                type="date"
                value={tempEnd}
                onChange={e => setTempEnd(e.target.value)}
                style={{ width: '100%', padding: '12px', fontSize: '16px', fontWeight: 600, border: `1px solid ${colors['border/hairline']}`, borderRadius: '12px', boxSizing: 'border-box', color: colors['ink/primary'] }}
              />
            </div>

            {/* Quick presets */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
              {[
                { label: 'This year', start: `${new Date().getFullYear()}-01-01`, end: new Date().toISOString().split('T')[0] },
                { label: 'Last month', start: (() => { const d = new Date(); d.setMonth(d.getMonth() - 1, 1); return d.toISOString().split('T')[0]; })(), end: (() => { const d = new Date(); d.setDate(0); return d.toISOString().split('T')[0]; })() },
                { label: 'This month', start: `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-01`, end: new Date().toISOString().split('T')[0] },
              ].map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => { setTempStart(p.start); setTempEnd(p.end); }}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: `1px solid ${colors['border/btn-outline']}`,
                    backgroundColor: colors['brand/tint'],
                    color: colors['brand/primary'],
                    fontSize: '14px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                type="button"
                onClick={cancelPicker}
                style={{
                  flex: 1,
                  backgroundColor: colors['surface/card'],
                  color: colors['brand/primary'],
                  height: '56px',
                  border: `2px solid ${colors['border/btn-outline']}`,
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 700,
                  borderRadius: `${radius.button}px`,
                  fontFamily: 'inherit',
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={applyDates}
                style={{
                  flex: 1,
                  backgroundColor: colors['brand/primary'],
                  color: '#fff',
                  height: '56px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 700,
                  borderRadius: `${radius.button}px`,
                  fontFamily: 'inherit',
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
