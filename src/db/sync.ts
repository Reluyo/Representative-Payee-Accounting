import { supabase } from './supabase';
import type { Account, Category, Transaction, Receipt } from '../types';

export async function syncAccountsToCloud(userId: string, accounts: Account[]) {
  for (const account of accounts) {
    const { data: existing } = await supabase
      .from('accounts')
      .select('id')
      .eq('user_id', userId)
      .eq('name', account.name)
      .maybeSingle();

    if (existing) {
      await supabase.from('accounts').update({
        balance: account.balance,
        type: account.type,
        currency: account.currency,
        last_updated: new Date().toISOString(),
      }).eq('id', existing.id);
    } else {
      await supabase.from('accounts').insert({
        user_id: userId,
        name: account.name,
        type: account.type,
        balance: account.balance,
        currency: account.currency,
        created_date: account.createdDate instanceof Date ? account.createdDate.toISOString() : account.createdDate,
        last_updated: new Date().toISOString(),
      });
    }
  }
}

export async function syncCategoriesToCloud(userId: string, categories: Category[]) {
  const { data: existing } = await supabase
    .from('categories')
    .select('name')
    .eq('user_id', userId);

  const existingNames = new Set((existing ?? []).map(c => c.name));
  const toInsert = categories
    .filter(c => !existingNames.has(c.name))
    .map(c => ({ user_id: userId, name: c.name, type: c.type, color: c.color }));

  if (toInsert.length > 0) {
    await supabase.from('categories').insert(toInsert);
  }
}

export async function syncTransactionsToCloud(userId: string, cloudAccountId: number, transactions: Transaction[]) {
  for (const tx of transactions) {
    const { data: existing } = await supabase
      .from('transactions')
      .select('id')
      .eq('user_id', userId)
      .eq('account_id', cloudAccountId)
      .eq('date', (tx.date instanceof Date ? tx.date : new Date(tx.date)).toISOString())
      .eq('amount', tx.amount)
      .eq('description', tx.description)
      .maybeSingle();

    if (!existing) {
      const { data: inserted } = await supabase.from('transactions').insert({
        user_id: userId,
        account_id: cloudAccountId,
        date: (tx.date instanceof Date ? tx.date : new Date(tx.date)).toISOString(),
        amount: tx.amount,
        category: tx.category,
        description: tx.description,
        type: tx.type,
        status: tx.status,
        ai_extracted_data: tx.aiExtractedData ?? null,
      }).select('id').single();

      if (inserted && tx.receipts?.length > 0) {
        for (const receipt of tx.receipts) {
          await syncReceiptToCloud(userId, inserted.id, receipt);
        }
      }
    }
  }
}

const RECEIPT_BUCKET = 'receipts';
// Signed URLs are short-lived; one hour comfortably covers a viewing/report session.
const SIGNED_URL_TTL_SECONDS = 60 * 60;

async function uploadReceiptImage(userId: string, receipt: Receipt): Promise<string | null> {
  // Only a freshly captured receipt carries raw image data (blob or data URL).
  // A receipt already in the cloud has only a storagePath and nothing to upload.
  let fileBody: Blob | null = null;

  if (receipt.blobData) {
    fileBody = receipt.blobData;
  } else if (receipt.data?.startsWith('data:')) {
    const res = await fetch(receipt.data);
    fileBody = await res.blob();
  }

  if (!fileBody || fileBody.size === 0) return null;

  const fileName = `${userId}/${Date.now()}_${receipt.fileName}`;
  const { error } = await supabase.storage
    .from(RECEIPT_BUCKET)
    .upload(fileName, fileBody, { contentType: receipt.fileType || 'image/jpeg' });

  if (error) {
    throw new Error(`Failed to upload receipt image: ${error.message}`);
  }
  return fileName;
}

/**
 * Resolves Supabase storage paths to temporary signed URLs so receipt images
 * can be displayed and embedded in reports. Returns a path→url map.
 */
export async function signReceiptPaths(paths: string[]): Promise<Record<string, string>> {
  const unique = [...new Set(paths.filter(Boolean))];
  if (unique.length === 0) return {};

  const { data, error } = await supabase.storage
    .from(RECEIPT_BUCKET)
    .createSignedUrls(unique, SIGNED_URL_TTL_SECONDS);

  if (error || !data) return {};

  const map: Record<string, string> = {};
  for (const item of data) {
    if (item.path && item.signedUrl && !item.error) {
      map[item.path] = item.signedUrl;
    }
  }
  return map;
}

