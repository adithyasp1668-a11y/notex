import { describe, it, expect } from 'vitest';
import { processNotePurchase } from '../services/purchaseService';

describe('NoteX Purchase & Ledger Processing', () => {
  it('returns failure when checkout is aborted or marked as failed', async () => {
    const result = await processNotePurchase(
      'note-123',
      'Operating Systems VTU Notes',
      'Computer Science',
      49,
      'usr-student-test',
      'Test Student',
      'student@rvce.edu.in',
      'creator-456',
      false // simulateSuccess = false
    );

    expect(result.success).toBe(false);
    expect(result.purchase).toBeUndefined();
    expect(result.message).toContain('Failed');
  });

  it('generates a verified purchase record with correct platform split on success', async () => {
    const result = await processNotePurchase(
      'note-123',
      'Computer Networks VTU Notes',
      'Computer Science',
      49,
      'usr-student-test',
      'Test Student',
      'student@bmsce.ac.in',
      'creator-456',
      true // simulateSuccess = true
    );

    expect(result.success).toBe(true);
    expect(result.purchase).toBeDefined();

    if (result.purchase) {
      expect(result.purchase.noteId).toBe('note-123');
      expect(result.purchase.amount).toBe(49);
      expect(result.purchase.platformCommission).toBe(10);
      expect(result.purchase.creatorEarning).toBe(39);
      expect(result.purchase.referenceId).toMatch(/^NTX-\d+$/);
    }
  });
});
