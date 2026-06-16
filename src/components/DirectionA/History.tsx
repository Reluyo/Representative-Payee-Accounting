import { useState } from 'react';
import type { Transaction } from '../../types';
import { colors, spacing } from '../../design/tokens';
import { formatCurrency, formatDate } from '../../utils/formatting';

interface HistoryProps {
  accountName: string;
  transactions: Transaction[];
}

type FilterTab = 'all' | 'this-month' | 'needs-receipt';

export function History({ accountName, transactions }: HistoryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const categoryTile = (category: string) => {
    const categoryMap: Record<string, { bg: string; text: string; letter: string }> = {
      'Medical/Healthcare': { bg: '#E7EFFD', text: '#2F62D9', letter: 'M' },
      'Care Services': { bg: '#E2F2F1', text: '#2E8B8B', letter: 'C' },
      'Food & Groceries': { bg: '#E6F4E9', text: '#2F8B45', letter: 'G' },
      'Utilities': { bg: '#F7EEDD', text: '#B57E1F', letter: 'U' },
      'Housing & Rent': { bg: '#ECEAF8', text: '#6A5AC0', letter: 'H' },
      'Personal Care': { bg: '#F8E9EF', text: '#C45D7C', letter: 'P' },
    };
    return categoryMap[category] || { bg: colors['brand/tint'], text: colors['brand/primary'], letter: '?' };
  };

  // Filter transactions
  let filtered = transactions.filter(tx => tx.type === 'expense');

  if (activeFilter === 'this-month') {
    const now = new Date();
    filtered = filtered.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    });
  } else if (activeFilter === 'needs-receipt') {
    filtered = filtered.filter(tx => !tx.receipts || tx.receipts.length === 0);
  }

  // Group by date
  const grouped = filtered.reduce((acc, tx) => {
    const date = new Date(tx.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    let groupLabel = '';
    if (date.toDateString() === today.toDateString()) {
      groupLabel = 'TODAY';
    } else if (date.toDateString() === yesterday.toDateString()) {
      groupLabel = 'YESTERDAY';
    } else {
      const daysAgo = Math.floor((today.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      if (daysAgo < 7) {
        groupLabel = 'EARLIER THIS WEEK';
      } else if (daysAgo < 30) {
        groupLabel = 'EARLIER THIS MONTH';
      } else {
        groupLabel = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
      }
    }

    if (!acc[groupLabel]) acc[groupLabel] = [];
    acc[groupLabel].push(tx);
    return acc;
  }, {} as Record<string, Transaction[]>);

  const totalSpent = filtered.reduce((sum, tx) => sum + tx.amount, 0);
  const thisMonthCount = filtered.filter(tx => {
    const now = new Date();
    const txDate = new Date(tx.date);
    return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
  }).length;

  return (
    <div className="pb-32 pt-6" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh', paddingLeft: spacing.screenPadding, paddingRight: spacing.screenPadding }}>
      {/* Header */}
      <h1 style={{ fontSize: '30px', fontWeight: 800, color: colors['ink/primary'], margin: 0 }}>
        History
      </h1>
      <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], margin: '8px 0 24px 0' }}>
        {accountName}
      </p>

      {/* Filter pills */}
      <div className="flex gap-2 mb-6" style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        {(['all', 'this-month', 'needs-receipt'] as FilterTab[]).map(filter => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className="rounded-pill px-5 py-3 text-sm font-bold whitespace-nowrap"
            style={{
              backgroundColor: activeFilter === filter ? colors['brand/primary'] : colors['surface/card'],
              color: activeFilter === filter ? 'white' : colors['ink/primary'],
              border: activeFilter === filter ? 'none' : `1px solid ${colors['border/btn-outline']}`,
              cursor: 'pointer',
            }}
          >
            {filter === 'all' && 'All'}
            {filter === 'this-month' && 'This month'}
            {filter === 'needs-receipt' && 'Needs receipt'}
          </button>
        ))}
      </div>

      {/* Summary strip */}
      <div
        className="rounded-btn px-5 py-4 mb-6 flex justify-between items-center"
        style={{ backgroundColor: colors['brand/tint-strong'] }}
      >
        <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
          {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })} · {thisMonthCount} expenses
        </p>
        <p
          style={{
            fontSize: '18px',
            fontWeight: 800,
            color: colors['ink/primary'],
            margin: 0,
            fontVariantNumeric: 'tabular-nums',
          }}
        >
          {formatCurrency(totalSpent)}
        </p>
      </div>

      {/* Grouped transactions */}
      {Object.entries(grouped).map(([groupLabel, txs]) => (
        <div key={groupLabel} className="mb-6">
          <p
            style={{
              fontSize: '14px',
              fontWeight: 700,
              color: colors['ink/muted'],
              margin: '0 0 12px 0',
              letterSpacing: '0.5px',
              textTransform: 'uppercase',
            }}
          >
            {groupLabel}
          </p>
          <div
            className="rounded-card overflow-hidden"
            style={{ backgroundColor: colors['surface/card'], border: `1px solid ${colors['border/hairline']}` }}
          >
            {txs.map((tx, idx) => {
              const cat = categoryTile(tx.category);
              const hasReceipt = tx.receipts && tx.receipts.length > 0;
              const isNeedsReceipt = !hasReceipt;
              return (
                <div
                  key={tx.id}
                  style={{
                    borderTop: idx === 0 ? 'none' : `1px solid ${colors['border/divider']}`,
                    backgroundColor: isNeedsReceipt ? colors['warning/bg'] : 'transparent',
                  }}
                >
                  <div className="flex items-center gap-3 p-4">
                    {/* Category tile */}
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        borderRadius: '12px',
                        backgroundColor: cat.bg,
                        color: cat.text,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '20px',
                        flexShrink: 0,
                      }}
                    >
                      {cat.letter}
                    </div>

                    {/* Center: merchant, category, date, receipt status */}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '18px', fontWeight: 700, color: colors['ink/primary'], margin: 0 }}>
                        {tx.description}
                      </p>
                      <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/muted'], margin: '4px 0 0 0' }}>
                        {tx.category} · {formatDate(new Date(tx.date))} · {hasReceipt ? '✓ Receipt' : 'Needs receipt'}
                      </p>
                    </div>

                    {/* Right: amount */}
                    <p
                      style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color: colors['ink/primary'],
                        margin: 0,
                        fontVariantNumeric: 'tabular-nums',
                        flexShrink: 0,
                      }}
                    >
                      {formatCurrency(tx.amount)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
