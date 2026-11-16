import { supabase } from '../lib/supabase';

export interface PdfValidationResult {
  valid: boolean;
  error?: string;
  pageCount?: number;
  fileSize?: number;
  mimeType?: string;
}

export const MAX_PDF_SIZE_BYTES = 50 * 1024 * 1024; // 50MB limit

/**
 * Validates binary magic byte signature (%PDF-)
 */
export async function validatePdfMagicBytes(file: Blob): Promise<boolean> {
  try {
    const buffer = await file.slice(0, 5).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const header = String.fromCharCode(...bytes);
    return header.startsWith('%PDF-');
  } catch {
    return false;
  }
}

/**
 * Validates PDF MIME type, size, and magic byte signature (%PDF-)
 */
export async function validatePdfFile(file: File): Promise<PdfValidationResult> {
  // 1. Check file size
  if (!file || file.size === 0) {
    return { valid: false, error: 'File is empty. Please select a valid PDF note.' };
  }

  if (file.size > MAX_PDF_SIZE_BYTES) {
    return { 
      valid: false, 
      error: `File size exceeds the 50MB limit. Current size: ${(file.size / (1024 * 1024)).toFixed(1)}MB` 
    };
  }

  // 2. MIME type check
  if (file.type && file.type !== 'application/pdf') {
    return { 
      valid: false, 
      error: `Invalid file format: ${file.type}. Only original PDF files (.pdf) are accepted.` 
    };
  }

  // 3. Inspect binary magic bytes (%PDF- = 0x25, 0x50, 0x44, 0x46, 0x2D)
  try {
    const buffer = await file.slice(0, 5).arrayBuffer();
    const bytes = new Uint8Array(buffer);
    const header = String.fromCharCode(...bytes);

    if (!header.startsWith('%PDF-')) {
      return { 
        valid: false, 
        error: 'Corrupted or invalid PDF header. File signature does not match standard PDF format.' 
      };
    }
  } catch (err: any) {
    return { valid: false, error: 'Could not read file binary signature: ' + err.message };
  }

  // 4. Quick page count estimation from PDF text chunks
  let estimatedPageCount = 1;
  try {
    const textChunk = await file.slice(0, Math.min(file.size, 500000)).text();
    const matches = textChunk.match(/\/Type\s*\/Page\b/g);
    if (matches && matches.length > 0) {
      estimatedPageCount = matches.length;
    }
  } catch {
    estimatedPageCount = 1;
  }

  return {
    valid: true,
    fileSize: file.size,
    mimeType: 'application/pdf',
    pageCount: Math.max(1, estimatedPageCount),
  };
}

/**
 * Uploads a verified PDF to the private Supabase Storage bucket 'notex-notes'
 * Uses user-isolated private folder: notex-notes/{userId}/{noteId}_{timestamp}.pdf
 */
export async function uploadPrivateNotePdf(
  userId: string,
  noteId: string,
  file: File
): Promise<{ success: boolean; storageKey?: string; error?: string }> {
  try {
    const validation = await validatePdfFile(file);
    if (!validation.valid) {
      return { success: false, error: validation.error };
    }

    const timestamp = Date.now();
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const storageKey = `${userId}/${noteId}_${timestamp}_${sanitizedName}`;

    // Upload to private storage
    const { data, error } = await supabase.storage
      .from('notex-notes')
      .upload(storageKey, file, {
        contentType: 'application/pdf',
        upsert: false,
      });

    if (error) {
      // If bucket does not exist, provide clear instructions
      if (error.message.includes('Bucket not found') || error.message.includes('bucket_not_found')) {
        return {
          success: false,
          error: "Storage bucket 'notex-notes' has not been created yet in Supabase Dashboard -> Storage. Please create private bucket 'notex-notes'."
        };
      }
      return { success: false, error: error.message };
    }

    // Record metadata in public.note_files table
    const { error: dbError } = await supabase.from('note_files').insert({
      note_id: noteId,
      storage_key: storageKey,
      file_type: 'application/pdf',
      file_size: file.size,
      page_count: validation.pageCount || 1,
    } as any);

    if (dbError) {
      console.warn('Note file metadata insertion warning:', dbError.message);
    }

    return { success: true, storageKey };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to upload PDF' };
  }
}

/**
 * Creates a short-lived (1-hour) signed access URL for authorized buyers
 * Never exposes permanent public URLs!
 */
export async function getProtectedDocumentUrl(storageKey: string): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from('notex-notes')
      .createSignedUrl(storageKey, 3600); // 1-hour expiry

    if (error || !data?.signedUrl) {
      console.error('Failed to create signed PDF URL:', error);
      return null;
    }
    return data.signedUrl;
  } catch (err) {
    console.error('Error generating document access token:', err);
    return null;
  }
}
