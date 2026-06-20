import React, { useState } from 'react';
import type { Account } from '../../types';
import { colors, spacing } from '../../design/tokens';
import { useAuth } from '../../contexts/AuthContext';
import { createAccountCloud } from '../../db/sync';

interface AccountSetupProps {
  onAccountCreated: (account: Account) => void;
}

export function AccountSetupDirectionA({ onAccountCreated }: AccountSetupProps) {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [type, setType] = useState<'SSA' | 'Retirement' | 'Other'>('SSA');
  const [balance, setBalance] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter an account name');
      return;
    }

    if (!balance || parseFloat(balance) < 0) {
      setError('Please enter a valid starting balance');
      return;
    }

    setLoading(true);

    try {
      const id = await createAccountCloud(user!.id, {
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
    } catch (err) {
      setError('Failed to create account');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: colors['bg/page'],
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: `${spacing.screenPadding}px`,
      }}
    >
      <div style={{ maxWidth: '100%', width: '100%' }}>
        {/* Avatar circle */}
        <div
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: colors['brand/tint'],
            color: colors['brand/primary'],
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '36px',
            fontWeight: 800,
            margin: '0 auto 32px',
          }}
        >
          💰
        </div>

        <h1
          style={{
            fontSize: '30px',
            fontWeight: 800,
            color: colors['ink/primary'],
            textAlign: 'center',
            margin: '0 0 12px 0',
          }}
        >
          Welcome
        </h1>

        <p
          style={{
            fontSize: '15px',
            fontWeight: 600,
            color: colors['ink/muted'],
            textAlign: 'center',
            margin: '0 0 32px 0',
          }}
        >
          Let's set up your first account
        </p>

        {/* Form card */}
        <div
          style={{
            backgroundColor: colors['surface/card'],
            borderRadius: '24px',
            padding: '28px',
            border: `1px solid ${colors['border/hairline']}`,
          }}
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: colors['ink/muted'],
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                Account Name
              </label>
              <input
                type="text"
                placeholder="e.g., Robert's Care Account"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: `1px solid ${colors['border/hairline']}`,
                  borderRadius: '14px',
                  boxSizing: 'border-box',
                  color: colors['ink/primary'],
                }}
              />
            </div>

            <div>
              <label
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: colors['ink/muted'],
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                Account Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as 'SSA' | 'Retirement' | 'Other')}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: `1px solid ${colors['border/hairline']}`,
                  borderRadius: '14px',
                  boxSizing: 'border-box',
                  color: colors['ink/primary'],
                }}
              >
                <option value="SSA">Social Security (SSA)</option>
                <option value="Retirement">Retirement Benefits</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label
                style={{
                  fontSize: '15px',
                  fontWeight: 600,
                  color: colors['ink/muted'],
                  display: 'block',
                  marginBottom: '10px',
                }}
              >
                Starting Balance
              </label>
              <input
                type="number"
                placeholder="0.00"
                min="0"
                step="0.01"
                value={balance}
                onChange={e => setBalance(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  fontSize: '16px',
                  fontWeight: 600,
                  border: `1px solid ${colors['border/hairline']}`,
                  borderRadius: '14px',
                  boxSizing: 'border-box',
                  color: colors['ink/primary'],
                }}
              />
            </div>

            {error && (
              <div
                style={{
                  backgroundColor: colors['warning/bg'],
                  border: `1px solid ${colors['warning']}`,
                  borderRadius: '14px',
                  padding: '12px 14px',
                  fontSize: '14px',
                  color: colors['warning'],
                  fontWeight: 600,
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '16px 20px',
                fontSize: '18px',
                fontWeight: 800,
                backgroundColor: colors['brand/primary'],
                color: 'white',
                border: 'none',
                borderRadius: '18px',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                marginTop: '24px',
                boxShadow: '0 6px 16px rgba(47, 98, 217, 0.28)',
              }}
            >
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