async function deleteReceiptImages(transactionIds: number[]) {
  if (transactionIds.length === 0) return;
  const { data } = await supabase
    .from('receipts')
    .select('storage_path')
    .in('transaction_id', transactionIds);

  const paths = (data ?? []).map(r => r.storage_path).filter((p): p is string => !!p);
  if (paths.length > 0) {
    await supabase.storage.from(RECEIPT_BUCKET).remove(paths);
  }
}

async function syncReceiptToCloud(userId: string, cloudTxId: number, receipt: Receipt) {
  const storagePath = (await uploadReceiptImage(userId, receipt)) ?? receipt.storagePath ?? null;

  const { error } = await supabase.from('receipts').insert({
    user_id: userId,
    transaction_id: cloudTxId,
    reference_number: receipt.referenceNumber,
    file_name: receipt.fileName,
    file_type: receipt.fileType,
    file_size: receipt.fileSize,
    uploaded_date: (receipt.uploadedDate instanceof Date ? receipt.uploadedDate : new Date(receipt.uploadedDate)).toISOString(),
    original_text: receipt.originalText || '',
    extracted_fields: receipt.extractedFields || {},
    storage_path: storagePath,
  });

  if (error) throw new Error(`Failed to save receipt: ${error.message}`);
}

// --- Cloud → Local fetching ---

export async function fetchAccountsFromCloud(userId: string): Promise<Account[]> {
  const { data, error } = await supabase
    .from('accounts')
    .select('*')
    .eq('user_id', userId)
    .order('created_date');

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    name: row.name,
    type: row.type as Account['type'],
    balance: Number(row.balance),
    currency: row.currency,
    createdDate: new Date(row.created_date),
    lastUpdated: new Date(row.last_updated),
  }));
}

export async function fetchCategoriesFromCloud(userId: string): Promise<Category[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId);

  if (error || !data) return [];

  return data.map(row => ({
    id: row.id,
    name: row.name,
    type: row.type,
    color: row.color,
  }));
}

/**
 * Loads all receipts for the given transactions in one query and resolves each
 * stored image to a signed URL placed in `receipt.data` so it can be displayed.
 * Returns a map keyed by transaction id.
 */
export async function fetchReceiptsForTransactions(
  transactionIds: number[],
): Promise<Record<number, Receipt[]>> {
  if (transactionIds.length === 0) return {};

  const { data: receiptRows } = await supabase
    .from('receipts')
    .select('*')
    .in('transaction_id', transactionIds);

  const rows = receiptRows ?? [];
  const urlMap = await signReceiptPaths(rows.map(r => r.storage_path).filter(Boolean));

  const byTx: Record<number, Receipt[]> = {};
  for (const r of rows) {
    const receipt: Receipt = {
      id: r.id,
      transactionId: r.transaction_id,
      referenceNumber: r.reference_number,
      fileName: r.file_name,
      fileType: r.file_type,
      fileSize: r.file_size,
      uploadedDate: new Date(r.uploaded_date),
      data: r.storage_path ? (urlMap[r.storage_path] ?? '') : '',
      storagePath: r.storage_path ?? undefined,
      originalText: r.original_text || '',
      extractedFields: r.extracted_fields || {},
    };
    (byTx[r.transaction_id] ??= []).push(receipt);
  }
  return byTx;
}

export async function fetchTransactionsFromCloud(userId: string, cloudAccountId: number): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .eq('account_id', cloudAccountId)
    .order('date', { ascending: false });

  if (error || !data) return [];

  // Fetch all receipts for these transactions in a single query (avoids N+1).
  const txIds = data.map(row => row.id);
  const receiptsByTx = await fetchReceiptsForTransactions(txIds);

  const transactions: Transaction[] = data.map(row => ({
    id: row.id,
    accountId: row.account_id,
    date: new Date(row.date),
    amount: Number(row.amount),
    category: row.category,
    description: row.description,
    type: row.type as 'income' | 'expense',
    status: row.status as 'pending' | 'confirmed',
    receipts: receiptsByTx[row.id] ?? [],
    aiExtractedData: row.ai_extracted_data ?? undefined,
  }));

  return transactions;
}

