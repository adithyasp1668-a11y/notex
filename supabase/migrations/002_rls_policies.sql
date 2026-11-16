-- ====================================================================
-- NOTEX DATABASE MIGRATION 002: ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

-- 1. Helper function to check if current user is Admin
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

-- Enable RLS on all sensitive tables
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

-- --------------------------------------------------------------------
-- A. PUBLIC REFERENCE TABLES (Universities, Colleges, Branches, Subjects)
-- --------------------------------------------------------------------
CREATE POLICY "Public can view universities"
ON public.universities FOR SELECT USING (true);

CREATE POLICY "Public can view colleges"
ON public.colleges FOR SELECT USING (true);

CREATE POLICY "Public can view branches"
ON public.branches FOR SELECT USING (true);

CREATE POLICY "Public can view subjects"
ON public.subjects FOR SELECT USING (true);

-- --------------------------------------------------------------------
-- B. PROFILES
-- --------------------------------------------------------------------
CREATE POLICY "Public can view basic profiles"
ON public.profiles FOR SELECT USING (true);

CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE USING (auth.uid() = id)
WITH CHECK (
    auth.uid() = id AND 
    -- Prevent users from self-promoting to admin
    role = (SELECT role FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Admins can manage all profiles"
ON public.profiles FOR ALL USING (public.is_admin());

-- --------------------------------------------------------------------
-- C. NOTES
-- --------------------------------------------------------------------
-- Anyone can view approved notes
CREATE POLICY "Public can view approved notes"
ON public.notes FOR SELECT
USING (status = 'APPROVED' OR creator_id = auth.uid() OR public.is_admin());

-- Creators can insert notes with PENDING_REVIEW or DRAFT
CREATE POLICY "Creators can insert own notes"
ON public.notes FOR INSERT
WITH CHECK (
    auth.uid() = creator_id AND 
    status IN ('DRAFT', 'PENDING_REVIEW')
);

-- Creators can update only their own notes (cannot change to APPROVED themselves)
CREATE POLICY "Creators can update own notes"
ON public.notes FOR UPDATE
USING (auth.uid() = creator_id)
WITH CHECK (
    auth.uid() = creator_id AND 
    status IN ('DRAFT', 'PENDING_REVIEW')
);

-- Admins can update any note (approve, reject, suspend)
CREATE POLICY "Admins can manage all notes"
ON public.notes FOR ALL
USING (public.is_admin());

-- --------------------------------------------------------------------
-- D. NOTE_FILES (Protected Private Storage Keys)
-- --------------------------------------------------------------------
-- Access granted ONLY if buyer purchased the note, or if creator, or if admin
CREATE POLICY "Authorized access to note files"
ON public.note_files FOR SELECT
USING (
    public.is_admin() OR
    EXISTS (SELECT 1 FROM public.notes WHERE id = note_files.note_id AND creator_id = auth.uid()) OR
    EXISTS (SELECT 1 FROM public.purchases WHERE note_id = note_files.note_id AND buyer_id = auth.uid() AND status = 'COMPLETED')
);

CREATE POLICY "Creators can insert note files for own notes"
ON public.note_files FOR INSERT
WITH CHECK (
    EXISTS (SELECT 1 FROM public.notes WHERE id = note_files.note_id AND creator_id = auth.uid())
);

-- --------------------------------------------------------------------
-- E. PURCHASES & PAYMENTS
-- --------------------------------------------------------------------
CREATE POLICY "Buyers and creators can view own purchases"
ON public.purchases FOR SELECT
USING (buyer_id = auth.uid() OR creator_id = auth.uid() OR public.is_admin());

CREATE POLICY "System/User can insert own purchase"
ON public.purchases FOR INSERT
WITH CHECK (buyer_id = auth.uid());

CREATE POLICY "Buyers can view own payments"
ON public.payments FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.purchases WHERE id = payments.purchase_id AND buyer_id = auth.uid()) OR
    public.is_admin()
);

-- --------------------------------------------------------------------
-- F. CREATOR WALLETS & LEDGER TRANSACTIONS
-- --------------------------------------------------------------------
CREATE POLICY "Creators can view own wallet"
ON public.creator_wallets FOR SELECT
USING (creator_id = auth.uid() OR public.is_admin());

-- Notice: Direct client INSERT/UPDATE on creator_wallets is disabled for students.
-- Balance is only updated atomically by database functions/triggers!

CREATE POLICY "Creators can view own wallet transactions"
ON public.wallet_transactions FOR SELECT
USING (
    EXISTS (SELECT 1 FROM public.creator_wallets WHERE id = wallet_transactions.wallet_id AND creator_id = auth.uid()) OR
    public.is_admin()
);

-- --------------------------------------------------------------------
-- G. PAYOUTS
-- --------------------------------------------------------------------
CREATE POLICY "Creators can view own payouts"
ON public.payouts FOR SELECT
USING (creator_id = auth.uid() OR public.is_admin());

CREATE POLICY "Creators can request own payout"
ON public.payouts FOR INSERT
WITH CHECK (creator_id = auth.uid() AND status = 'PENDING');

CREATE POLICY "Admins can update payouts"
ON public.payouts FOR UPDATE
USING (public.is_admin());

-- --------------------------------------------------------------------
-- H. REVIEWS
-- --------------------------------------------------------------------
CREATE POLICY "Public can view reviews"
ON public.reviews FOR SELECT USING (true);

-- Only verified buyers can submit a review
CREATE POLICY "Verified buyers can insert reviews"
ON public.reviews FOR INSERT
WITH CHECK (
    buyer_id = auth.uid() AND
    EXISTS (
        SELECT 1 FROM public.purchases 
        WHERE note_id = reviews.note_id AND buyer_id = auth.uid() AND status = 'COMPLETED'
    )
);

-- --------------------------------------------------------------------
-- I. WISHLISTS & NOTIFICATIONS & REPORTS
-- --------------------------------------------------------------------
CREATE POLICY "Users can manage own wishlist"
ON public.wishlists FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view and update own notifications"
ON public.notifications FOR ALL
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can insert reports"
ON public.reports FOR INSERT
WITH CHECK (reporter_id = auth.uid());

CREATE POLICY "Admins can manage reports"
ON public.reports FOR ALL
USING (public.is_admin());

-- --------------------------------------------------------------------
-- J. PLATFORM SETTINGS & AUDIT LOGS
-- --------------------------------------------------------------------
CREATE POLICY "Public can view platform settings"
ON public.platform_settings FOR SELECT USING (true);

CREATE POLICY "Only admins can modify platform settings"
ON public.platform_settings FOR ALL
USING (public.is_admin());

CREATE POLICY "Only admins can view audit logs"
ON public.admin_audit_logs FOR SELECT
USING (public.is_admin());
