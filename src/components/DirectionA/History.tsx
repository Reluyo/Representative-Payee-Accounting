import { useState } from 'react';
import type { Transaction } from '../../types';
import { colors, radius } from '../../design/tokens';
import { formatCurrency } from '../../utils/formatting';

interface HistoryProps {
  accountName: string;
  transactions: Transaction[];
}

type FilterTab = 'this-month' | 'all' | 'flagged';

export function History({ accountName, transactions }: HistoryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('this-month');

  // Filter transactions
  let filtered = transactions.filter(tx => tx.type === 'expense');

  if (activeFilter === 'this-month') {
    const now = new Date();
    filtered = filtered.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    });
  } else if (activeFilter === 'flagged') {
    filtered = filtered.filter(tx => !tx.receipts || tx.receipts.length === 0);
  }

  const totalSpent = filtered.reduce((sum, tx) => sum + tx.amount, 0);
  const thisMonthTxs = transactions.filter(tx => {
    const now = new Date();
    const txDate = new Date(tx.date);
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear() && tx.type === 'expense';
  });

  return (
    <div className="pb-32" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh' }}>
      {/* Header with navy card */}
      <div
        style={{
          backgroundColor: colors['header/bg'],
          borderRadius: `0 0 ${radius.hero}px ${radius.hero}px`,
          padding: '20px 16px 22px',
          color: '#fff',
          boxShadow: '0 12px 26px rgba(30, 58, 95, 0.24)',
        }}
      >
        <div style={{ fontSize: '25px', fontWeight: 700, fontFamily: "'Source Serif 4', serif", margin: 0 }}>
          Expense History
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', marginTop: '3px', fontWeight: 600 }}>
          {accountName} · 2026
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ padding: '8px 16px 0' }}>
        <div style={{ display: 'flex', backgroundColor: colors['brand/tint'], borderRadius: '12px', padding: '4px', marginTop: '14px', marginBottom: '14px' }}>
          {(['this-month', 'all', 'flagged'] as FilterTab[]).map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              style={{
                flex: 1,
                textAlign: 'center',
                padding: '10px 0',
                borderRadius: '9px',
                backgroundColor: activeFilter === filter ? colors['surface/card'] : 'transparent',
                fontSize: '15px',
                fontWeight: activeFilter === filter ? 800 : 700,
                color: activeFilter === filter ? colors['brand/primary'] : colors['ink/muted'],
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: activeFilter === filter ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
              }}
            >
              {filter === 'this-month' && 'This month'}
              {filter === 'all' && 'All'}
              {filter === 'flagged' && 'Flagged'}
            </button>
          ))}
        </div>
      </div>

      {/* Summary and transactions */}
      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '0 2px 10px', marginTop: '16px' }}>
          <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '18px', fontWeight: 700, color: colors['ink/primary'] }}>
            {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors['ink/muted'] }}>
            {filtered.length} entries · <span style={{ color: colors['ink/primary'], fontWeight: 800 }}>{formatCurrency(totalSpent)}</span>
          </span>
        </div>

        <div
          style={{
            backgroundColor: colors['surface/card'],
            border: `1px solid ${colors['border/hairline']}`,
            borderRadius: `${radius.card}px`,
            overflow: 'hidden',
          }}
        >
          {filtered.map((tx, idx) => {
            const hasReceipt = tx.receipts && tx.receipts.length > 0;
            const txDate = new Date(tx.date);
            const monthStr = txDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = txDate.getDate().toString();

            return (
              <div
                key={tx.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: '16px',
                  borderBottom: idx === filtered.length - 1 ? 'none' : `1px solid ${colors['border/divider']}`,
                  backgroundColor: !hasReceipt ? colors['warning/bg'] : 'transparent',
                  borderLeft: !hasReceipt ? `4px solid ${colors['warning']}` : 'none',
                }}
              >
                {/* Date box */}
                <div style={{ textAlign: 'center', width: '40px', flexShrink: 0 }}>
                  <div style={{ fontSize: '11px', fontWeight: 700, color: colors['ink/muted'], textTransform: 'uppercase' }}>
                    {monthStr}
                  </div>
                  <div style={{ fontSize: '19px', fontWeight: 800, lineHeight: 1, color: colors['ink/primary'] }}>
                    {dayStr}
                  </div>
                </div>

                {/* Divider */}
                <div style={{ width: '1px', alignSelf: 'stretch', backgroundColor: colors['border/divider'] }} />

                {/* Center: merchant and category */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '17px', fontWeight: 700, color: colors['ink/primary'], margin: 0 }}>
                    {tx.description}
                  </div>
                  <div style={{ fontSize: '13px', color: hasReceipt ? colors['ink/muted'] : colors['warning'], fontWeight: hasReceipt ? 600 : 700, margin: '1px 0 0 0' }}>
                    {tx.category} · {hasReceipt ? 'Receipt on file' : 'Needs receipt'}
                  </div>
                </div>

                {/* Right: amount */}
                <div style={{ fontSize: '18px', fontWeight: 800, color: colors['ink/primary'], fontVariantNumeric: 'tabular-nums', flexShrink: 0 }}>
                  {formatCurrency(tx.amount)}
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ height: '14px' }} />
      </div>
    </div>
  );
}