// --- Cloud CRUD (used when logged in) ---

export async function createAccountCloud(userId: string, account: Omit<Account, 'id'>): Promise<number> {
  const { data, error } = await supabase.from('accounts').insert({
    user_id: userId,
    name: account.name,
    type: account.type,
    balance: account.balance,
    currency: account.currency,
    created_date: account.createdDate instanceof Date ? account.createdDate.toISOString() : account.createdDate,
    last_updated: account.lastUpdated instanceof Date ? account.lastUpdated.toISOString() : account.lastUpdated,
  }).select('id').single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to create account');
  return data.id;
}

export async function updateAccountCloud(id: number, updates: Partial<Account>) {
  const mapped: Record<string, unknown> = {};
  if (updates.name !== undefined) mapped.name = updates.name;
  if (updates.type !== undefined) mapped.type = updates.type;
  if (updates.balance !== undefined) mapped.balance = updates.balance;
  if (updates.currency !== undefined) mapped.currency = updates.currency;
  if (updates.lastUpdated !== undefined) mapped.last_updated = updates.lastUpdated instanceof Date ? updates.lastUpdated.toISOString() : updates.lastUpdated;

  await supabase.from('accounts').update(mapped).eq('id', id);
}

export async function deleteAccountCloud(id: number) {
  const { data: txRows } = await supabase
    .from('transactions')
    .select('id')
    .eq('account_id', id);
  await deleteReceiptImages((txRows ?? []).map(t => t.id));

  await supabase.from('transactions').delete().eq('account_id', id);
  await supabase.from('accounts').delete().eq('id', id);
}

export async function createTransactionCloud(userId: string, tx: Omit<Transaction, 'id'>): Promise<number> {
  const { data, error } = await supabase.from('transactions').insert({
    user_id: userId,
    account_id: tx.accountId,
    date: (tx.date instanceof Date ? tx.date : new Date(tx.date)).toISOString(),
    amount: tx.amount,
    category: tx.category,
    description: tx.description,
    type: tx.type,
    status: tx.status,
    ai_extracted_data: tx.aiExtractedData ?? null,
  }).select('id').single();

  if (error || !data) throw new Error(error?.message ?? 'Failed to create transaction');

  if (tx.receipts?.length > 0) {
    for (const receipt of tx.receipts) {
      await syncReceiptToCloud(userId, data.id, receipt);
    }
  }

  return data.id;
}

export async function updateTransactionCloud(userId: string, id: number, updates: Partial<Transaction>) {
  const mapped: Record<string, unknown> = {};
  if (updates.date !== undefined) mapped.date = (updates.date instanceof Date ? updates.date : new Date(updates.date)).toISOString();
  if (updates.amount !== undefined) mapped.amount = updates.amount;
  if (updates.category !== undefined) mapped.category = updates.category;
  if (updates.description !== undefined) mapped.description = updates.description;
  if (updates.type !== undefined) mapped.type = updates.type;
  if (updates.status !== undefined) mapped.status = updates.status;

  if (Object.keys(mapped).length > 0) {
    const { error } = await supabase.from('transactions').update(mapped).eq('id', id);
    if (error) throw new Error(`Failed to update transaction: ${error.message}`);
  }

  // Persist any newly attached receipts (those not yet saved to the cloud).
  if (updates.receipts) {
    for (const receipt of updates.receipts) {
      if (receipt.id === undefined && !receipt.storagePath) {
        await syncReceiptToCloud(userId, id, receipt);
      }
    }
  }
}

export async function deleteTransactionCloud(id: number) {
  await deleteReceiptImages([id]);
  await supabase.from('receipts').delete().eq('transaction_id', id);
  await supabase.from('transactions').delete().eq('id', id);
}

export async function initCategoriesCloud(userId: string, defaults: Category[]) {
  const { data: existing } = await supabase
    .from('categories')
    .select('id')
    .eq('user_id', userId);

  if (!existing || existing.length === 0) {
    await supabase.from('categories').insert(
      defaults.map(c => ({ user_id: userId, name: c.name, type: c.type, color: c.color }))
    );
  }
}

/** Deletes all of the user's accounts (cascading to transactions and receipts)
 *  along with their stored receipt images. Categories are left intact. */
