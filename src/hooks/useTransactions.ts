import { useState, useCallback, useEffect } from 'react';
import type { Transaction, Receipt } from '../types';
import {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  createReceipt,
} from '../db/queries';

export function useTransactions(accountId: number | null) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = useCallback(async (startDate?: Date, endDate?: Date) => {
    if (!accountId) return;
    setLoading(true);
    try {
      const data = await getTransactions(accountId, startDate, endDate);
      // Sort newest first
      data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  const addTransaction = useCallback(async (transaction: Omit<Transaction, 'id'>) => {
    if (!accountId) return;
    try {
      const id = await createTransaction(transaction);
      // Optimistic: prepend to state rather than full refetch
      const newTx: Transaction = { ...transaction, id: id as number };
      setTransactions(prev => [newTx, ...prev]);
      return id;
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  }, [accountId]);

  const updateTx = useCallback(async (id: number, updates: Partial<Transaction>) => {
    try {
      await updateTransaction(id, updates);
      setTransactions(prev =>
        prev.map(tx => tx.id === id ? { ...tx, ...updates } : tx)
      );
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    }
  }, []);

  const deleteTx = useCallback(async (id: number) => {
    try {
      await deleteTransaction(id);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw error;
    }
  }, []);

  const addReceipt = useCallback(async (transactionId: number, receipt: Omit<Receipt, 'id'>) => {
    try {
      const id = await createReceipt({ ...receipt, transactionId });
      return id;
    } catch (error) {
      console.error('Failed to add receipt:', error);
      throw error;
    }
  }, []);

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  return {
    transactions,
    loading,
    fetchTransactions,
    addTransaction,
    updateTransaction: updateTx,
    deleteTransaction: deleteTx,
    addReceipt,
  };
}
