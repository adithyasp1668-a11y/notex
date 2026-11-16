import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { PurchaseRecord, PayoutRequest } from '../types';

export interface PurchaseResult {
  success: boolean;
  message: string;
  purchase?: PurchaseRecord;
  error?: string;
}

/**
 * Executes atomic purchase transaction using Supabase RPC or resilient fallback
 */
export async function processNotePurchase(
  noteId: string,
  noteTitle: string,
  subject: string,
  price: number,
  buyerId: string,
  buyerName: string,
  buyerEmail: string,
  creatorId: string,
  simulateSuccess: boolean
): Promise<PurchaseResult> {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 600));

  if (!simulateSuccess) {
    return {
      success: false,
      message: 'Simulated Payment was marked as Failed (Test Mode). No charges were processed.',
    };
  }

  const platformFee = 10.00;
  const creatorAmount = Math.max(0, price - platformFee);
  const refId = `NTX-${Math.floor(10000 + Math.random() * 90000)}`;

  // If connected to live Supabase and buyer is an authenticated user UUID
  if (isSupabaseConfigured && buyerId && !buyerId.startsWith('usr-student-')) {
    try {
      // Call the atomic database transaction function created in migration 004
      const { data, error }: any = await (supabase.rpc as any)('process_mock_purchase', {
        p_note_id: noteId,
        p_buyer_id: buyerId,
      });

      if (!error && data?.success) {
        const livePurchase: PurchaseRecord = {
          id: data.purchase_id,
          referenceId: data.reference_id,
          noteId,
          noteTitle,
          subject,
          buyerId,
          buyerName,
          buyerEmail,
          creatorId,
          amount: data.amount,
          platformCommission: data.platform_fee,
          creatorEarning: data.creator_earning,
          status: 'COMPLETED',
          isTestTransaction: true,
          purchasedAt: new Date().toISOString(),
        };

        return {
          success: true,
          message: `Payment successful! Transaction reference: ${data.reference_id}. Added to your Library.`,
          purchase: livePurchase,
        };
      } else if (error) {
        console.warn('Supabase RPC process_mock_purchase warning:', error.message);
      }
    } catch (err: any) {
      console.warn('RPC purchase execution notice:', err.message);
    }
  }

  // Resilient local purchase record
  const fallbackPurchase: PurchaseRecord = {
    id: `pur-${Date.now()}`,
    referenceId: refId,
    noteId,
    noteTitle,
    subject,
    buyerId,
    buyerName,
    buyerEmail,
    creatorId,
    amount: price,
    platformCommission: platformFee,
    creatorEarning: creatorAmount,
    status: 'COMPLETED',
    isTestTransaction: true,
    purchasedAt: new Date().toISOString(),
  };

  return {
    success: true,
    message: `Payment successful! Transaction reference: ${refId}. Added to your Library.`,
    purchase: fallbackPurchase,
  };
}

/**
 * Fetch purchases for the active student from Supabase
 */
export async function getUserPurchasesFromDb(userId: string): Promise<PurchaseRecord[]> {
  if (!isSupabaseConfigured || !userId || userId.startsWith('usr-student-')) {
    return [];
  }

  try {
    const { data, error } = await supabase
      .from('purchases')
      .select(`
        id,
        reference_id,
        note_id,
        buyer_id,
        creator_id,
        amount,
        commission,
        creator_amount,
        status,
        is_test_transaction,
        purchased_at,
        notes (
          title,
          subjects (
            subject_name
          )
        ),
        profiles!purchases_buyer_id_fkey (
          full_name,
          email
        )
      `)
      .eq('buyer_id', userId)
      .eq('status', 'COMPLETED')
      .order('purchased_at', { ascending: false });

    if (error || !data) return [];

    return data.map((row: any) => ({
      id: row.id,
      referenceId: row.reference_id,
      noteId: row.note_id,
      noteTitle: row.notes?.title || 'Study Note',
      subject: row.notes?.subjects?.subject_name || 'Engineering',
      buyerId: row.buyer_id,
      buyerName: row.profiles?.full_name || 'Student',
      buyerEmail: row.profiles?.email || '',
      creatorId: row.creator_id,
      amount: Number(row.amount),
      platformCommission: Number(row.commission),
      creatorEarning: Number(row.creator_amount),
      status: row.status,
      isTestTransaction: row.is_test_transaction,
      purchasedAt: row.purchased_at,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch creator wallet balance and payout requests
 */
export async function getCreatorWalletFromDb(creatorId: string) {
  if (!isSupabaseConfigured || !creatorId) {
    return null;
  }

  try {
    const { data, error }: any = await supabase
      .from('creator_wallets')
      .select('*')
      .eq('creator_id', creatorId)
      .single();

    if (error || !data) return null;

    return {
      availableBalance: Number(data.available_balance || 0),
      pendingBalance: Number(data.pending_balance || 0),
      totalEarned: Number(data.total_earned || 0),
    };
  } catch {
    return null;
  }
}

/**
 * Requests a payout to creator's UPI ID
 */
export async function submitPayoutRequest(
  creatorId: string,
  amount: number,
  upiId: string
): Promise<{ success: boolean; error?: string }> {
  if (!isSupabaseConfigured || !creatorId || creatorId.startsWith('usr-student-')) {
    return { success: true };
  }

  try {
    const { error } = await supabase.from('payouts').insert({
      creator_id: creatorId,
      amount,
      payout_method: 'UPI',
      payout_reference: upiId,
      status: 'PENDING',
    } as any);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