export async function clearCloudData(userId: string) {
  const { data: accounts } = await supabase
    .from('accounts')
    .select('id')
    .eq('user_id', userId);

  for (const account of accounts ?? []) {
    await deleteAccountCloud(account.id);
  }
}

// --- Backup: full export/import of the user's cloud data ---

export const CLOUD_BACKUP_VERSION = 2;

async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/**
 * Exports all of the signed-in user's cloud data into a self-contained JSON
 * object, downloading receipt images and embedding them as data URLs so the
 * backup can be restored without depending on the original storage files.
 */
export async function exportCloudData(userId: string) {
  const [accountsRes, categoriesRes, transactionsRes, receiptsRes] = await Promise.all([
    supabase.from('accounts').select('*').eq('user_id', userId),
    supabase.from('categories').select('*').eq('user_id', userId),
    supabase.from('transactions').select('*').eq('user_id', userId),
    supabase.from('receipts').select('*').eq('user_id', userId),
  ]);

  const receipts = receiptsRes.data ?? [];
  const receiptsWithImages = await Promise.all(
    receipts.map(async r => {
      let imageData = '';
      if (r.storage_path) {
        const { data: blob } = await supabase.storage.from(RECEIPT_BUCKET).download(r.storage_path);
        if (blob) imageData = await blobToDataUrl(blob);
      }
      return { ...r, image_data: imageData };
    }),
  );

  return {
    version: CLOUD_BACKUP_VERSION,
    exportDate: new Date().toISOString(),
    accounts: accountsRes.data ?? [],
    categories: categoriesRes.data ?? [],
    transactions: transactionsRes.data ?? [],
    receipts: receiptsWithImages,
  };
}

/**
 * Restores a backup produced by {@link exportCloudData} into the signed-in
 * user's cloud account. Old record ids are remapped to newly inserted ids so
 * foreign-key relationships are preserved.
 */
export async function importCloudData(userId: string, data: any) {
  if (data?.version !== CLOUD_BACKUP_VERSION) {
    throw new Error('Unsupported or outdated backup format.');
  }

  // Categories: only add ones the user doesn't already have (by name).
  const { data: existingCats } = await supabase
    .from('categories')
    .select('name')
    .eq('user_id', userId);
  const existingNames = new Set((existingCats ?? []).map(c => c.name));
  const newCats = (data.categories ?? [])
    .filter((c: any) => !existingNames.has(c.name))
    .map((c: any) => ({ user_id: userId, name: c.name, type: c.type, color: c.color }));
  if (newCats.length > 0) {
    await supabase.from('categories').insert(newCats);
  }

  // Accounts: insert and remember old id -> new id.
  const accountIdMap = new Map<number, number>();
  for (const a of data.accounts ?? []) {
    const newId = await createAccountCloud(userId, {
      name: a.name,
      type: a.type,
      balance: Number(a.balance),
      currency: a.currency,
      createdDate: new Date(a.created_date),
      lastUpdated: new Date(a.last_updated),
    });
    accountIdMap.set(a.id, newId);
  }

  // Transactions: insert under the remapped account, remember id mapping.
  const txIdMap = new Map<number, number>();
  for (const t of data.transactions ?? []) {
    const newAccountId = accountIdMap.get(t.account_id);
    if (!newAccountId) continue;
    const { data: inserted, error } = await supabase.from('transactions').insert({
      user_id: userId,
      account_id: newAccountId,
      date: t.date,
      amount: t.amount,
      category: t.category,
      description: t.description,
      type: t.type,
      status: t.status,
      ai_extracted_data: t.ai_extracted_data ?? null,
    }).select('id').single();
    if (error || !inserted) throw new Error(`Failed to restore transaction: ${error?.message}`);
    txIdMap.set(t.id, inserted.id);
  }

  // Receipts: re-upload embedded images and link to the remapped transaction.
  for (const r of data.receipts ?? []) {
    const newTxId = txIdMap.get(r.transaction_id);
    if (!newTxId) continue;
    await syncReceiptToCloud(userId, newTxId, {
      referenceNumber: r.reference_number,
      fileName: r.file_name,
      fileType: r.file_type,
      fileSize: r.file_size,
      uploadedDate: new Date(r.uploaded_date),
      data: r.image_data ?? '',
      originalText: r.original_text ?? '',
      extractedFields: r.extracted_fields ?? {},
    });
  }
}
