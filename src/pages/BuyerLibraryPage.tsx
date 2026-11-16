import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Library, 
  Bookmark, 
  FileText, 
  CheckCircle2, 
  Eye, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  User,
  Settings,
  Bell
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoteCard } from '../components/common/NoteCard';
import { EmptyState } from '../components/common/EmptyState';

export const BuyerLibraryPage: React.FC = () => {
  const { user, purchasedNotes, notes, wishlist, openViewer } = useApp();
  const [activeTab, setActiveTab] = useState<'purchased' | 'wishlist' | 'profile'>('purchased');

  // Find the note objects corresponding to purchased records
  const myPurchasedNotes = purchasedNotes.map(p => {
    const note = notes.find(n => n.id === p.noteId);
    return { purchase: p, note };
  }).filter(item => item.note !== undefined);

  // Find wishlisted notes
  const myWishlistedNotes = notes.filter(n => wishlist.includes(n.id));

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Profile Header Bar */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-700 to-indigo-600 text-white flex items-center justify-center font-extrabold text-2xl shadow-md">
              RK
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-navy-950 font-display">
                  {user.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                {user.email} • {user.college} • {user.branch} Sem {user.semester}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/creator"
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition-colors"
            >
              Switch to Creator Studio
            </Link>
            <Link
              to="/explore"
              className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm transition-colors"
            >
              Browse Notes
            </Link>
          </div>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center gap-2 border-b border-slate-200 pb-3 mb-6">
          <button
            onClick={() => setActiveTab('purchased')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'purchased'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Library className="w-4 h-4" />
            <span>Purchased Notes ({myPurchasedNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('wishlist')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'wishlist'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            <span>Wishlist ({myWishlistedNotes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors flex items-center gap-2 ${
              activeTab === 'profile'
                ? 'bg-brand-600 text-white shadow-sm'
                : 'text-slate-600 hover:bg-white'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Student Profile & Security</span>
          </button>
        </div>

        {/* TAB 1: PURCHASED NOTES & PROTECTED VIEWER ACCESS */}
        {activeTab === 'purchased' && (
          <div>
            {myPurchasedNotes.length === 0 ? (
              <EmptyState
                icon={Library}
                title="Your library is currently empty"
                description="When you purchase notes through our test checkout, they will instantly appear here for lifetime watermarked reading."
                actionLabel="Explore VTU Notes"
                onAction={() => window.location.href = '/explore'}
              />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPurchasedNotes.map(({ purchase, note }) => {
                  if (!note) return null;
                  return (
                    <div 
                      key={purchase.id}
                      className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div className="relative aspect-[16/9] bg-slate-100 overflow-hidden">
                        <img 
                          src={note.coverImage} 
                          alt={note.title}
                          className="w-full h-full object-cover" 
                        />
                        <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-emerald-600 text-white text-[10px] font-bold shadow-sm flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Licensed
                        </div>
                        <div className="absolute bottom-2.5 left-2.5 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-mono">
                          ID: {purchase.referenceId}
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <span className="text-[10px] font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
                            {note.branch} • Sem {note.semester}
                          </span>
                          <h3 className="text-sm font-bold text-navy-950 mt-1 line-clamp-2">
                            {note.title}
                          </h3>
                          <p className="text-xs text-slate-500 mt-1">
                            By {note.creatorName} ({note.college.split(',')[0]})
                          </p>
                        </div>

                        <div className="pt-3 border-t border-slate-100 space-y-2">
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <span>Purchased on:</span>
                            <span className="font-semibold text-slate-700">
                              {new Date(purchase.purchasedAt).toLocaleDateString()}
                            </span>
                          </div>

                          <button
                            onClick={() => openViewer(note)}
                            className="w-full py-2.5 px-4 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-2 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                            <span>Read Protected Document</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: WISHLIST */}
        {activeTab === 'wishlist' && (
          <div>
            {myWishlistedNotes.length === 0 ? (
              <EmptyState
                icon={Bookmark}
                title="No saved notes"
                description="Save notes you are interested in by clicking the bookmark icon on any note card."
                actionLabel="Browse Marketplace"
                onAction={() => window.location.href = '/explore'}
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {myWishlistedNotes.map(note => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-6">
            <h3 className="text-lg font-bold text-navy-950">Student Profile Information</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-500 font-semibold mb-1">Full Name</label>
                <input 
                  type="text" 
                  value={user.name} 
                  disabled 
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800" 
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">College Email</label>
                <input 
                  type="text" 
                  value={user.email} 
                  disabled 
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800" 
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">College</label>
                <input 
                  type="text" 
                  value={user.college} 
                  disabled 
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800" 
                />
              </div>
              <div>
                <label className="block text-slate-500 font-semibold mb-1">University</label>
                <input 
                  type="text" 
                  value={user.university} 
                  disabled 
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-800" 
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-slate-900">Digital Watermark Licensing ID</strong>
                <span>All documents purchased through this account are dynamically watermarked with your identity ({user.name.toUpperCase()}) to satisfy academic fair-use guidelines.</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
