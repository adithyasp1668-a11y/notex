import { describe, it, expect } from 'vitest';
import { calculatePayoutSplits, NOTE_PLATFORM_FEE_INR } from '../services/purchaseService';

describe('NoteX Flat ₹10 Platform Commission Engine', () => {
  it('should use ₹10 as the default platform fee', () => {
    expect(NOTE_PLATFORM_FEE_INR).toBe(10);
  });

  it('correctly splits earnings for a standard ₹49 note', () => {
    const split = calculatePayoutSplits(49);
    expect(split.totalPrice).toBe(49);
    expect(split.platformFee).toBe(10);
    expect(split.creatorEarnings).toBe(39);
  });

  it('correctly splits earnings for a ₹39 note', () => {
    const split = calculatePayoutSplits(39);
    expect(split.totalPrice).toBe(39);
    expect(split.platformFee).toBe(10);
    expect(split.creatorEarnings).toBe(29);
  });

  it('correctly splits earnings for a high-value ₹99 note pack', () => {
    const split = calculatePayoutSplits(99);
    expect(split.totalPrice).toBe(99);
    expect(split.platformFee).toBe(10);
    expect(split.creatorEarnings).toBe(89);
  });

  it('handles edge case where note price is exactly ₹10', () => {
    const split = calculatePayoutSplits(10);
    expect(split.totalPrice).toBe(10);
    expect(split.platformFee).toBe(10);
    expect(split.creatorEarnings).toBe(0);
  });

  it('handles edge case where note price is less than ₹10', () => {
    const split = calculatePayoutSplits(5);
    expect(split.totalPrice).toBe(5);
    expect(split.platformFee).toBe(5);
    expect(split.creatorEarnings).toBe(0);
  });

  it('never yields negative creator earnings or negative fees on zero input', () => {
    const split = calculatePayoutSplits(0);
    expect(split.totalPrice).toBe(0);
    expect(split.platformFee).toBe(0);
    expect(split.creatorEarnings).toBe(0);
  });
});
