import type { Account, Transaction } from '../../types';
import { Button } from '../UI/Button';
import { colors, spacing, radius } from '../../design/tokens';
import { formatCurrency, formatDate } from '../../utils/formatting';

interface DashboardProps {
  account: Account | null;
  accounts: Account[];
  userName: string;
  recentTransactions: Transaction[];
  onAddExpense: () => void;
  onScanReceipt: () => void;
  onSettings?: () => void;
  onViewAll?: () => void;
  onAccountChange?: (id: number) => void;
}

export function Dashboard({
  account,
  accounts,
  userName,
  recentTransactions,
  onAddExpense,
  onScanReceipt,
  onSettings,
  onViewAll,
  onAccountChange,
}: DashboardProps) {
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
      {/* Header */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.7)' }}>
                Guardian · {userName}
              </span>
              {onSettings && (
                <button
                  onClick={onSettings}
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                    border: 'none',
                    borderRadius: '8px',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'rgba(255,255,255,0.85)',
                    fontSize: '16px',
                  }}
                  aria-label="Settings"
                >
                  ⚙
                </button>
              )}
            </div>
          </div>
          {accounts.length > 1 && onAccountChange ? (
            <select
              value={account.id}
              onChange={e => onAccountChange(Number(e.target.value))}
              style={{
                fontSize: '17px',
                fontWeight: 600,
                fontFamily: "'Source Serif 4', serif",
                color: 'rgba(255,255,255,0.92)',
                backgroundColor: 'transparent',
                border: 'none',
                outline: 'none',
                cursor: 'pointer',
                margin: '0 0 14px 0',
                padding: 0,
                width: '100%',
              }}
            >
              {accounts.map(a => (
                <option key={a.id} value={a.id} style={{ color: '#000', backgroundColor: '#fff' }}>
                  {a.name}
                </option>
              ))}
            </select>
          ) : (
            <p style={{ fontSize: '19px', fontWeight: 600, fontFamily: "'Source Serif 4', serif", color: 'rgba(255,255,255,0.92)', margin: '0 0 14px 0' }}>
              {account.name}
            </p>
          )}
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

      {/* Stat cards */}
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
          <button
            onClick={onViewAll}
            style={{
              fontSize: '15px',
              fontWeight: 700,
              color: colors['brand/primary'],
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              fontFamily: 'inherit',
            }}
          >
            View all
          </button>
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
          {recentTransactions.length === 0 ? (
            <div style={{ padding: '28px 16px', textAlign: 'center' }}>
              <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>No entries yet</p>
              <p style={{ fontSize: '13px', fontWeight: 600, color: colors['ink/disabled'], margin: '6px 0 0 0' }}>Add an expense or scan a receipt to get started</p>
            </div>
          ) : (
            recentTransactions.slice(0, 4).map((tx, idx) => {
              const hasReceipt = tx.receipts && tx.receipts.length > 0;
              const txDate = new Date(tx.date);
              const monthStr = txDate.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
              const dayStr = txDate.getDate().toString();
              const isIncome = tx.type === 'income';

              return (
                <div key={tx.id}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '15px 16px',
                      borderBottom: idx === Math.min(recentTransactions.length, 4) - 1 ? 'none' : `1px solid ${colors['border/divider']}`,
                      backgroundColor: !isIncome && !hasReceipt ? colors['warning/bg'] : 'transparent',
                      borderLeft: !isIncome && !hasReceipt ? `4px solid ${colors['warning']}` : 'none',
                    }}
                  >
                    <div style={{ textAlign: 'center', width: '40px', flexShrink: 0 }}>
                      <div style={{ fontSize: '11px', fontWeight: 700, color: colors['ink/muted'], textTransform: 'uppercase' }}>
                        {monthStr}
                      </div>
                      <div style={{ fontSize: '19px', fontWeight: 800, lineHeight: 1, color: colors['ink/primary'] }}>
                        {dayStr}
                      </div>
                    </div>

                    <div style={{ width: '1px', alignSelf: 'stretch', backgroundColor: colors['border/divider'] }} />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '17px', fontWeight: 700, color: colors['ink/primary'], margin: 0 }}>
                        {tx.description}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 600, margin: '1px 0 0 0', color: isIncome ? '#16a34a' : (hasReceipt ? colors['ink/muted'] : colors['warning']) }}>
                        {isIncome ? 'Income' : `${tx.category} · ${hasReceipt ? 'Receipt on file' : 'Needs receipt'}`}
                      </div>
                    </div>

                    <div style={{ fontSize: '18px', fontWeight: 800, fontVariantNumeric: 'tabular-nums', flexShrink: 0, color: isIncome ? '#16a34a' : colors['ink/primary'] }}>
                      {isIncome ? '+' : ''}{formatCurrency(tx.amount)}
                    </div>
                  </div>
                </div>
              );
            })
          )}
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
            Add entry
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
