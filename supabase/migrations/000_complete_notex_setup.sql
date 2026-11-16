-- ====================================================================
-- NOTEX: COMPLETE ALL-IN-ONE SUPABASE MIGRATION
-- Paste this entire script into:
-- Supabase Dashboard -> SQL Editor -> New Query -> Run
-- Project: https://bekstvkypwgxgpstpmri.supabase.co
-- ====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. UNIVERSITIES TABLE
CREATE TABLE IF NOT EXISTS public.universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_name TEXT NOT NULL UNIQUE,
    abbreviation TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 3. COLLEGES TABLE
CREATE TABLE IF NOT EXISTS public.colleges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    university_id UUID NOT NULL REFERENCES public.universities(id) ON DELETE CASCADE,
    college_name TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 4. BRANCHES TABLE
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    branch_name TEXT NOT NULL,
    branch_code TEXT NOT NULL UNIQUE
);

-- 5. SUBJECTS TABLE
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_name TEXT NOT NULL,
    subject_code TEXT NOT NULL UNIQUE,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    semester INT NOT NULL CHECK (semester BETWEEN 1 AND 8)
);

-- 6. PROFILES TABLE (Linked directly to Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    phone TEXT,
    college_id UUID REFERENCES public.colleges(id) ON DELETE SET NULL,
    branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    semester INT CHECK (semester BETWEEN 1 AND 8),
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('student', 'admin')),
    is_creator BOOLEAN NOT NULL DEFAULT false,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 7. NOTES TABLE
CREATE TABLE IF NOT EXISTS public.notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE RESTRICT,
    title TEXT NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    page_count INT NOT NULL CHECK (page_count > 0),
    status TEXT NOT NULL DEFAULT 'PENDING_REVIEW' CHECK (status IN ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED')),
    cover_image TEXT,
    modules JSONB DEFAULT '[]'::jsonb,
    sample_preview_pages TEXT[] DEFAULT ARRAY[]::TEXT[],
    rejection_reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 8. NOTE_FILES TABLE (Stores private storage keys, never public URLs)
CREATE TABLE IF NOT EXISTS public.note_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    storage_key TEXT NOT NULL,
    file_type TEXT NOT NULL DEFAULT 'application/pdf',
    file_size BIGINT NOT NULL CHECK (file_size > 0),
    page_count INT NOT NULL CHECK (page_count > 0),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 9. PURCHASES TABLE
CREATE TABLE IF NOT EXISTS public.purchases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_id TEXT NOT NULL UNIQUE,
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE RESTRICT,
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    commission NUMERIC(10, 2) NOT NULL DEFAULT 10.00 CHECK (commission >= 0),
    creator_amount NUMERIC(10, 2) NOT NULL CHECK (creator_amount >= 0),
    status TEXT NOT NULL DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED', 'REFUNDED')),
    is_test_transaction BOOLEAN NOT NULL DEFAULT true,
    purchased_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_buyer_note_purchase UNIQUE (buyer_id, note_id)
);

-- 10. PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    purchase_id UUID REFERENCES public.purchases(id) ON DELETE CASCADE,
    gateway_order_id TEXT,
    gateway_payment_id TEXT,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount >= 0),
    status TEXT NOT NULL CHECK (status IN ('INITIATED', 'SUCCESS', 'FAILED', 'REFUNDED')),
    webhook_event_id TEXT UNIQUE,
    is_test BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 11. CREATOR_WALLETS TABLE
CREATE TABLE IF NOT EXISTS public.creator_wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    available_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (available_balance >= 0),
    pending_balance NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (pending_balance >= 0),
    total_earned NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (total_earned >= 0),
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 12. WALLET_TRANSACTIONS TABLE (Auditable Financial Ledger)
CREATE TABLE IF NOT EXISTS public.wallet_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID NOT NULL REFERENCES public.creator_wallets(id) ON DELETE CASCADE,
    purchase_id UUID REFERENCES public.purchases(id) ON DELETE SET NULL,
    payout_id UUID,
    transaction_type TEXT NOT NULL CHECK (transaction_type IN ('SALE_CREDIT', 'PAYOUT_DEBIT', 'COMMISSION_DEDUCTION', 'REFUND_DEBIT', 'ADJUSTMENT')),
    amount NUMERIC(10, 2) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 13. PAYOUTS TABLE
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    creator_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL CHECK (amount > 0),
    payout_method TEXT NOT NULL DEFAULT 'UPI',
    payout_reference TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSED', 'REJECTED')),
    requested_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    processed_at TIMESTAMPTZ
);

