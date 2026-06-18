import { useEffect, useState, useRef } from 'react';
import type { Receipt, Transaction } from '../../types';
import { colors, spacing } from '../../design/tokens';
import { formatDate, formatCurrency } from '../../utils/formatting';

function useReceiptSrc(receipt: Receipt) {
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

  return src;
}

function ReceiptImage({ receipt, alt, onClick }: { receipt: Receipt; alt: string; onClick?: () => void }) {
  const src = useReceiptSrc(receipt);
  if (!src) return null;
  return (
    <img
      src={src}
      alt={alt}
      onClick={onClick}
      style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'contain', backgroundColor: colors['bg/page'], display: 'block', cursor: onClick ? 'pointer' : 'default' }}
    />
  );
}

function ReceiptViewer({ receipt, transaction, onClose }: { receipt: Receipt; transaction: Transaction; onClose: () => void }) {
  const src = useReceiptSrc(receipt);
  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const lastTouchDist = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);
  const isDragging = useRef(false);
  const lastDragPos = useRef<{ x: number; y: number } | null>(null);

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setScale(s => Math.max(0.5, Math.min(5, s - e.deltaY * 0.002)));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
      lastTouchCenter.current = {
        x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
        y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
      };
    } else if (e.touches.length === 1 && scale > 1) {
      isDragging.current = true;
      lastDragPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastTouchDist.current !== null) {
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const delta = dist / lastTouchDist.current;
      setScale(s => Math.max(0.5, Math.min(5, s * delta)));
      lastTouchDist.current = dist;
    } else if (e.touches.length === 1 && isDragging.current && lastDragPos.current) {
      const dx = e.touches[0].clientX - lastDragPos.current.x;
      const dy = e.touches[0].clientY - lastDragPos.current.y;
      setTranslate(t => ({ x: t.x + dx, y: t.y + dy }));
      lastDragPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = () => {
    lastTouchDist.current = null;
    lastTouchCenter.current = null;
    isDragging.current = false;
    lastDragPos.current = null;
  };

  const handleDoubleClick = () => {
    if (scale > 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    } else {
      setScale(2.5);
    }
  };

  if (!src) return null;

  return (
    <div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.92)', zIndex: 2000,
        display: 'flex', flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', flexShrink: 0 }}>
        <div style={{ color: '#fff', minWidth: 0 }}>
          <div style={{ fontSize: '16px', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {transaction.description}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', fontWeight: 600, marginTop: '2px' }}>
            {formatDate(new Date(transaction.date))} &middot; {formatCurrency(transaction.amount)}
          </div>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0, marginLeft: '12px',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      {/* Image area */}
      <div
        style={{ flex: 1, overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', touchAction: 'none' }}
        onWheel={handleWheel}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onDoubleClick={handleDoubleClick}
      >
        <img
          src={src}
          alt={receipt.fileName}
          draggable={false}
          style={{
            maxWidth: '100%', maxHeight: '100%', objectFit: 'contain',
            transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
            transition: isDragging.current ? 'none' : 'transform 0.15s ease',
          }}
        />
      </div>

      {/* Zoom controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', padding: '16px', flexShrink: 0 }}>
        <button
          onClick={() => setScale(s => Math.max(0.5, s - 0.5))}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '12px', padding: '10px 20px', color: '#fff', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}
        >
          −
        </button>
        <button
          onClick={() => { setScale(1); setTranslate({ x: 0, y: 0 }); }}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '12px', padding: '10px 16px', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer', minWidth: '60px' }}
        >
          {Math.round(scale * 100)}%
        </button>
        <button
          onClick={() => setScale(s => Math.min(5, s + 0.5))}
          style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '12px', padding: '10px 20px', color: '#fff', fontSize: '18px', fontWeight: 700, cursor: 'pointer' }}
        >
          +
        </button>
      </div>
    </div>
  );
}

interface ReceiptsGalleryProps {
  accountName: string;
  transactions: Transaction[];
}

export function ReceiptsGallery({ accountName, transactions }: ReceiptsGalleryProps) {
  const [viewerData, setViewerData] = useState<{ receipt: Receipt; transaction: Transaction } | null>(null);

  const receiptsWithTransactions = transactions
    .flatMap(tx =>
      (tx.receipts || []).map(receipt => ({
        receipt,
        transaction: tx,
      }))
    )
    .sort((a, b) => new Date(b.transaction.date).getTime() - new Date(a.transaction.date).getTime());

  return (
    <div className="pb-32 pt-6" style={{ backgroundColor: colors['bg/page'], minHeight: '100vh', paddingLeft: spacing.screenPadding, paddingRight: spacing.screenPadding }}>
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

            return (
              <div
                key={idx}
                onClick={() => setViewerData({ receipt, transaction })}
                style={{
                  backgroundColor: colors['surface/card'],
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: `1px solid ${colors['border/hairline']}`,
                  cursor: 'pointer',
                }}
              >
                {(receipt.blobData || receipt.data) && (
                  <ReceiptImage receipt={receipt} alt={receipt.fileName} />
                )}

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

      {viewerData && (
        <ReceiptViewer
          receipt={viewerData.receipt}
          transaction={viewerData.transaction}
          onClose={() => setViewerData(null)}
        />
      )}
    </div>
  );
}
