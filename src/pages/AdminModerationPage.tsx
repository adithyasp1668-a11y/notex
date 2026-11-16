import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Check, 
  X, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  FileText, 
  Coins, 
  Eye, 
  Settings, 
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoteItem } from '../types';
import { EmptyState } from '../components/common/EmptyState';

export const AdminModerationPage: React.FC = () => {
  const { notes, approveNote, rejectNote, purchasedNotes, openViewer } = useApp();
  const [rejectReason, setRejectReason] = useState<{ [noteId: string]: string }>({});
  const [selectedTab, setSelectedTab] = useState<'pending' | 'all' | 'analytics' | 'settings'>('pending');

  const pendingNotes = notes.filter(n => n.status === 'PENDING_REVIEW');
  const approvedNotes = notes.filter(n => n.status === 'APPROVED');
  const rejectedNotes = notes.filter(n => n.status === 'REJECTED');

  const totalPlatformCommissions = purchasedNotes.reduce((acc, curr) => acc + curr.platformCommission, 0);

  const handleApprove = (noteId: string) => {
    approveNote(noteId);
  };

  const handleReject = (noteId: string) => {
    const reason = rejectReason[noteId] || 'Incomplete syllabus coverage or unverified handwriting.';
    rejectNote(noteId, reason);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Admin Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-navy-950 text-white font-bold text-[10px] uppercase">
                Platform Admin Portal
              </span>
              <span className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> High Privilege Route
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950 font-display mt-1">
              NoteX Moderation & Governance
            </h1>
            <p className="text-xs text-slate-500">
              Review submitted PDFs, enforce academic integrity, audit transactions, and manage platform commission.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 border border-amber-200">
              {pendingNotes.length} Pending Approval
            </span>
          </div>
        </div>

        {/* Admin KPI Overview Cards (Prompt Section 16) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Total Listed Notes
            </span>
            <div className="text-2xl font-black text-navy-950 font-display">
              {notes.length}
            </div>
            <div className="text-[11px] text-slate-500">
              {approvedNotes.length} live on marketplace
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Pending Submissions
            </span>
            <div className="text-2xl font-black text-amber-600 font-display">
              {pendingNotes.length}
            </div>
            <div className="text-[11px] text-amber-700 font-semibold">
              Action required
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
              Simulated Purchases
            </span>
            <div className="text-2xl font-black text-navy-950 font-display">
              {purchasedNotes.length}
            </div>
            <div className="text-[11px] text-emerald-600 font-semibold">
              100% test ledger integrity
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-1 bg-gradient-to-br from-white to-blue-50/50">
            <span className="text-[11px] font-bold text-brand-700 uppercase tracking-wider block">
              Platform Fee Collected (₹10/sale)
            </span>
            <div className="text-2xl font-black text-brand-700 font-display">
              ₹{totalPlatformCommissions.toLocaleString()}
            </div>
            <div className="text-[11px] text-slate-500">
              Recorded in test mode
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
          <button
            onClick={() => setSelectedTab('pending')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedTab === 'pending' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Review Queue ({pendingNotes.length})
          </button>
          <button
            onClick={() => setSelectedTab('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedTab === 'all' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            All Submissions ({notes.length})
          </button>
          <button
            onClick={() => setSelectedTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
              selectedTab === 'settings' ? 'bg-navy-950 text-white shadow-sm' : 'text-slate-600 hover:bg-white'
            }`}
          >
            Commission & Settings
          </button>
        </div>

        {/* TAB 1: REVIEW QUEUE */}
        {selectedTab === 'pending' && (
          <div>
            {pendingNotes.length === 0 ? (
              <EmptyState
                icon={CheckCircle2}
                title="Moderation Queue is Clear"
                description="All student note uploads have been moderated and reviewed. No action needed at this time."
              />
            ) : (
              <div className="space-y-4">
                {pendingNotes.map(n => (
                  <div 
                    key={n.id}
                    className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4"
                  >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold">
                            PENDING_REVIEW
                          </span>
                          <span className="text-xs text-slate-500">
                            Uploaded {new Date(n.uploadedAt).toLocaleDateString()}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-navy-950 mt-1">
                          {n.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {n.subject} ({n.subjectCode}) • {n.branch} Sem {n.semester} • {n.pagesCount} Pages • Selling at ₹{n.price}
                        </p>
                        <p className="text-xs text-slate-500 mt-2 italic bg-slate-50 p-2.5 rounded-xl border border-slate-100 max-w-2xl">
                          "{n.description}"
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        <button
                          onClick={() => openViewer(n)}
                          className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 flex items-center gap-1.5"
                        >
                          <Eye className="w-3.5 h-3.5 text-slate-500" />
                          Inspect Document
                        </button>
                        <button
                          onClick={() => handleApprove(n.id)}
                          className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 transition-colors"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Approve Note
                        </button>
                      </div>
                    </div>

                    {/* Rejection input */}
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Rejection reason if rejecting (e.g. illegible scans, missing Module 4)..."
                        value={rejectReason[n.id] || ''}
                        onChange={(e) => setRejectReason({ ...rejectReason, [n.id]: e.target.value })}
                        className="flex-1 text-xs p-2 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                      />
                      <button
                        onClick={() => handleReject(n.id)}
                        className="px-3 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 text-xs font-bold transition-colors"
                      >
                        Reject
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: ALL SUBMISSIONS */}
        {selectedTab === 'all' && (
          <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase text-[10px]">
                  <tr>
                    <th className="p-4">Title</th>
                    <th className="p-4">Creator</th>
                    <th className="p-4">Branch/Sem</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Preview</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notes.map(n => (
                    <tr key={n.id} className="hover:bg-slate-50/70">
                      <td className="p-4 font-semibold text-slate-900">{n.title}</td>
                      <td className="p-4 text-slate-600">{n.creatorName}</td>
                      <td className="p-4 text-slate-600">{n.branch} Sem {n.semester}</td>
                      <td className="p-4 font-bold text-navy-950">₹{n.price}</td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          n.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800' :
                          n.status === 'PENDING_REVIEW' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {n.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => openViewer(n)}
                          className="px-2.5 py-1 rounded border border-slate-200 text-slate-600 hover:bg-slate-100 text-xs"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: SETTINGS */}
        {selectedTab === 'settings' && (
          <div className="max-w-xl bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-base font-bold text-navy-950">Commission & Platform Policy</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-semibold mb-1">Standard Platform Fee per Transaction (₹)</label>
                <input 
                  type="number" 
                  value={10} 
                  disabled 
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 font-bold" 
                />
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Proposed flat ₹10 fee per note purchase.
                </span>
              </div>

              <div>
                <label className="block text-slate-700 font-semibold mb-1">Active University Focus</label>
                <input 
                  type="text" 
                  value="Visvesvaraya Technological University (VTU) - 2021/2022 Scheme" 
                  disabled 
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 font-semibold" 
                />
              </div>

              <div className="p-4 rounded-2xl bg-brand-50 border border-brand-100 text-brand-900 space-y-1">
                <strong>Zero Infrastructure Cost Architecture</strong>
                <p>All database models, private storage tokens, RLS rules and mock payments operate within 100% free open-source tiers.</p>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