-- 14. REVIEWS TABLE (Only verified buyers can review)
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    buyer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_buyer_note_review UNIQUE (buyer_id, note_id)
);

-- 15. REPORTS TABLE
CREATE TABLE IF NOT EXISTS public.reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED')),
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 16. WISHLISTS TABLE
CREATE TABLE IF NOT EXISTS public.wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    note_id UUID NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    CONSTRAINT unique_user_note_wishlist UNIQUE (user_id, note_id)
);

-- 17. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 18. ADMIN_AUDIT_LOGS TABLE
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID NOT NULL,
    details JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 19. PLATFORM_SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key TEXT NOT NULL UNIQUE,
    setting_value JSONB NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ====================================================================
-- INDEXES
-- ====================================================================
CREATE INDEX IF NOT EXISTS idx_colleges_university ON public.colleges(university_id);
CREATE INDEX IF NOT EXISTS idx_subjects_branch_sem ON public.subjects(branch_id, semester);
CREATE INDEX IF NOT EXISTS idx_notes_creator ON public.notes(creator_id);
CREATE INDEX IF NOT EXISTS idx_notes_subject ON public.notes(subject_id);
CREATE INDEX IF NOT EXISTS idx_notes_status ON public.notes(status);
CREATE INDEX IF NOT EXISTS idx_purchases_buyer ON public.purchases(buyer_id);
CREATE INDEX IF NOT EXISTS idx_purchases_creator ON public.purchases(creator_id);
CREATE INDEX IF NOT EXISTS idx_purchases_note ON public.purchases(note_id);
CREATE INDEX IF NOT EXISTS idx_wallet_tx_wallet ON public.wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_reviews_note ON public.reviews(note_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON public.wishlists(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON public.notifications(user_id, is_read);

-- Seed initial platform commission setting
INSERT INTO public.platform_settings (setting_key, setting_value)
VALUES ('commission_rules', '{"platform_fee_inr": 10.00, "allow_mock_payments": true}'::jsonb)
ON CONFLICT (setting_key) DO NOTHING;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$;

ALTER TABLE public.universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.colleges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.note_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.creator_wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Public Reference Tables
CREATE POLICY "Public can view universities" ON public.universities FOR SELECT USING (true);
CREATE POLICY "Public can view colleges" ON public.colleges FOR SELECT USING (true);
CREATE POLICY "Public can view branches" ON public.branches FOR SELECT USING (true);
CREATE POLICY "Public can view subjects" ON public.subjects FOR SELECT USING (true);

-- Profiles
CREATE POLICY "Public can view basic profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id AND 
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);
CREATE POLICY "Admins can manage all profiles" ON public.profiles FOR ALL USING (public.is_admin());

-- Notes
CREATE POLICY "Public can view approved notes" ON public.notes FOR SELECT
USING (status = 'APPROVED' OR creator_id = auth.uid() OR public.is_admin());

CREATE POLICY "Creators can insert own notes" ON public.notes FOR INSERT
WITH CHECK (auth.uid() = creator_id AND status IN ('DRAFT', 'PENDING_REVIEW'));

CREATE POLICY "Creators can update own notes" ON public.notes FOR UPDATE
USING (auth.uid() = creator_id)
WITH CHECK (auth.uid() = creator_id AND status IN ('DRAFT', 'PENDING_REVIEW'));

CREATE POLICY "Admins can manage all notes" ON public.notes FOR ALL USING (public.is_admin());

-- Note Files (Private Storage Key Security)
CREATE POLICY "Authorized access to note files" ON public.note_files FOR SELECT
USING (
    public.is_admin() OR
    EXISTS (SELECT 1 FROM public.notes WHERE id = note_files.note_id AND creator_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.purchases WHERE note_id = note_files.note_id AND buyer_id = auth.uid() AND status = 'COMPLETED')
);

CREATE POLICY "Creators can insert note files for own notes" ON public.note_files FOR INSERT
WITH CHECK (EXISTS (SELECT 1 FROM public.notes WHERE id = note_files.note_id AND creator_id = auth.uid()));

-- Purchases & Payments
CREATE POLICY "Buyers and creators can view own purchases" ON public.purchases FOR SELECT
USING (buyer_id = auth.uid() OR creator_id = auth.uid() OR public.is_admin());

CREATE POLICY "System/User can insert own purchase" ON public.purchases FOR INSERT
WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can view own payments" ON public.payments FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.purchases WHERE id = payments.purchase_id AND buyer_id = auth.uid()) OR
    public.is_admin()
);

