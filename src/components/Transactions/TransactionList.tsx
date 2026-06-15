import type { Transaction } from '../../types';
import { Card, CardHeader, CardBody } from '../UI/Card';
import { Button } from '../UI/Button';
import { formatCurrency, formatDate } from '../../utils/formatting';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: number) => void;
  loading?: boolean;
}

export function TransactionList({ transactions, onDeleteTransaction, loading }: TransactionListProps) {
  if (loading) {
    return <Card><CardBody><p className="text-gray-500">Loading transactions...</p></CardBody></Card>;
  }

  if (transactions.length === 0) {
    return (
      <Card>
        <CardBody>
          <p className="text-gray-500 text-center">No transactions yet. Add one to get started.</p>
        </CardBody>
      </Card>
    );
  }

  const sortedTransactions = [...transactions].sort((a, b) => b.date.getTime() - a.date.getTime());

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Recent Transactions</h2>
        <p className="text-gray-600 text-sm">{transactions.length} total</p>
      </CardHeader>
      <CardBody>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Date</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Description</th>
                <th className="text-left py-3 px-2 font-semibold text-gray-700">Category</th>
                <th className="text-right py-3 px-2 font-semibold text-gray-700">Amount</th>
                <th className="text-center py-3 px-2 font-semibold text-gray-700">Receipt</th>
                <th className="text-center py-3 px-2 font-semibold text-gray-700">Action</th>
              </tr>
            </thead>
            <tbody>
              {sortedTransactions.map((tx) => (
                <tr key={tx.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 text-sm">{formatDate(new Date(tx.date))}</td>
                  <td className="py-3 px-2 text-sm">{tx.description}</td>
                  <td className="py-3 px-2 text-sm">{tx.category}</td>
                  <td className={`py-3 px-2 text-sm text-right font-semibold ${
                    tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                  </td>
                  <td className="py-3 px-2 text-center text-sm">
                    {tx.receipts && tx.receipts.length > 0 ? (
                      <span className="text-blue-600 font-semibold">{tx.receipts.length} 📎</span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => tx.id && onDeleteTransaction(tx.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}
