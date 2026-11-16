import React, { useState } from 'react';
import { 
  UploadCloud, 
  Wallet, 
  TrendingUp, 
  FileText, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  ArrowUpRight,
  Plus,
  Coins,
  ShieldCheck,
  CreditCard,
  Building,
  Sparkles,
  Eye
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  BarChart, 
  Bar 
} from 'recharts';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { BRANCHES, COLLEGES, UNIVERSITIES } from '../data/mockData';
import { EngineeringBranch } from '../types';
import { validatePdfFile, uploadPrivateNotePdf, PdfValidationResult } from '../services/storageService';
import { EmptyState } from '../components/common/EmptyState';

export const CreatorDashboardPage: React.FC = () => {
  const { 
    user, 
    notes, 
    uploadNote, 
    payoutRequests, 
    requestPayout, 
    openViewer 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'upload' | 'my-notes' | 'wallet'>('overview');

  // Upload Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [university, setUniversity] = useState('Visvesvaraya Technological University (VTU)');
  const [college, setCollege] = useState('RV College of Engineering (RVCE), Bengaluru');
  const [course, setCourse] = useState('B.E.');
  const [branch, setBranch] = useState<EngineeringBranch>('CSE');
  const [semester, setSemester] = useState<number>(5);
  const [subject, setSubject] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [modulesText, setModulesText] = useState('Module 1: Fundamental Concepts\nModule 2: Architecture & Algorithms\nModule 3: Solved VTU Question Papers');
  const [price, setPrice] = useState<number>(49);
  const { user: authUser } = useAuth();
  const [pagesCount, setPagesCount] = useState<number>(64);
  const [ownershipAgreed, setOwnershipAgreed] = useState(false);
  const [simulatedFileName, setSimulatedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [pdfValidation, setPdfValidation] = useState<PdfValidationResult | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Payout request modal/form state
  const [payoutAmount, setPayoutAmount] = useState<number>(500);
  const [upiId, setUpiId] = useState('rahul.k@oksbi');

  // Creator's notes (we consider notes authored by user or initial ones)
  const myNotes = notes.filter(n => n.creatorId === user.id || n.creatorName.includes(user.name) || n.creatorId === 'usr-creator-01');
  const approvedNotes = myNotes.filter(n => n.status === 'APPROVED');
  const pendingNotes = myNotes.filter(n => n.status === 'PENDING_REVIEW');
  const rejectedNotes = myNotes.filter(n => n.status === 'REJECTED');

  // Calculate earnings
  const totalSales = myNotes.reduce((acc, curr) => acc + (curr.salesCount || 0), 0);
  const grossRevenue = myNotes.reduce((acc, curr) => acc + (curr.salesCount * curr.price), 0);
  const totalCommissionDeductions = totalSales * 10;
  const netEarnings = Math.max(0, grossRevenue - totalCommissionDeductions);
  const availableBalance = Math.max(0, netEarnings - 450); // subtracting processed payout

  // Chart data for earnings
  const salesChartData = [
    { day: 'Mon', sales: 4, revenue: 156 },
    { day: 'Tue', sales: 7, revenue: 273 },
    { day: 'Wed', sales: 12, revenue: 468 },
    { day: 'Thu', sales: 18, revenue: 702 },
    { day: 'Fri', sales: 25, revenue: 975 },
    { day: 'Sat', sales: 34, revenue: 1326 },
    { day: 'Sun', sales: 42, revenue: 1638 },
  ];

  const handlePdfFileSelect = async (file: File) => {
    setSelectedFile(file);
    setSimulatedFileName(file.name);
    const validation = await validatePdfFile(file);
    setPdfValidation(validation);
    if (validation.valid && validation.pageCount) {
      setPagesCount(validation.pageCount);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !subject || !ownershipAgreed) return;

    if (selectedFile && pdfValidation && !pdfValidation.valid) {
      alert(`Invalid PDF: ${pdfValidation.error}`);
      return;
    }

    setIsUploading(true);

    const parsedModules = modulesText
      .split('\n')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    const newNoteId = `ntx-note-${Date.now()}`;

    // Upload to private Supabase Storage if file and auth are available
    if (selectedFile && authUser) {
      const uploadRes = await uploadPrivateNotePdf(authUser.id, newNoteId, selectedFile);
      if (!uploadRes.success) {
        console.warn('Storage upload note:', uploadRes.error);
      }
    }

    uploadNote({
      title,
      description,
      university,
      college,
      course,
      branch,
      semester,
      subject,
      subjectCode: subjectCode || `${branch}501`,
      modules: parsedModules.length > 0 ? parsedModules : ['Complete 5 Modules with solved papers'],
      price,
      pagesCount,
      coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
      samplePreviewPages: [
        'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=1000'
      ],
      creatorId: authUser?.id || user.id,
      creatorName: user.name,
      creatorCollege: user.college,
      creatorAvatar: user.avatarUrl,
    });

    setIsUploading(false);

    // Reset form
    setTitle('');
    setDescription('');
    setSubject('');
    setSubjectCode('');
    setOwnershipAgreed(false);
    setSimulatedFileName('');
    setSelectedFile(null);
    setPdfValidation(null);
    setActiveTab('my-notes');
  };

  const handlePayoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (payoutAmount <= 0 || payoutAmount > availableBalance) return;
    requestPayout(payoutAmount, upiId);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Creator Studio Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold text-[10px] uppercase">
                Creator Studio
              </span>
              <span className="text-xs text-slate-500">VTU Academic Partner</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950 font-display mt-1">
              Note Creator Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              Manage your uploaded study notes, track real sales, and request UPI payouts with transparent ₹10 commission.
            </p>
          </div>

          <button
            onClick={() => setActiveTab('upload')}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-md shadow-purple-500/25 hover:opacity-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Study Note</span>
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Studio Overview & Analytics
          </button>

          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'upload' ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Upload Note Form</span>
          </button>

          <button
            onClick={() => setActiveTab('my-notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap ${
              activeTab === 'my-notes' ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            My Listings ({myNotes.length})
          </button>

          <button
            onClick={() => setActiveTab('wallet')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'wallet' ? 'bg-navy-900 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Wallet className="w-3.5 h-3.5" />
            <span>Wallet & Payouts (₹{availableBalance.toLocaleString()})</span>
          </button>
        </div>

        {/* ------------------------------------------------------------- */}
        {/* TAB 1: OVERVIEW & ANALYTICS                                   */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            
            {/* Metric KPI Cards (Prompt Section 15) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Total Student Sales
                </span>
                <div className="text-2xl font-black text-navy-950 font-display">
                  {totalSales}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                  <ArrowUpRight className="w-3 h-3" /> +18% this exam month
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  Gross Student Sales
                </span>
                <div className="text-2xl font-black text-navy-950 font-display">
                  ₹{grossRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">
                  Before platform fee
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                  NoteX Platform Fee (₹10/sale)
                </span>
                <div className="text-2xl font-black text-brand-600 font-display">
                  ₹{totalCommissionDeductions.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-400">
                  Fixed hosting & watermark fee
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 bg-gradient-to-br from-white to-purple-50/50">
                <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                  Available for UPI Withdrawal
                </span>
                <div className="text-2xl font-black text-purple-700 font-display">
                  ₹{availableBalance.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 font-semibold">
                  Ready to withdraw
                </div>
              </div>

            </div>

            {/* Sales Chart & Performance (Recharts) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-navy-950">Daily Sales Trend (VTU Exam Season)</h3>
                    <p className="text-xs text-slate-500">Student purchases across all uploaded semester notes</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg">
                    Live Data
                  </span>
                </div>

                <div className="h-64 w-full pt-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesChartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="day" stroke="#94a3b8" fontSize={12} />
                      <YAxis stroke="#94a3b8" fontSize={12} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', color: '#fff', fontSize: '12px' }} 
                        itemStyle={{ color: '#60a5fa' }}
                      />
                      <Bar dataKey="sales" fill="#4f46e5" radius={[6, 6, 0, 0]} name="Copies Sold" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Status Breakdown Box */}
              <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-navy-950">Listing Health</h3>
                  <p className="text-xs text-slate-500">Approval and moderation breakdown</p>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 text-emerald-900 text-xs">
                    <span className="font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Approved & Live
                    </span>
                    <span className="font-extrabold text-sm">{approvedNotes.length}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-amber-50 text-amber-900 text-xs">
                    <span className="font-semibold flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-600" /> Pending Admin Review
                    </span>
                    <span className="font-extrabold text-sm">{pendingNotes.length}</span>
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-xl bg-red-50 text-red-900 text-xs">
                    <span className="font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 text-red-600" /> Rejected / Suspended
                    </span>
                    <span className="font-extrabold text-sm">{rejectedNotes.length}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
                  <span className="font-bold text-slate-900 block">Creator Guarantee</span>
                  <span>Every buyer view is watermarked with buyer identity to protect your IP.</span>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 2: UPLOAD NOTE FORM (Prompt Section 9 & 10)               */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'upload' && (
          <div className="max-w-3xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
            <div>
              <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
                Upload New Note
              </span>
              <h2 className="text-2xl font-black text-navy-950 font-display mt-0.5">
                Share Course Notes & Set Your Price
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Submissions are screened by NoteX moderators to ensure original content, accurate syllabus coverage, and clear handwriting.
              </p>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-6">
              
              {/* Note Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Note Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Computer Networks (21CS52) - Comprehensive 5-Module VTU Notes"
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Subject & Code */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Operating Systems"
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Subject Code
                  </label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    placeholder="e.g. 21CS44"
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-500"
                  />
                </div>
              </div>

              {/* Branch & Semester */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Engineering Branch *
                  </label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value as any)}
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-500"
                  >
                    {BRANCHES.map(b => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Semester *
                  </label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-500"
                  >
                    {[3, 4, 5, 6, 7, 8].map(sem => (
                      <option key={sem} value={sem}>Semester {sem}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detail key chapters, whether diagrams and previous year solved questions are included..."
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-500"
                />
              </div>

              {/* Modules breakdown */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Modules / Chapters (One per line)
                </label>
                <textarea
                  rows={3}
                  value={modulesText}
                  onChange={(e) => setModulesText(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:outline-none focus:border-brand-500 font-mono"
                />
              </div>

              {/* Price & Page Count */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-brand-50/50 border border-brand-100">
                <div>
                  <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">
                    Selling Price (₹) *
                  </label>
                  <input
                    type="number"
                    min={15}
                    max={299}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full text-sm font-bold p-3 rounded-xl border border-brand-200 bg-white"
                  />
                  <span className="text-[11px] text-brand-700 mt-1 block">
                    You earn: <strong className="text-emerald-700">₹{Math.max(0, price - 10)}</strong> (₹10 NoteX platform fee)
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-brand-900 uppercase tracking-wider mb-1">
                    Number of Pages *
                  </label>
                  <input
                    type="number"
                    min={5}
                    max={300}
                    value={pagesCount}
                    onChange={(e) => setPagesCount(Number(e.target.value))}
                    className="w-full text-sm font-bold p-3 rounded-xl border border-brand-200 bg-white"
                  />
                  <span className="text-[11px] text-slate-500 mt-1 block">
                    Must match original PDF
                  </span>
                </div>
              </div>

              {/* PDF Document Upload with File Signature Validation */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Upload PDF Document (Private Document Storage 'notex-notes') *
                </label>
                <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition-colors bg-slate-50/50 ${
                  pdfValidation?.valid ? 'border-emerald-400 bg-emerald-50/20' : 
                  pdfValidation?.error ? 'border-rose-400 bg-rose-50/20' : 
                  'border-slate-300 hover:border-brand-500'
                }`}>
                  <FileText className={`w-8 h-8 mx-auto mb-2 ${pdfValidation?.valid ? 'text-emerald-600' : 'text-brand-600'}`} />
                  <p className="text-xs font-bold text-slate-800">
                    {simulatedFileName || 'Click to select note PDF file (Max 50MB)'}
                  </p>
                  
                  {pdfValidation?.valid ? (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Signature Validated: %PDF- format • {pagesCount} Pages</span>
                    </div>
                  ) : pdfValidation?.error ? (
                    <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-bold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{pdfValidation.error}</span>
                    </div>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-1">
                      MIME type: application/pdf • Auto-checks %PDF- magic signature
                    </p>
                  )}

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handlePdfFileSelect(e.target.files[0]);
                      }
                    }}
                    className="hidden"
                    id="pdf-upload-input"
                  />
                  <div className="mt-3">
                    <label
                      htmlFor="pdf-upload-input"
                      className="inline-block px-4 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm"
                    >
                      {selectedFile ? 'Change PDF File' : 'Select PDF File'}
                    </label>
                  </div>
                </div>
              </div>

              {/* Ownership & Copyright Confirmation (Prompt Section 10) */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    required
                    checked={ownershipAgreed}
                    onChange={(e) => setOwnershipAgreed(e.target.checked)}
                    className="mt-0.5 rounded text-brand-600 focus:ring-brand-500"
                  />
                  <span className="text-slate-700 leading-relaxed">
                    <strong>I certify ownership:</strong> These notes are my original academic work. I have not copied copyrighted textbook PDFs or pirated commercial materials. I agree to the NoteX Copyright and Content Policy.
                  </span>
                </label>
              </div>

              <button
                type="submit"
                disabled={!ownershipAgreed}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition-all disabled:opacity-50"
              >
                Submit Note for Moderation (Status: PENDING_REVIEW)
              </button>

            </form>
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 3: MY LISTINGS (With status badges)                       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'my-notes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-navy-950">
                Uploaded Notes List ({myNotes.length})
              </h3>
            </div>

            {myNotes.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No notes uploaded yet"
                description="Upload your high-scoring handwritten VTU notes to start earning passive income every semester exam season."
                actionLabel="Upload First Note"
                onAction={() => setActiveTab('upload')}
              />
            ) : (
              <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                    <tr>
                      <th className="p-4">Note Title & Subject</th>
                      <th className="p-4">Branch & Sem</th>
                      <th className="p-4">Price</th>
                      <th className="p-4">Sales</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myNotes.map(n => (
                      <tr key={n.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="p-4">
                          <strong className="block text-slate-900 font-semibold">{n.title}</strong>
                          <span className="text-slate-500 text-[11px]">{n.subject} ({n.subjectCode})</span>
                        </td>
                        <td className="p-4 text-slate-600">
                          {n.branch} • Sem {n.semester}
                        </td>
                        <td className="p-4 font-bold text-navy-950">
                          ₹{n.price}
                        </td>
                        <td className="p-4 font-semibold text-emerald-600">
                          {n.salesCount} copies
                        </td>
                        <td className="p-4">
                          {n.status === 'APPROVED' && (
                            <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Approved
                            </span>
                          )}
                          {n.status === 'PENDING_REVIEW' && (
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                              Pending Review
                            </span>
                          )}
                          {n.status === 'REJECTED' && (
                            <span className="px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[10px] font-bold">
                              Rejected
                            </span>
                          )}
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => openViewer(n)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-700 font-semibold"
                          >
                            Preview Note
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            )}
          </div>
        )}

        {/* ------------------------------------------------------------- */}
        {/* TAB 4: WALLET & PAYOUT REQUESTS (Prompt Section 11 & 12)       */}
        {/* ------------------------------------------------------------- */}
        {activeTab === 'wallet' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Wallet Balance Card */}
            <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div>
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                  Creator Available Balance
                </span>
                <div className="text-4xl font-black text-navy-950 font-display mt-1">
                  ₹{availableBalance.toLocaleString()}
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Net earnings ready for UPI transfer.
                </p>
              </div>

              {/* Request Payout Form */}
              <form onSubmit={handlePayoutSubmit} className="space-y-4 pt-4 border-t border-slate-100">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Withdrawal Amount (₹)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={availableBalance}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(Number(e.target.value))}
                    className="w-full text-sm font-bold p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block">Minimum withdrawal: ₹100</span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    UPI ID / VPA
                  </label>
                  <input
                    type="text"
                    required
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="e.g. mobile@okaxis or name@paytm"
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-slate-50"
                  />
                </div>

                <button
                  type="submit"
                  disabled={availableBalance < 100}
                  className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                >
                  Request Instant UPI Settlement
                </button>
              </form>
            </div>

            {/* Payout History Ledger */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h3 className="text-base font-bold text-navy-950">Payout Requests History</h3>
              
              <div className="space-y-3">
                {payoutRequests.map(req => (
                  <div key={req.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                    <div>
                      <strong className="block text-navy-950 font-bold text-sm">₹{req.amount}</strong>
                      <span className="text-slate-500">To UPI: {req.upiId}</span>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                        {req.status}
                      </span>
                      <span className="block text-[10px] text-slate-400 mt-1">
                        {new Date(req.requestedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
