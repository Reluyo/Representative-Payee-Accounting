import { useState } from 'react';
import type { Transaction } from '../../types';
import { colors, radius } from '../../design/tokens';
import { formatCurrency } from '../../utils/formatting';

interface HistoryProps {
  accountName: string;
  transactions: Transaction[];
  onEdit?: (tx: Transaction) => void;
  onDelete?: (id: number) => void;
}

type FilterTab = 'this-month' | 'all' | 'flagged';

export function History({ accountName, transactions, onEdit, onDelete }: HistoryProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('this-month');
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null);

  const now = new Date();

  let filtered = [...transactions];

  if (activeFilter === 'this-month') {
    filtered = filtered.filter(tx => {
      const txDate = new Date(tx.date);
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear();
    });
  } else if (activeFilter === 'flagged') {
    filtered = filtered.filter(tx => tx.type === 'expense' && (!tx.receipts || tx.receipts.length === 0));
  }

  // Sort newest first
  filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalExpenses = filtered.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
  const totalIncome = filtered.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);

  const headerLabel = activeFilter === 'this-month'
    ? now.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    : activeFilter === 'flagged'
    ? 'Missing receipts'
    : 'All time';

  const handleDeleteConfirm = (id: number) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteExecute = () => {
    if (confirmDeleteId !== null) {
      onDelete?.(confirmDeleteId);
      setConfirmDeleteId(null);
    }
  };

  return (
    <div className="pb-32" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh' }}>
      {/* Header */}
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
          {accountName}
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

      <div style={{ padding: '0 16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '0 2px 10px', marginTop: '16px' }}>
          <span style={{ fontFamily: "'Source Serif 4', serif", fontSize: '18px', fontWeight: 700, color: colors['ink/primary'] }}>
            {headerLabel}
          </span>
          <span style={{ fontSize: '14px', fontWeight: 700, color: colors['ink/muted'] }}>
            {filtered.length} entries
            {totalExpenses > 0 && <> · <span style={{ color: colors['ink/primary'], fontWeight: 800 }}>{formatCurrency(totalExpenses)}</span></>}
            {totalIncome > 0 && <> · <span style={{ color: '#16a34a', fontWeight: 800 }}>+{formatCurrency(totalIncome)}</span></>}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div
            style={{
              backgroundColor: colors['surface/card'],
              border: `1px solid ${colors['border/hairline']}`,
              borderRadius: `${radius.card}px`,
              padding: '32px 24px',
              textAlign: 'center',
            }}
          >
            <p style={{ fontSize: '16px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
              {activeFilter === 'flagged' ? 'No missing receipts' : 'No entries yet'}
            </p>
            {activeFilter !== 'flagged' && (
              <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/disabled'], margin: '8px 0 0 0' }}>
                Add an expense or scan a receipt to get started
              </p>
            )}
          </div>
        ) : (
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
              const isIncome = tx.type === 'income';

              return (
                <div
                  key={tx.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '16px',
                    borderBottom: idx === filtered.length - 1 ? 'none' : `1px solid ${colors['border/divider']}`,
                    backgroundColor: !isIncome && !hasReceipt ? colors['warning/bg'] : 'transparent',
                    borderLeft: !isIncome && !hasReceipt ? `4px solid ${colors['warning']}` : 'none',
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

                  <div style={{ width: '1px', alignSelf: 'stretch', backgroundColor: colors['border/divider'] }} />

                  {/* Center */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '17px', fontWeight: 700, color: colors['ink/primary'], margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {tx.description}
                    </div>
                    <div style={{ fontSize: '13px', fontWeight: 600, margin: '1px 0 0 0', color: isIncome ? '#16a34a' : (hasReceipt ? colors['ink/muted'] : colors['warning']) }}>
                      {isIncome ? 'Income' : `${tx.category} · ${hasReceipt ? 'Receipt on file' : 'Needs receipt'}`}
                    </div>
                  </div>

                  {/* Amount */}
                  <div style={{ fontSize: '18px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', flexShrink: 0, color: isIncome ? '#16a34a' : colors['ink/primary'] }}>
                    {isIncome ? '+' : ''}{formatCurrency(tx.amount)}
                  </div>

                  {/* Action buttons */}
                  {(onEdit || onDelete) && (
                    <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(tx)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: `1px solid ${colors['border/hairline']}`,
                            backgroundColor: colors['brand/tint'],
                            color: colors['brand/primary'],
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          Edit
                        </button>
                      )}
                      {onDelete && tx.id && (
                        <button
                          onClick={() => handleDeleteConfirm(tx.id!)}
                          style={{
                            padding: '6px 10px',
                            borderRadius: '8px',
                            border: `1px solid #fca5a5`,
                            backgroundColor: '#fef2f2',
                            color: '#dc2626',
                            fontSize: '12px',
                            fontWeight: 700,
                            cursor: 'pointer',
                            fontFamily: 'inherit',
                          }}
                        >
                          Del
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <div style={{ height: '14px' }} />
      </div>

      {/* Delete confirmation overlay */}
      {confirmDeleteId !== null && (
        <div
          style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '24px',
          }}
          onClick={() => setConfirmDeleteId(null)}
        >
          <div
            style={{
              backgroundColor: colors['bg/page'],
              borderRadius: '20px',
              padding: '28px 24px',
              width: '100%',
              maxWidth: '340px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '20px', fontWeight: 800, color: colors['ink/primary'], margin: '0 0 10px 0' }}>
              Delete entry?
            </h3>
            <p style={{ fontSize: '15px', color: colors['ink/muted'], fontWeight: 600, margin: '0 0 24px 0' }}>
              This will permanently remove the transaction and its receipts. This cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={() => setConfirmDeleteId(null)}
                style={{ flex: 1, height: '50px', borderRadius: '12px', border: `2px solid ${colors['border/btn-outline']}`, backgroundColor: colors['surface/card'], color: colors['brand/primary'], fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteExecute}
                style={{ flex: 1, height: '50px', borderRadius: '12px', border: 'none', backgroundColor: '#dc2626', color: '#fff', fontSize: '16px', fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit' }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