-- Creator Wallets & Ledger
CREATE POLICY "Creators can view own wallet" ON public.creator_wallets FOR SELECT
USING (creator_id = auth.uid() OR public.is_admin());

CREATE POLICY "Creators can view own wallet transactions" ON public.wallet_transactions FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.creator_wallets WHERE id = wallet_transactions.wallet_id AND creator_id = auth.uid()) OR
    public.is_admin()
);

-- Payouts
CREATE POLICY "Creators can view own payouts" ON public.payouts FOR SELECT
USING (creator_id = auth.uid() OR public.is_admin());

CREATE POLICY "Creators can request own payout" ON public.payouts FOR INSERT
WITH CHECK (creator_id = auth.uid() AND status = 'PENDING');

CREATE POLICY "Admins can update payouts" ON public.payouts FOR UPDATE USING (public.is_admin());

-- Reviews
CREATE POLICY "Public can view reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Verified buyers can insert reviews" ON public.reviews FOR INSERT
WITH CHECK (
    buyer_id = auth.uid() AND
    EXISTS (SELECT 1 FROM public.purchases WHERE note_id = reviews.note_id AND buyer_id = auth.uid() AND status = 'COMPLETED')
);

-- Wishlists & Notifications & Reports
CREATE POLICY "Users can manage own wishlist" ON public.wishlists FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can view and update own notifications" ON public.notifications FOR ALL USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Users can insert reports" ON public.reports FOR INSERT WITH CHECK (reporter_id = auth.uid());
CREATE POLICY "Admins can manage reports" ON public.reports FOR ALL USING (public.is_admin());
CREATE POLICY "Public can view platform settings" ON public.platform_settings FOR SELECT USING (true);
CREATE POLICY "Only admins can modify platform settings" ON public.platform_settings FOR ALL USING (public.is_admin());
CREATE POLICY "Only admins can view audit logs" ON public.admin_audit_logs FOR SELECT USING (public.is_admin());

-- ====================================================================
-- PRIVATE STORAGE BUCKET 'notex-notes'
-- ====================================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'notex-notes',
    'notex-notes',
    false,
    52428800,
    ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO UPDATE SET 
    public = false,
    file_size_limit = 52428800,
    allowed_mime_types = ARRAY['application/pdf']::text[];

CREATE POLICY "Creators can upload own PDF files" ON storage.objects FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'notex-notes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Creators can delete own uploaded files" ON storage.objects FOR DELETE TO authenticated
USING (bucket_id = 'notex-notes' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Authorized reading of protected note files" ON storage.objects FOR SELECT TO authenticated
USING (
    bucket_id = 'notex-notes' AND (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin') OR
        (storage.foldername(name))[1] = auth.uid()::text OR
        EXISTS (
            SELECT 1 FROM public.note_files nf
            JOIN public.purchases p ON p.note_id = nf.note_id
            WHERE nf.storage_key = name AND p.buyer_id = auth.uid() AND p.status = 'COMPLETED'
        )
    )
);

-- ====================================================================
-- FUNCTIONS & TRIGGERS
-- ====================================================================

-- Automatic profile & wallet creation on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, email, role, is_creator)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'Student User'),
        NEW.email,
        'student',
        COALESCE((NEW.raw_user_meta_data->>'is_creator')::boolean, false)
    )
    ON CONFLICT (id) DO NOTHING;

    INSERT INTO public.creator_wallets (creator_id, available_balance, pending_balance, total_earned)
    VALUES (NEW.id, 0.00, 0.00, 0.00)
    ON CONFLICT (creator_id) DO NOTHING;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Atomic purchase processor function
