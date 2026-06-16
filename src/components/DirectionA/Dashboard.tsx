import type { Account, Transaction } from '../../types';
import { Button } from '../UI/Button';
import { colors, spacing } from '../../design/tokens';
import { formatCurrency, formatDate } from '../../utils/formatting';

interface DashboardProps {
  account: Account | null;
  userName: string;
  recentTransactions: Transaction[];
  onAddExpense: () => void;
  onScanReceipt: () => void;
}

export function Dashboard({
  account,
  userName,
  recentTransactions,
  onAddExpense,
  onScanReceipt,
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

  return (
    <div className="pb-32 pt-6" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh', paddingLeft: spacing.screenPadding, paddingRight: spacing.screenPadding }}>
      {/* Top bar with date/greeting and avatar */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'] }}>
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
          <h1 style={{ fontSize: '23px', fontWeight: 800, color: colors['ink/primary'], margin: 0, marginTop: '4px' }}>
            Good morning, {userName}
          </h1>
        </div>
        <div
          style={{
            width: 50,
            height: 50,
            borderRadius: '50%',
            backgroundColor: colors['brand/tint'],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            fontWeight: 800,
            color: colors['brand/primary'],
          }}
        >
          {userName[0]}
        </div>
      </div>

      {/* Balance card */}
      {account && (
        <div
          className="rounded-hero p-6 mb-6"
          style={{
            backgroundColor: colors['surface/card'],
            boxShadow: '0 6px 20px rgba(22, 38, 63, 0.06)',
          }}
        >
          <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
            {account.name}
          </p>
          <p
            style={{
              fontSize: '46px',
              fontWeight: 800,
              color: colors['ink/primary'],
              margin: '8px 0 0 0',
              lineHeight: 1,
              letterSpacing: '-1px',
              fontVariantNumeric: 'tabular-nums',
            }}
          >
            {formatCurrency(account.balance)}
          </p>
          <div style={{ borderTop: `1px solid ${colors['border/divider']}`, marginTop: '16px', paddingTop: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
                Available · updated today
              </p>
              <span style={{ fontSize: '12px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: colors['positive'] }} />
            </div>
          </div>
          <div style={{ borderTop: `1px solid ${colors['border/divider']}`, marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
            <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
              Spent this month
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
              {formatCurrency(spentThisMonth)}
            </p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={onAddExpense}
          className="flex-1 rounded-btn text-white flex items-center justify-center gap-2 font-bold"
          style={{
            backgroundColor: colors['brand/primary'],
            height: '68px',
            fontSize: '18px',
            boxShadow: '0 6px 16px rgba(47, 98, 217, 0.28)',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          +<span>Add expense</span>
        </button>
        <button
          onClick={onScanReceipt}
          className="flex-1 rounded-btn font-bold flex items-center justify-center gap-2"
          style={{
            backgroundColor: colors['surface/card'],
            color: colors['brand/primary'],
            height: '68px',
            fontSize: '16px',
            border: `2px solid ${colors['border/btn-outline']}`,
            cursor: 'pointer',
          }}
        >
          📷<span>Scan receipt</span>
        </button>
      </div>

      {/* Recent activity */}
      <div className="flex justify-between items-center mb-4">
        <h2 style={{ fontSize: '19px', fontWeight: 800, color: colors['ink/primary'], margin: 0 }}>
          Recent activity
        </h2>
        <a
          href="#"
          style={{ fontSize: '15px', fontWeight: 700, color: colors['brand/primary'], textDecoration: 'none' }}
        >
          See all
        </a>
      </div>

      <div
        className="rounded-card p-0 overflow-hidden"
        style={{ backgroundColor: colors['surface/card'], border: `1px solid ${colors['border/hairline']}` }}
      >
        {recentTransactions.slice(0, 4).map((tx, idx) => {
          const cat = categoryTile(tx.category);
          const hasReceipt = tx.receipts && tx.receipts.length > 0;
          return (
            <div key={tx.id}>
              <div
                className="flex items-center gap-3 p-4"
                style={{
                  borderTop: idx === 0 ? 'none' : `1px solid ${colors['border/divider']}`,
                }}
              >
                {/* Category tile */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: '10px',
                    backgroundColor: cat.bg,
                    color: cat.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  {cat.letter}
                </div>

                {/* Center: merchant, category, date */}
                <div className="flex-1 min-w-0">
                  <p style={{ fontSize: '17px', fontWeight: 700, color: colors['ink/primary'], margin: 0 }}>
                    {tx.description}
                  </p>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/muted'], margin: '4px 0 0 0' }}>
                    {tx.category} · {formatDate(new Date(tx.date))}
                  </p>
                </div>

                {/* Right: amount and status */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <p
                    style={{
                      fontSize: '17px',
                      fontWeight: 800,
                      color: colors['ink/primary'],
                      margin: 0,
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatCurrency(tx.amount)}
                  </p>
                  <span
                    className="rounded-pill px-3 py-1 text-xs font-bold"
                    style={{
                      backgroundColor: hasReceipt ? 'transparent' : colors['warning/bg'],
                      color: hasReceipt ? colors['positive'] : colors['warning'],
                      fontSize: '13px',
                      border: hasReceipt ? 'none' : `1px solid ${colors['warning']}`,
                    }}
                  >
                    {hasReceipt ? '✓ Receipt' : '+ Add receipt'}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
