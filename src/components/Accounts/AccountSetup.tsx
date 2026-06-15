import React, { useState } from 'react';
import type { Account } from '../../types';
import { Card, CardHeader, CardBody } from '../UI/Card';
import { Input } from '../UI/Input';
import { Button } from '../UI/Button';
import { createAccount } from '../../db/queries';

interface AccountSetupProps {
  onAccountCreated: (account: Account) => void;
}

export function AccountSetup({ onAccountCreated }: AccountSetupProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<'SSA' | 'Retirement' | 'Other'>('SSA');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Account name is required');
      return;
    }

    if (!balance || parseFloat(balance) < 0) {
      setError('Please enter a valid balance');
      return;
    }

    setLoading(true);

    try {
      const id = await createAccount({
        name: name.trim(),
        type,
        balance: parseFloat(balance),
        currency: 'USD',
        createdDate: new Date(),
        lastUpdated: new Date(),
      });

      const newAccount: Account = {
        id,
        name: name.trim(),
        type,
        balance: parseFloat(balance),
        currency: 'USD',
        createdDate: new Date(),
        lastUpdated: new Date(),
      };

      onAccountCreated(newAccount);
      setName('');
      setType('SSA');
      setBalance('');
    } catch (err) {
      setError('Failed to create account. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <h2 className="text-2xl font-bold">Create Account</h2>
        <p className="text-gray-600 text-sm">Set up a new account for tracking funds</p>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Account Name"
            placeholder="e.g., Social Security Benefits"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={error && !name ? 'Required' : ''}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Account Type
            </label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as 'SSA' | 'Retirement' | 'Other')}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="SSA">Social Security (SSA)</option>
              <option value="Retirement">Retirement Benefits</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <Input
            label="Starting Balance"
            type="number"
            placeholder="0.00"
            min="0"
            step="0.01"
            value={balance}
            onChange={(e) => setBalance(e.target.value)}
            error={error && !balance ? 'Required' : ''}
          />

          {error && !loading && (
            <p className="text-sm text-red-600 bg-red-50 p-3 rounded">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            loading={loading}
            className="w-full"
          >
            Create Account
          </Button>
        </form>
      </CardBody>
    </Card>
  );
}
