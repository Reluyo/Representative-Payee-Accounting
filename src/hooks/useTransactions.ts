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
      await fetchTransactions();
      return id;
    } catch (error) {
      console.error('Failed to create transaction:', error);
      throw error;
    }
  }, [accountId, fetchTransactions]);

  const updateTx = useCallback(async (id: number, updates: Partial<Transaction>) => {
    try {
      await updateTransaction(id, updates);
      await fetchTransactions();
    } catch (error) {
      console.error('Failed to update transaction:', error);
      throw error;
    }
  }, [fetchTransactions]);

  const deleteTx = useCallback(async (id: number) => {
    try {
      await deleteTransaction(id);
      await fetchTransactions();
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      throw error;
    }
  }, [fetchTransactions]);

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
