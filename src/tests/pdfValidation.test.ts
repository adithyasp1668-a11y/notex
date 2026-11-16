import { describe, it, expect } from 'vitest';
import { validatePdfFile, validatePdfMagicBytes, MAX_PDF_SIZE_BYTES } from '../services/storageService';

describe('PDF Magic Byte & Size Validation Service', () => {
  it('identifies max file limit as 50MB (52428800 bytes)', () => {
    expect(MAX_PDF_SIZE_BYTES).toBe(50 * 1024 * 1024);
  });

  it('accepts a valid PDF blob with %PDF- header magic bytes', async () => {
    const validPdfContent = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2D, 0x31, 0x2E, 0x37]); // %PDF-1.7
    const file = new File([validPdfContent], 'vtu_notes.pdf', { type: 'application/pdf' });

    const isValidHeader = await validatePdfMagicBytes(file);
    expect(isValidHeader).toBe(true);

    const fullResult = await validatePdfFile(file);
    expect(fullResult.valid).toBe(true);
    expect(fullResult.error).toBeUndefined();
  });

  it('rejects a fake PDF file with an invalid binary header (e.g. text/html/executable)', async () => {
    const invalidContent = new TextEncoder().encode('<!DOCTYPE html><html><body>Fake PDF</body></html>');
    const fakePdfFile = new File([invalidContent], 'malicious.pdf', { type: 'application/pdf' });

    const isValidHeader = await validatePdfMagicBytes(fakePdfFile);
    expect(isValidHeader).toBe(false);

    const fullResult = await validatePdfFile(fakePdfFile);
    expect(fullResult.valid).toBe(false);
    expect(fullResult.error).toContain('Corrupted or invalid PDF header');
  });

  it('rejects an empty 0-byte file', async () => {
    const emptyFile = new File([], 'empty.pdf', { type: 'application/pdf' });
    const result = await validatePdfFile(emptyFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('empty');
  });

  it('rejects non-PDF MIME types even if named .pdf', async () => {
    const textContent = new TextEncoder().encode('%PDF-valid-header-but-wrong-mime');
    const wrongMimeFile = new File([textContent], 'file.pdf', { type: 'image/png' });

    const result = await validatePdfFile(wrongMimeFile);
    expect(result.valid).toBe(false);
    expect(result.error).toContain('Invalid file format');
  });
});