CREATE OR REPLACE FUNCTION public.process_mock_purchase(
    p_note_id UUID,
    p_buyer_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_note RECORD;
    v_buyer RECORD;
    v_platform_fee NUMERIC(10, 2) := 10.00;
    v_creator_earning NUMERIC(10, 2);
    v_ref_id TEXT;
    v_purchase_id UUID;
    v_wallet_id UUID;
BEGIN
    SELECT * INTO v_note FROM public.notes WHERE id = p_note_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Note not found';
    END IF;

    IF v_note.status != 'APPROVED' THEN
        RAISE EXCEPTION 'Note is not approved for sale';
    END IF;

    SELECT * INTO v_buyer FROM public.profiles WHERE id = p_buyer_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Buyer profile not found';
    END IF;

    IF EXISTS (SELECT 1 FROM public.purchases WHERE buyer_id = p_buyer_id AND note_id = p_note_id AND status = 'COMPLETED') THEN
        RAISE EXCEPTION 'You have already purchased this note';
    END IF;

    v_ref_id := 'NTX-' || (10000 + FLOOR(RANDOM() * 90000))::TEXT;
    v_creator_earning := GREATEST(0.00, v_note.price - v_platform_fee);

    INSERT INTO public.purchases (
        reference_id, buyer_id, note_id, creator_id,
        amount, commission, creator_amount, status, is_test_transaction
    )
    VALUES (
        v_ref_id, p_buyer_id, p_note_id, v_note.creator_id,
        v_note.price, v_platform_fee, v_creator_earning, 'COMPLETED', true
    )
    RETURNING id INTO v_purchase_id;

    INSERT INTO public.payments (
        purchase_id, gateway_order_id, gateway_payment_id,
        amount, status, is_test
    )
    VALUES (
        v_purchase_id, 'MOCK_ORDER_' || v_ref_id, 'MOCK_PAY_' || v_ref_id,
        v_note.price, 'SUCCESS', true
    );

    INSERT INTO public.creator_wallets (creator_id, available_balance, pending_balance, total_earned)
    VALUES (v_note.creator_id, v_creator_earning, 0.00, v_creator_earning)
    ON CONFLICT (creator_id) DO UPDATE SET
        available_balance = public.creator_wallets.available_balance + v_creator_earning,
        total_earned = public.creator_wallets.total_earned + v_creator_earning,
        updated_at = NOW()
    RETURNING id INTO v_wallet_id;

    INSERT INTO public.wallet_transactions (
        wallet_id, purchase_id, transaction_type, amount, description
    )
    VALUES (
        v_wallet_id, v_purchase_id, 'SALE_CREDIT', v_creator_earning,
        'Sale credit for note: ' || v_note.title || ' (Ref: ' || v_ref_id || ')'
    );

    INSERT INTO public.notifications (user_id, title, message)
    VALUES (
        v_note.creator_id,
        'New Note Sale! (₹' || v_creator_earning || ' earned)',
        v_buyer.full_name || ' purchased your note "' || v_note.title || '".'
    );

    RETURN jsonb_build_object(
        'success', true,
        'purchase_id', v_purchase_id,
        'reference_id', v_ref_id,
        'amount', v_note.price,
        'platform_fee', v_platform_fee,
        'creator_earning', v_creator_earning
    );
END;
$$;

-- Seed Initial Universities, Colleges, Branches, Subjects
DO $$
DECLARE
    v_univ_id UUID;
    v_rvce_id UUID;
    v_bmsce_id UUID;
    v_cse_id UUID;
    v_ise_id UUID;
BEGIN
    INSERT INTO public.universities (university_name, abbreviation)
    VALUES ('Visvesvaraya Technological University', 'VTU')
    ON CONFLICT (university_name) DO UPDATE SET abbreviation = 'VTU'
    RETURNING id INTO v_univ_id;

    INSERT INTO public.colleges (university_id, college_name, city, state)
    VALUES 
        (v_univ_id, 'RV College of Engineering (RVCE)', 'Bengaluru', 'Karnataka'),
        (v_univ_id, 'BMS College of Engineering (BMSCE)', 'Bengaluru', 'Karnataka'),
        (v_univ_id, 'MS Ramaiah Institute of Technology (MSRIT)', 'Bengaluru', 'Karnataka'),
        (v_univ_id, 'PES University', 'Bengaluru', 'Karnataka'),
        (v_univ_id, 'Dayananda Sagar College of Engineering (DSCE)', 'Bengaluru', 'Karnataka')
    ON CONFLICT DO NOTHING;

    INSERT INTO public.branches (branch_name, branch_code)
    VALUES 
        ('Computer Science & Engineering', 'CSE'),
        ('Information Science & Engineering', 'ISE'),
        ('Electronics & Communication Engineering', 'ECE'),
        ('Electrical & Electronics Engineering', 'EEE'),
        ('Mechanical Engineering', 'MECH'),
        ('Artificial Intelligence & Data Science', 'AI&DS')
    ON CONFLICT (branch_code) DO NOTHING;

    SELECT id INTO v_cse_id FROM public.branches WHERE branch_code = 'CSE';
    IF v_cse_id IS NOT NULL THEN
        INSERT INTO public.subjects (subject_name, subject_code, branch_id, semester)
        VALUES 
            ('Computer Networks', '21CS52', v_cse_id, 5),
            ('Database Management Systems', '21CS53', v_cse_id, 5),
            ('Operating Systems', '21CS44', v_cse_id, 4),
            ('Theory of Computation', '21CS54', v_cse_id, 5)
        ON CONFLICT (subject_code) DO NOTHING;
    END IF;
END $$;

-- --------------------------------------------------------------------
-- Seed Initial VTU Notes
-- --------------------------------------------------------------------
DO $$
DECLARE
    v_creator_id UUID := 'a0000000-0000-0000-0000-000000000001';
    v_univ_id UUID;
    v_college_id UUID;
    v_cse_id UUID;
    v_ece_id UUID;
    v_cn_subj_id UUID;
    v_dbms_subj_id UUID;
    v_os_subj_id UUID;
    v_dsp_subj_id UUID;
    v_note1_id UUID := 'b0000000-0000-0000-0000-000000000001';
    v_note2_id UUID := 'b0000000-0000-0000-0000-000000000002';
    v_note3_id UUID := 'b0000000-0000-0000-0000-000000000003';
    v_note4_id UUID := 'b0000000-0000-0000-0000-000000000004';
BEGIN
    SELECT id INTO v_univ_id FROM public.universities WHERE abbreviation = 'VTU' LIMIT 1;
    SELECT id INTO v_college_id FROM public.colleges WHERE college_name LIKE '%RV College%' LIMIT 1;
    SELECT id INTO v_cse_id FROM public.branches WHERE branch_code = 'CSE' LIMIT 1;
    SELECT id INTO v_ece_id FROM public.branches WHERE branch_code = 'ECE' LIMIT 1;

    SELECT id INTO v_cn_subj_id FROM public.subjects WHERE subject_code = '21CS52' LIMIT 1;
    SELECT id INTO v_dbms_subj_id FROM public.subjects WHERE subject_code = '21CS53' LIMIT 1;
    SELECT id INTO v_os_subj_id FROM public.subjects WHERE subject_code = '21CS44' LIMIT 1;
    SELECT id INTO v_dsp_subj_id FROM public.subjects WHERE subject_code = '21EC52' LIMIT 1;

    IF NOT EXISTS (SELECT 1 FROM auth.users WHERE id = v_creator_id) THEN
        INSERT INTO auth.users (
            id, instance_id, email, encrypted_password, email_confirmed_at,
            raw_app_meta_data, raw_user_meta_data, created_at, updated_at, role, aud
        ) VALUES (
            v_creator_id, '00000000-0000-0000-0000-000000000000',
            'rahul.k@rvce.edu.in', crypt('NoteXDemo2026!', gen_salt('bf')), NOW(),
            '{"provider":"email","providers":["email"]}',
            '{"full_name":"Rahul Kulkarni","college":"RV College of Engineering (RVCE)","branch":"CSE","semester":6}',
            NOW(), NOW(), 'authenticated', 'authenticated'
        );
    END IF;

    INSERT INTO public.profiles (
        id, full_name, email, college_id, branch_id, semester, role, bio, is_verified_creator
    ) VALUES (
        v_creator_id, 'Rahul Kulkarni', 'rahul.k@rvce.edu.in', v_college_id, v_cse_id, 6,
        'CREATOR', 'RVCE 6th Sem CSE • 9.42 CGPA • VTU Rank Holder Notes with Diagrams', TRUE
    ) ON CONFLICT (id) DO UPDATE SET full_name = 'Rahul Kulkarni', is_verified_creator = TRUE;

    INSERT INTO public.creator_wallets (creator_id, balance, total_earned, upi_id)
    VALUES (v_creator_id, 450.00, 1850.00, 'rahul.k@okaxis')
    ON CONFLICT (creator_id) DO NOTHING;

    IF v_cn_subj_id IS NOT NULL THEN
        INSERT INTO public.notes (
            id, title, description, creator_id, university_id, college_id, branch_id, subject_id,
            semester, course, price, total_pages, preview_pages_count, modules, cover_image_url,
            status, sales_count, average_rating, ratings_count
        ) VALUES (
            v_note1_id,
            'Computer Networks (21CS52) - Comprehensive 5 Modules + Solved PYQs',
            'Complete handwritten notes for VTU 5th Sem CSE. Includes OSI/TCP-IP models, IP subnetting cheatsheet, socket programming diagrams, and 5 years solved question papers.',
            v_creator_id, v_univ_id, v_college_id, v_cse_id, v_cn_subj_id, 5, 'B.E.', 49.00, 68, 3,
            ARRAY[
                'Module 1: Introduction to Networks & Physical Layer',
                'Module 2: Data Link Layer & Framing Protocols',
                'Module 3: Network Layer & IP Addressing/Subnetting',
                'Module 4: Transport Layer (TCP vs UDP, Flow Control)',
                'Module 5: Application Layer (DNS, HTTP, SMTP) + Solved VTU PYQs'
            ],
            'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000',
            'APPROVED', 42, 4.9, 38
        ) ON CONFLICT (id) DO NOTHING;

        INSERT INTO public.note_files (note_id, file_name, file_size_bytes, mime_type, storage_path, sha256_hash)
        VALUES (v_note1_id, '21CS52_CN_Complete_Handwritten_Notes.pdf', 14500000, 'application/pdf', 'notes/' || v_note1_id || '/original.pdf', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')
        ON CONFLICT (note_id) DO NOTHING;
    END IF;

    IF v_dbms_subj_id IS NOT NULL THEN
        INSERT INTO public.notes (
            id, title, description, creator_id, university_id, college_id, branch_id, subject_id,
            semester, course, price, total_pages, preview_pages_count, modules, cover_image_url,
            status, sales_count, average_rating, ratings_count
        ) VALUES (
            v_note2_id,
            'DBMS (21CS53) - ER Diagrams, SQL Queries, Normalization & ACID',
            'Handwritten diagrams for ER modeling, SQL query examples, BCNF/3NF decomposition steps, and concurrency control algorithms.',
            v_creator_id, v_univ_id, v_college_id, v_cse_id, v_dbms_subj_id, 5, 'B.E.', 39.00, 54, 3,
            ARRAY[
                'Module 1: Database Concepts & ER Modeling',
                'Module 2: Relational Model & SQL/PL-SQL',
                'Module 3: Normalization (1NF, 2NF, 3NF, BCNF)',
                'Module 4: Transaction Processing & ACID Properties',
                'Module 5: Concurrency Control & Recovery System'
            ],
            'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1000',
            'APPROVED', 57, 4.8, 46
        ) ON CONFLICT (id) DO NOTHING;

        INSERT INTO public.note_files (note_id, file_name, file_size_bytes, mime_type, storage_path, sha256_hash)
        VALUES (v_note2_id, '21CS53_DBMS_Notes.pdf', 11200000, 'application/pdf', 'notes/' || v_note2_id || '/original.pdf', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b856')
        ON CONFLICT (note_id) DO NOTHING;
    END IF;

    IF v_os_subj_id IS NOT NULL THEN
        INSERT INTO public.notes (
            id, title, description, creator_id, university_id, college_id, branch_id, subject_id,
            semester, course, price, total_pages, preview_pages_count, modules, cover_image_url,
            status, sales_count, average_rating, ratings_count
        ) VALUES (
            v_note3_id,
            'Operating Systems (21CS44) - CPU Scheduling, Deadlocks, Memory Management',
            'Short revision notes with step-by-step solved problems on Bankers Algorithm, Paging, Page Replacement (FIFO, LRU, Optimal), and Semaphore Synchronization.',
            v_creator_id, v_univ_id, v_college_id, v_cse_id, v_os_subj_id, 4, 'B.E.', 39.00, 48, 3,
            ARRAY[
                'Module 1: OS Structures & System Calls',
                'Module 2: Process Management & CPU Scheduling',
                'Module 3: Deadlocks & Banker Algorithm',
                'Module 4: Memory Management & Virtual Memory (LRU/FIFO)',
                'Module 5: File Systems & Disk Scheduling'
            ],
            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=1000',
            'APPROVED', 63, 4.9, 51
        ) ON CONFLICT (id) DO NOTHING;

        INSERT INTO public.note_files (note_id, file_name, file_size_bytes, mime_type, storage_path, sha256_hash)
        VALUES (v_note3_id, '21CS44_OS_Notes.pdf', 9800000, 'application/pdf', 'notes/' || v_note3_id || '/original.pdf', 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b857')
        ON CONFLICT (note_id) DO NOTHING;
    END IF;
END $$;
