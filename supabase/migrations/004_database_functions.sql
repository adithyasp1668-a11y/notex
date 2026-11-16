-- ====================================================================
-- NOTEX DATABASE MIGRATION 004: FUNCTIONS, TRIGGERS & ATOMIC PURCHASES
-- ====================================================================

-- 1. Trigger to automatically create profile and wallet on auth signup
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

    -- Initialize creator wallet
    INSERT INTO public.creator_wallets (creator_id, available_balance, pending_balance, total_earned)
    VALUES (NEW.id, 0.00, 0.00, 0.00)
    ON CONFLICT (creator_id) DO NOTHING;

    RETURN NEW;
END;
$$;

-- Drop trigger if exists and recreate
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Atomic Mock Purchase Processor Function (Database Transaction)
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
    -- Verify note exists and is approved
    SELECT * INTO v_note FROM public.notes WHERE id = p_note_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Note not found';
    END IF;

    IF v_note.status != 'APPROVED' THEN
        RAISE EXCEPTION 'Note is not approved for sale';
    END IF;

    -- Verify buyer exists
    SELECT * INTO v_buyer FROM public.profiles WHERE id = p_buyer_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Buyer profile not found';
    END IF;

    -- Check for duplicate purchase
    IF EXISTS (SELECT 1 FROM public.purchases WHERE buyer_id = p_buyer_id AND note_id = p_note_id AND status = 'COMPLETED') THEN
        RAISE EXCEPTION 'You have already purchased this note';
    END IF;

    -- Generate reference ID e.g. NTX-81726
    v_ref_id := 'NTX-' || (10000 + FLOOR(RANDOM() * 90000))::TEXT;
    v_creator_earning := GREATEST(0.00, v_note.price - v_platform_fee);

    -- 1. Insert Purchase Record
    INSERT INTO public.purchases (
        reference_id,
        buyer_id,
        note_id,
        creator_id,
        amount,
        commission,
        creator_amount,
        status,
        is_test_transaction
    )
    VALUES (
        v_ref_id,
        p_buyer_id,
        p_note_id,
        v_note.creator_id,
        v_note.price,
        v_platform_fee,
        v_creator_earning,
        'COMPLETED',
        true
    )
    RETURNING id INTO v_purchase_id;

    -- 2. Insert Payment Record
    INSERT INTO public.payments (
        purchase_id,
        gateway_order_id,
        gateway_payment_id,
        amount,
        status,
        is_test
    )
    VALUES (
        v_purchase_id,
        'MOCK_ORDER_' || v_ref_id,
        'MOCK_PAY_' || v_ref_id,
        v_note.price,
        'SUCCESS',
        true
    );

    -- 3. Update Creator Wallet (create if missing)
    INSERT INTO public.creator_wallets (creator_id, available_balance, pending_balance, total_earned)
    VALUES (v_note.creator_id, v_creator_earning, 0.00, v_creator_earning)
    ON CONFLICT (creator_id) DO UPDATE SET
        available_balance = public.creator_wallets.available_balance + v_creator_earning,
        total_earned = public.creator_wallets.total_earned + v_creator_earning,
        updated_at = NOW()
    RETURNING id INTO v_wallet_id;

    -- 4. Record in Auditable Wallet Transactions Ledger
    INSERT INTO public.wallet_transactions (
        wallet_id,
        purchase_id,
        transaction_type,
        amount,
        description
    )
    VALUES (
        v_wallet_id,
        v_purchase_id,
        'SALE_CREDIT',
        v_creator_earning,
        'Sale credit for note: ' || v_note.title || ' (Ref: ' || v_ref_id || ')'
    );

    -- 5. Send Notification to Creator
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

-- --------------------------------------------------------------------
-- 3. Seed VTU Reference Data (Universities, Colleges, Branches, Subjects)
-- --------------------------------------------------------------------
DO $$
DECLARE
    v_univ_id UUID;
    v_rvce_id UUID;
    v_bmsce_id UUID;
    v_msrit_id UUID;
    v_pesu_id UUID;
    v_dsce_id UUID;
    v_cse_id UUID;
    v_ise_id UUID;
    v_ece_id UUID;
    v_eee_id UUID;
    v_mech_id UUID;
BEGIN
    -- Insert University
    INSERT INTO public.universities (university_name, abbreviation)
    VALUES ('Visvesvaraya Technological University', 'VTU')
    ON CONFLICT (university_name) DO UPDATE SET abbreviation = 'VTU'
    RETURNING id INTO v_univ_id;

    -- Insert Colleges
    INSERT INTO public.colleges (university_id, college_name, city, state)
    VALUES 
        (v_univ_id, 'RV College of Engineering (RVCE)', 'Bengaluru', 'Karnataka'),
        (v_univ_id, 'BMS College of Engineering (BMSCE)', 'Bengaluru', 'Karnataka'),
        (v_univ_id, 'MS Ramaiah Institute of Technology (MSRIT)', 'Bengaluru', 'Karnataka'),
        (v_univ_id, 'PES University', 'Bengaluru', 'Karnataka'),
        (v_univ_id, 'Dayananda Sagar College of Engineering (DSCE)', 'Bengaluru', 'Karnataka')
    ON CONFLICT DO NOTHING;

    -- Insert Branches
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
    SELECT id INTO v_ise_id FROM public.branches WHERE branch_code = 'ISE';
    SELECT id INTO v_ece_id FROM public.branches WHERE branch_code = 'ECE';

    -- Insert Core Subjects
    IF v_cse_id IS NOT NULL THEN
        INSERT INTO public.subjects (subject_name, subject_code, branch_id, semester)
        VALUES 
            ('Computer Networks', '21CS52', v_cse_id, 5),
            ('Database Management Systems', '21CS53', v_cse_id, 5),
            ('Operating Systems', '21CS44', v_cse_id, 4),
            ('Theory of Computation', '21CS54', v_cse_id, 5)
        ON CONFLICT (subject_code) DO NOTHING;
    END IF;

    IF v_ece_id IS NOT NULL THEN
        INSERT INTO public.subjects (subject_name, subject_code, branch_id, semester)
        VALUES 
            ('Digital Signal Processing', '21EC52', v_ece_id, 5),
            ('Control Systems', '21EC43', v_ece_id, 4)
        ON CONFLICT (subject_code) DO NOTHING;
    END IF;
END $$;
