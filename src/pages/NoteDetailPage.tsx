import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, 
  FileText, 
  CheckCircle2, 
  ShieldCheck, 
  Eye, 
  Bookmark, 
  Share2, 
  User, 
  GraduationCap, 
  BookOpen, 
  Lock,
  ArrowRight,
  MessageSquare
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NoteDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { 
    notes, 
    reviews, 
    addReview, 
    isPurchased, 
    openCheckout, 
    openViewer, 
    toggleWishlist, 
    isWishlisted,
    showToast
  } = useApp();

  const note = notes.find(n => n.id === id);
  const purchased = note ? isPurchased(note.id) : false;
  const wishlisted = note ? isWishlisted(note.id) : false;

  // New review form
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!note) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <div>
          <h2 className="text-xl font-bold text-navy-950">Note Not Found</h2>
          <p className="text-sm text-slate-500 mt-1">This study note may have been unlisted or removed.</p>
          <Link to="/explore" className="mt-4 inline-block px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold">
            Back to Marketplace
          </Link>
        </div>
      </div>
    );
  }

  const noteReviews = reviews.filter(r => r.noteId === note.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addReview(note.id, newRating, newComment.trim());
    setNewComment('');
    setReviewSubmitted(true);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: note.title,
        text: `Check out ${note.title} on NoteX!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'success');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link to="/" className="hover:text-brand-600">Home</Link>
          <span>/</span>
          <Link to="/explore" className="hover:text-brand-600">Explore</Link>
          <span>/</span>
          <Link to={`/explore?branch=${note.branch}`} className="hover:text-brand-600">{note.branch}</Link>
          <span>/</span>
          <span className="text-slate-800 font-semibold truncate max-w-xs">{note.subject}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left Column (8 cols): Content, Modules, Syllabus, Preview */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Header Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-lg bg-brand-50 text-brand-700 text-xs font-bold">
                  {note.branch} • Semester {note.semester}
                </span>
                <span className="px-3 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold">
                  {note.subjectCode}
                </span>
                <span className="px-3 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  VTU 2021/2022 Scheme Verified
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-navy-950 font-display leading-tight">
                {note.title}
              </h1>

              <p className="text-sm text-slate-600 leading-relaxed">
                {note.description}
              </p>

              {/* Creator bar */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={note.creatorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}
                    alt={note.creatorName}
                    className="w-11 h-11 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-navy-950">{note.creatorName}</h3>
                    <p className="text-xs text-slate-500">{note.creatorCollege}</p>
                  </div>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-600">
                  <div>
                    <span className="block font-bold text-navy-950 text-sm flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      {note.rating.toFixed(1)}
                    </span>
                    <span className="text-[11px] text-slate-400">({note.reviewsCount} student reviews)</span>
                  </div>
                  <div className="border-l border-slate-200 pl-6">
                    <span className="block font-bold text-navy-950 text-sm">{note.pagesCount}</span>
                    <span className="text-[11px] text-slate-400">Total Pages</span>
                  </div>
                  <div className="border-l border-slate-200 pl-6">
                    <span className="block font-bold text-navy-950 text-sm">{note.salesCount}</span>
                    <span className="text-[11px] text-slate-400">Downloads</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Modules & Syllabus Breakdown */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-lg font-extrabold text-navy-950 font-display flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-600" />
                <span>Syllabus & Modules Covered</span>
              </h2>
              <div className="space-y-2.5 pt-2">
                {note.modules.map((mod, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-start gap-3 text-xs"
                  >
                    <span className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div>
                      <h4 className="font-bold text-slate-900">{mod}</h4>
                      <p className="text-slate-500 text-[11px] mt-0.5">Includes derivations, diagrams, and VTU questions.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sample Preview Carousel */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-extrabold text-navy-950 font-display flex items-center gap-2">
                    <Eye className="w-5 h-5 text-brand-600" />
                    <span>Sample Preview Pages</span>
                  </h2>
                  <p className="text-xs text-slate-500">Preview 3 pages before purchasing.</p>
                </div>
                <button
                  onClick={() => openViewer(note)}
                  className="px-3.5 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-bold text-slate-700 flex items-center gap-1.5"
                >
                  <Eye className="w-3.5 h-3.5 text-brand-600" />
                  Open Full Canvas Preview
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-2">
                {note.samplePreviewPages.map((preview, i) => (
                  <div
                    key={i}
                    onClick={() => openViewer(note)}
                    className="group relative aspect-[3/4] rounded-2xl overflow-hidden border border-slate-200 cursor-pointer bg-slate-100 shadow-sm"
                  >
                    <img 
                      src={preview} 
                      alt={`Preview page ${i + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                    />
                    <div className="absolute inset-0 bg-navy-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white p-2 text-center">
                      <Eye className="w-6 h-6 mb-1 text-white" />
                      <span className="text-xs font-bold">Inspect Sample</span>
                    </div>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-white text-[10px] font-semibold">
                      Sample {i + 1}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Student Reviews Section */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-extrabold text-navy-950 font-display flex items-center gap-2">
                  <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  <span>Student Reviews & Ratings</span>
                </h2>
                <span className="text-xs text-slate-500 font-semibold">
                  {noteReviews.length} Verified Reviews
                </span>
              </div>

              {/* Leave Review Form (If purchased) */}
              {purchased ? (
                <form onSubmit={handleReviewSubmit} className="p-4 rounded-2xl bg-brand-50/60 border border-brand-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-brand-900">
                      Rate this note (Verified Purchase)
                    </span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewRating(star)}
                          className="p-1"
                        >
                          <Star className={`w-4 h-4 ${star <= newRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={2}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share how this note helped your VTU exam or test preparation..."
                    className="w-full text-xs p-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-brand-600 text-white text-xs font-bold rounded-xl hover:bg-brand-700 transition-colors"
                  >
                    Post Review
                  </button>
                </form>
              ) : (
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Only verified students who have purchased this note can leave a review.</span>
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {noteReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50/60 border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-navy-950">{rev.buyerName}</span>
                        {rev.verifiedPurchase && (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                            Verified Buyer
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block">
                      Reviewed on {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>

            </div>

          </div>

          {/* Right Column (4 cols): Sticky Purchase Card */}
          <div className="lg:col-span-4">
            <div className="sticky top-28 bg-white rounded-3xl p-6 border border-slate-200 shadow-elevated space-y-6">
              
              {/* Price & Guarantee */}
              <div>
                <span className="text-xs text-slate-500 uppercase font-semibold block">Selling Price</span>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="text-3xl font-black text-navy-950 font-display">₹{note.price}</span>
                  <span className="text-xs text-slate-400 line-through">₹{note.price + 50}</span>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                    Student Discount
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                {purchased ? (
                  <button
                    onClick={() => openViewer(note)}
                    className="w-full py-4 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Open Note in Protected Viewer</span>
                  </button>
                ) : (
                  <button
                    onClick={() => openCheckout(note)}
                    className="w-full py-4 px-4 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Instant Purchase (₹{note.price})</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}

                <button
                  onClick={() => openViewer(note)}
                  className="w-full py-3 px-4 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                >
                  <Eye className="w-4 h-4 text-slate-400" />
                  <span>Preview First 3 Pages</span>
                </button>
              </div>

              {/* Wishlist & Share row */}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  onClick={() => toggleWishlist(note.id)}
                  className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                    wishlisted 
                      ? 'border-rose-300 bg-rose-50 text-rose-600' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Bookmark className={`w-3.5 h-3.5 ${wishlisted ? 'fill-current' : ''}`} />
                  <span>{wishlisted ? 'Saved' : 'Save'}</span>
                </button>

                <button
                  onClick={handleShare}
                  className="py-2 px-3 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>
              </div>

              {/* Security & Transparent Details */}
              <div className="space-y-3 pt-2 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Personalized watermarking protects copyright</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-brand-600 shrink-0" />
                  <span>Lifetime access in your NoteX library</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-purple-600 shrink-0" />
                  <span>100% Mock Payment checkout for testing</span>
                </div>
              </div>

              {/* Transparent Commission Note */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-[11px] text-slate-500 space-y-1">
                <div className="flex justify-between font-semibold text-slate-700">
                  <span>Creator Receives:</span>
                  <span className="text-emerald-700">₹{Math.max(0, note.price - 10)}</span>
                </div>
                <div className="flex justify-between">
                  <span>NoteX proposed commission:</span>
                  <span>₹10 (Infrastructure)</span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
