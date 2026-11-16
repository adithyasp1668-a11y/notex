# NoteX — Student Academic Notes Marketplace

> **Tagline:** "Your Notes. Your Knowledge. Your Earnings."

NoteX is a student-to-student educational marketplace where college students upload their original academic notes, set their own prices, and earn money when peer students purchase them.

Designed with an ultra-clean, high-craft editorial SaaS aesthetic (inspired by modern developer products like Studio.Design and Linear), prioritizing crisp typography, subtle borders, high contrast, and zero artificial "AI-generator" clichés.

---

## 🎯 Launch Focus
- **Target Universities:** Visvesvaraya Technological University (VTU), Anna University, Mumbai University, DTU.
- **Top Engineering Colleges:** RV College of Engineering (RVCE), BMS College of Engineering (BMSCE), PES University, MS Ramaiah Institute of Technology (MSRIT), Dayananda Sagar College of Engineering (DSCE).
- **Core Branches:** CSE, ISE, ECE, EEE, Mechanical, AI & DS.
- **Academic Material:** Semester-based syllabus notes, unit summaries, and solved university question papers.

---

## 💸 Zero-Cost Architecture & Business Model
- **Proposed Flat Fee:** Flat **₹10 platform fee** per successful note purchase (for hosting, bandwidth, and watermarking).
- **Creator Retention:** Creator retains 100% of the remaining amount (`Selling Price - ₹10`). Example: Selling at ₹49 yields **₹39 gross student earnings** directly to their UPI wallet.
- **Mock Payment Mode:** Complete zero-infrastructure mock payment simulation system with instant ledger updates, transaction reference IDs (`NTX-XXXXX`), and buyer library licensing.
- **Zero Paid Submissions:** Developed strictly on free-tier, open-source tech stacks.

---

## 🛠️ Technology Stack
- **Framework:** React 18 + Vite + TypeScript
- **Backend / Database:** Supabase (PostgreSQL 15+, Row Level Security, Supabase Auth, Supabase Storage)
- **Styling:** Tailwind CSS + PostCSS + Custom Plus Jakarta Sans typography
- **Icons:** Lucide React
- **Data Visualizations:** Recharts
- **Form & Validation:** React Hook Form + Zod
- **Query Cache:** TanStack Query
- **Routing:** React Router v6

---

## 🗄️ Database Schema & Live Verification
All 18 tables verified with active PostgreSQL Row Level Security (RLS) policies:
1. `profiles` — Linked to Supabase `auth.users`
2. `universities` — Seeded with VTU
3. `colleges` — RVCE, BMSCE, MSRIT, PESU, DSCE
4. `branches` — CSE, ISE, ECE, EEE, MECH, AI&DS
5. `subjects` — 21CS52, 21CS53, 21CS44, 21CS54
6. `notes` — Approved marketplace listings & submissions
7. `note_files` — Private storage object keys
8. `purchases` — Unique student-note transaction records
9. `payments` — Atomic ledger payments
10. `creator_wallets` — Live creator balances
11. `wallet_transactions` — Full financial ledger
12. `payouts` — UPI settlement requests
13. `reviews` — Verified buyer ratings
14. `reports` — Academic integrity reporting
15. `wishlists` — Student wishlist bookmarks
16. `notifications` — In-app student alerts
17. `admin_audit_logs` — Governance audit trail
18. `platform_settings` — Platform commission configuration (`₹10.00`)

---

## 🛡️ Private Storage & Anti-Piracy Dynamic Watermarking
- **Private PDF Storage:** Files uploaded to private bucket `notex-notes/${userId}/${noteId}_${timestamp}.pdf` with binary magic byte `%PDF-` signature verification.
- **Personalized Watermarking:** Every note rendered in the NoteX Canvas Document Viewer features dynamic forensic watermarks:
  - Licensee Name (`LICENSED TO: [STUDENT]`)
  - Transaction Reference (`NOTEX ID: [NTX-XXXXX]`)
  - Masked Buyer Email
  - Diagonal repetition across all pages to discourage print redistribution.

---

## 🚀 Getting Started Locally

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch at `http://localhost:5173`.

### 3. Production Build
```bash
npm run build
```
*(Compiled with TypeScript checking in 6.54s)*
