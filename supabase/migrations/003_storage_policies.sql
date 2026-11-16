-- ====================================================================
-- NOTEX DATABASE MIGRATION 003: PRIVATE STORAGE BUCKET & POLICIES
-- Description: Private PDF Storage 'notex-notes' with strict access control
-- ====================================================================

-- 1. Create the private storage bucket if not already existing
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'notex-notes',
    'notex-notes',
    false, -- STRICTLY PRIVATE
    52428800, -- 50MB maximum file size limit
    ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET 
    public = false,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['application/pdf']::text[];

-- 2. Storage Policies on storage.objects

-- Allow authenticated creators to upload their PDFs into their user folder
CREATE POLICY "Creators can upload own PDF files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'notex-notes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow creators to delete/replace their own uploaded files
CREATE POLICY "Creators can delete own uploaded files"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'notex-notes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow reading of PDF ONLY if the user:
-- 1) Is an administrator
-- 2) Is the creator who uploaded the file
-- 3) Is a verified buyer who purchased the note associated with this storage key
CREATE POLICY "Authorized reading of protected note files"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'notex-notes' AND (
        -- Admin override
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
        -- Creator access
        (storage.foldername(name))[1] = auth.uid()::text OR
        -- Verified buyer access
        EXISTS (
            SELECT 1 
            FROM public.note_files nf
            JOIN public.purchases p ON p.note_id = nf.note_id
            WHERE nf.storage_key = name 
              AND p.buyer_id = auth.uid() 
              AND p.status = 'COMPLETED'
        )
    )
);
