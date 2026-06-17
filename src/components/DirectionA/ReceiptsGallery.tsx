import { useEffect, useState } from 'react';
import type { Receipt, Transaction } from '../../types';
import { colors, spacing } from '../../design/tokens';
import { formatDate, formatCurrency } from '../../utils/formatting';

function ReceiptImage({ receipt, alt }: { receipt: Receipt; alt: string }) {
  const [src, setSrc] = useState('');

  useEffect(() => {
    if (receipt.blobData) {
      const url = URL.createObjectURL(receipt.blobData);
      setSrc(url);
      return () => URL.revokeObjectURL(url);
    } else if (receipt.data) {
      setSrc(receipt.data);
    }
  }, [receipt]);

  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      style={{ width: '100%', height: '140px', objectFit: 'cover', backgroundColor: colors['bg/page'], display: 'block' }}
    />
  );
}

interface ReceiptsGalleryProps {
  accountName: string;
  transactions: Transaction[];
}

export function ReceiptsGallery({ accountName, transactions }: ReceiptsGalleryProps) {
  // Collect all receipts with their transaction info
  const receiptsWithTransactions = transactions
    .flatMap(tx =>
      (tx.receipts || []).map(receipt => ({
        receipt,
        transaction: tx,
      }))
    )
    .sort((a, b) => b.transaction.date.getTime() - a.transaction.date.getTime());

  return (
    <div className="pb-32 pt-6" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh', paddingLeft: spacing.screenPadding, paddingRight: spacing.screenPadding }}>
      {/* Header */}
      <h1 style={{ fontSize: '30px', fontWeight: 800, color: colors['ink/primary'], margin: 0 }}>
        Receipts
      </h1>
      <p style={{ fontSize: '15px', fontWeight: 600, color: colors['ink/muted'], margin: '8px 0 24px 0 ' }}>
        {accountName}
      </p>

      {receiptsWithTransactions.length === 0 ? (
        <div
          style={{
            backgroundColor: colors['surface/card'],
            borderRadius: '20px',
            padding: '32px 24px',
            textAlign: 'center',
            border: `1px solid ${colors['border/hairline']}`,
          }}
        >
          <p style={{ fontSize: '16px', fontWeight: 600, color: colors['ink/muted'], margin: 0 }}>
            No receipts yet
          </p>
          <p style={{ fontSize: '14px', fontWeight: 600, color: colors['ink/disabled'], margin: '8px 0 0 0' }}>
            Scan or upload receipts when you add expenses
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {receiptsWithTransactions.map((item, idx) => {
            const { receipt, transaction } = item;
            const catColor = colors['brand/primary'];

            return (
              <div
                key={idx}
                style={{
                  backgroundColor: colors['surface/card'],
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `1px solid ${colors['border/hairline']}`,
                }}
              >
                {/* Receipt image */}
                {(receipt.blobData || receipt.data) && (
                  <ReceiptImage receipt={receipt} alt={receipt.fileName} />
                )}

                {/* Receipt info */}
                <div style={{ padding: '12px' }}>
                  <p style={{ fontSize: '13px', fontWeight: 700, color: colors['ink/primary'], margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {transaction.description}
                  </p>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: colors['ink/muted'], margin: '4px 0 0 0' }}>
                    {formatDate(new Date(transaction.date))}
                  </p>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: 800,
                      color: colors['brand/primary'],
                      margin: '6px 0 0 0',
                      fontVariantNumeric: 'tabular-nums',
                    }}
                  >
                    {formatCurrency(transaction.amount)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
