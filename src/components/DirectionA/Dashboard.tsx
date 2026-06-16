import type { Account, Transaction } from '../../types';
import { Button } from '../UI/Button';
import { colors, spacing, radius } from '../../design/tokens';
import { formatCurrency, formatDate } from '../../utils/formatting';

interface DashboardProps {
  account: Account | null;
  userName: string;
  recentTransactions: Transaction[];
  onAddExpense: () => void;
  onScanReceipt: () => void;
  onSettings?: () => void;
}

export function Dashboard({
  account,
  userName,
  recentTransactions,
  onAddExpense,
  onScanReceipt,
  onSettings,
}: DashboardProps) {
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

  const spentThisMonth = recentTransactions
    .filter(tx => {
      const now = new Date();
      const txDate = new Date(tx.date);
      return txDate.getMonth() === now.getMonth() && txDate.getFullYear() === now.getFullYear() && tx.type === 'expense';
    })
    .reduce((sum, tx) => sum + tx.amount, 0);

  const receiptCount = recentTransactions.filter(tx => tx.receipts && tx.receipts.length > 0).length;

  return (
    <div className="pb-32" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh' }}>
      {/* Header with account info - Navy card style */}
      {account && (
        <div
          style={{
            backgroundColor: colors['header/bg'],
            borderRadius: `0 0 ${radius.hero}px ${radius.hero}px`,
            padding: '22px 16px 24px',
            color: '#fff',
            boxShadow: colors['shadow/card'] || '0 12px 26px rgba(30, 58, 95, 0.24)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '14px' }}>
            <span>Steward</span>
            <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>Guardian · {userName}</span>
          </div>
          <p style={{ fontSize: '19px', fontWeight: 600, fontFamily: "'Source Serif 4', serif", color: 'rgba(255,255,255,0.92)', margin: '0 0 14px 0' }}>
            {account.name}
          </p>
          <p
            style={{
              fontSize: '42px',
              fontWeight: 700,
              fontFamily: "'Source Serif 4', serif",
              color: '#fff',
              margin: '4px 0 8px 0',
              lineHeight: 1,
              letterSpacing: '-0.5px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatCurrency(account.balance)}
          </p>
          <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.72)', margin: 0, fontWeight: 600 }}>
            Available balance · as of {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      )}

      {/* Stat cards - Spent this month & Receipts on file */}
      <div style={{ padding: '14px 16px', display: 'flex', gap: '12px' }}>
        <div
          style={{
            flex: 1,
            backgroundColor: colors['surface/card'],
            border: `1px solid ${colors['border/hairline']}`,
            borderRadius: `${radius.card}px`,
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '13px', color: colors['ink/muted'], fontWeight: 600 }}>Spent this month</div>
          <div style={{ fontSize: '23px', fontWeight: 800, margin: '4px 0 0 0', color: colors['ink/primary'], fontVariantNumeric: 'tabular-nums' }}>
            {formatCurrency(spentThisMonth)}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            backgroundColor: colors['surface/card'],
            border: `1px solid ${colors['border/hairline']}`,
            borderRadius: `${radius.card}px`,
            padding: '16px',
          }}
        >
          <div style={{ fontSize: '13px', color: colors['ink/muted'], fontWeight: 600 }}>Receipts on file</div>
          <div style={{ fontSize: '23px', fontWeight: 800, margin: '4px 0 0 0', color: colors['ink/primary'] }}>
            {receiptCount} <span style={{ fontSize: '15px', color: colors['ink/muted'], fontWeight: 700 }}>of {recentTransactions.length}</span>
          </div>
        </div>
      </div>

      {/* Recent entries section */}
      <div style={{ padding: '22px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '12px' }}>
          <div style={{ fontSize: '21px', fontWeight: 700, fontFamily: "'Source Serif 4', serif", color: colors['ink/primary'], margin: 0 }}>
            Recent entries
          </div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: colors['brand/primary'] }}>View all</div>
        </div>

        <div
          style={{
            backgroundColor: colors['surface/card'],
            border: `1px solid ${colors['border/hairline']}`,
            borderRadius: `${radius.card}px`,
            overflow: 'hidden',
            marginBottom: '16px',
          }}
        >
          {recentTransactions.slice(0, 4).map((tx, idx) => {
            const hasReceipt = tx.receipts && tx.receipts.length > 0;
            const txDate = new Date(tx.date);
            const monthStr = txDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
            const dayStr = txDate.getDate().toString();

            return (
              <div key={tx.id}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '15px 16px',
                    borderBottom: idx === recentTransactions.slice(0, 4).length - 1 ? 'none' : `1px solid ${colors['border/divider']}`,
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
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
          <button
            onClick={onAddExpense}
            style={{
              flex: 1,
              height: '62px',
              border: 'none',
              borderRadius: `${radius.button}px`,
              backgroundColor: colors['brand/primary'],
              color: '#fff',
              fontSize: '17px',
              fontWeight: 800,
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            Add expense
          </button>
          <button
            onClick={onScanReceipt}
            style={{
              flex: 1,
              height: '62px',
              border: `2px solid ${colors['border/btn-outline']}`,
              borderRadius: `${radius.button}px`,
              backgroundColor: colors['surface/card'],
              color: colors['brand/primary'],
              fontSize: '17px',
              fontWeight: 800,
              fontFamily: 'inherit',
              cursor: 'pointer',
            }}
          >
            Scan receipt
          </button>
        </div>
      </div>
    </div>
  );
}
