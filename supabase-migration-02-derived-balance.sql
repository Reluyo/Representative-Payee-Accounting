-- Migration 02: derive account balance from transactions instead of storing it.
--
-- Run this in the Supabase SQL Editor AFTER supabase-migration.sql.
--
-- Rationale: the app previously kept accounts.balance as a mutable number and
-- updated it with a separate write on every transaction. That is not atomic
-- (a transaction could be saved while the balance write fails) and is subject
-- to lost updates from a stale read-modify-write. Here the balance becomes a
-- pure function of the immutable opening balance plus the transaction ledger,
-- which makes those inconsistencies structurally impossible.

-- 1. Add an immutable opening balance, backfilled so the *current* displayed
--    balance is preserved for existing accounts.
ALTER TABLE accounts ADD COLUMN opening_balance NUMERIC(12,2) NOT NULL DEFAULT 0;

UPDATE accounts a
SET opening_balance = a.balance - COALESCE((
  SELECT SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END)
  FROM transactions t
  WHERE t.account_id = a.id
), 0);

-- 2. Drop the mutable balance column — it is now derived.
ALTER TABLE accounts DROP COLUMN balance;

-- 3. A view that computes the current balance per account. security_invoker
--    makes it respect the querying user's RLS on the underlying tables, so a
--    user only ever sees balances for their own accounts.
CREATE OR REPLACE VIEW account_balances
WITH (security_invoker = true) AS
SELECT
  a.id AS account_id,
  a.opening_balance + COALESCE(SUM(
    CASE WHEN t.type = 'income' THEN t.amount ELSE -t.amount END
  ), 0) AS balance
FROM accounts a
LEFT JOIN transactions t ON t.account_id = a.id
GROUP BY a.id, a.opening_balance;
