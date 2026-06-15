import React, { useState, useEffect } from 'react';
import type { Transaction, Category, Receipt } from '../../types';
import { Card, CardHeader, CardBody } from '../UI/Card';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { ReceiptCapture } from './ReceiptCapture';
import { generateReferenceNumber } from '../../utils/formatting';
import type { OCRResult } from '../../utils/ocr';

interface TransactionFormProps {
  categories: Category[];
  accountId: number;
  onTransactionAdded: (transaction: Omit<Transaction, 'id'>) => void;
}

export function TransactionForm({ categories, accountId, onTransactionAdded }: TransactionFormProps) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.name || '');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [receipts, setReceipts] = useState<Receipt[]>([]);
  const [showReceiptCapture, setShowReceiptCapture] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (categories.length > 0 && !category) {
      setCategory(categories[0].name);
    }
  }, [categories, category]);

  const handleReceiptScanned = (scannedData: OCRResult, imageData: string) => {
    // Auto-fill transaction data from receipt
    if (scannedData.amount) {
      setAmount(scannedData.amount.toString());
    }
    if (scannedData.date) {
      setDate(scannedData.date);
    }
    if (scannedData.vendor) {
      setDescription(scannedData.vendor);
    }

    // Create receipt object
    const refNum = generateReferenceNumber(receipts.length);
    const newReceipt: Receipt = {
      referenceNumber: refNum,
      fileName: `Receipt_${new Date().getTime()}.jpg`,
      fileType: 'image/jpeg',
      fileSize: imageData.length,
      uploadedDate: new Date(),
      data: imageData,
      originalText: scannedData.text,
      extractedFields: {
        vendor: scannedData.vendor,
        amount: scannedData.amount,
        date: scannedData.date,
        items: scannedData.items,
      },
    };

    setReceipts([...receipts, newReceipt]);
    setShowReceiptCapture(false);
  };

  const handleRemoveReceipt = (index: number) => {
    setReceipts(receipts.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (!description.trim()) {
      setError('Please enter a description');
      return;
    }

    setLoading(true);

    try {
      const transaction: Omit<Transaction, 'id'> = {
        accountId,
        date: new Date(date),
        amount: parseFloat(amount),
        category,
        description: description.trim(),
        type,
        status: 'confirmed',
        receipts,
      };

      onTransactionAdded(transaction);

      // Reset form
      setDate(new Date().toISOString().split('T')[0]);
      setAmount('');
      setDescription('');
      setCategory(categories[0]?.name || '');
      setType('expense');
      setReceipts([]);
    } catch (err) {
      setError('Failed to add transaction');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <h2 className="text-2xl font-bold">Add Transaction</h2>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as 'income' | 'expense')}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          <Input
            label="Amount"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            error={error && !amount ? 'Required' : ''}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>{cat.name}</option>
              ))}
            </select>
          </div>

          <Input
            label="Description"
            placeholder="What was this for?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={error && !description ? 'Required' : ''}
          />

          {showReceiptCapture && (
            <div className="border-t pt-4">
              <ReceiptCapture onReceiptScanned={handleReceiptScanned} />
            </div>
          )}

          {receipts.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded p-3">
              <h4 className="font-semibold text-blue-900 mb-2">Receipts ({receipts.length})</h4>
              <ul className="space-y-2">
                {receipts.map((receipt, idx) => (
                  <li key={idx} className="flex justify-between items-center text-sm text-blue-800">
                    <span>{receipt.referenceNumber} - {receipt.fileName}</span>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleRemoveReceipt(idx)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowReceiptCapture(!showReceiptCapture)}
              className="flex-1"
            >
              {showReceiptCapture ? 'Hide Receipt Scanner' : '+ Add Receipt'}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>
          )}

          <div className="flex gap-2">
            <Button
              type="submit"
              variant="primary"
              loading={loading}
              className="flex-1"
            >
              Save Transaction
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  );
}
