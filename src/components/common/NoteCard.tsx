import React from 'react';
import { Link } from 'react-router-dom';
import { Star, FileText, CheckCircle2, Bookmark, Eye, ArrowRight, ShieldAlert } from 'lucide-react';
import { NoteItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface NoteCardProps {
  note: NoteItem;
  onPreview?: (note: NoteItem) => void;
  onBuy?: (note: NoteItem) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ note, onPreview, onBuy }) => {
  const { isWishlisted, toggleWishlist, isPurchased, openCheckout, openViewer } = useApp();
  const purchased = isPurchased(note.id);
  const wishlisted = isWishlisted(note.id);

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-brand-200 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Cover Image & Badges */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img 
          src={note.coverImage} 
          alt={note.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-black/20" />

        {/* Branch & Semester badge */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 flex-wrap">
          <span className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-navy-900/90 text-white backdrop-blur-md shadow-sm border border-white/10">
            {note.branch} • Sem {note.semester}
          </span>
          {note.status === 'PENDING_REVIEW' && (
            <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-amber-500 text-white shadow-sm flex items-center gap-1">
              <ShieldAlert className="w-3 h-3" /> Under Review
            </span>
          )}
        </div>

        {/* Wishlist toggle */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(note.id);
          }}
          className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all shadow-sm ${
            wishlisted 
              ? 'bg-rose-500 text-white' 
              : 'bg-white/80 text-slate-700 hover:bg-white hover:text-rose-500'
          }`}
          title={wishlisted ? 'Remove from wishlist' : 'Save note to wishlist'}
        >
          <Bookmark className={`w-4 h-4 ${wishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Bottom meta over image */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
          <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm">
            <FileText className="w-3.5 h-3.5 text-brand-300" />
            <span>{note.pagesCount} Pages</span>
          </div>
          <div className="flex items-center gap-1 bg-black/40 px-2.5 py-1 rounded-md backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span className="font-bold">{note.rating.toFixed(1)}</span>
            <span className="text-white/70 text-[10px]">({note.reviewsCount})</span>
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        
        <div>
          {/* Subject & Code */}
          <div className="flex items-center justify-between text-xs text-brand-700 font-semibold mb-1">
            <span>{note.subject}</span>
            <span className="text-slate-600 font-normal">{note.subjectCode}</span>
          </div>

          {/* Title */}
          <Link 
            to={`/notes/${note.id}`}
            className="block group/title text-slate-900 font-bold text-base leading-snug line-clamp-2 hover:text-brand-600 transition-colors"
          >
            {note.title}
          </Link>

          {/* College & University */}
          <p className="mt-1.5 text-xs text-slate-600 line-clamp-1 flex items-center gap-1">
            <span>{note.college}</span>
          </p>
        </div>

        {/* Creator Info */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img 
              src={note.creatorAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100'} 
              alt={note.creatorName}
              className="w-7 h-7 rounded-full object-cover border border-slate-200"
            />
            <div className="text-left">
              <span className="block text-xs font-semibold text-slate-800 leading-tight">
                {note.creatorName}
              </span>
              <span className="block text-[10px] text-emerald-600 font-medium">Verified Student</span>
            </div>
          </div>
          
          <div className="text-right">
            <span className="text-[10px] text-slate-600 uppercase font-semibold block leading-none">Price</span>
            <span className="text-lg font-black text-navy-950 font-display">₹{note.price}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <button
            onClick={() => onPreview ? onPreview(note) : openViewer(note)}
            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            Preview
          </button>

          {purchased ? (
            <button
              onClick={() => openViewer(note)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 text-xs font-bold transition-colors"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Read Note
            </button>
          ) : (
            <button
              onClick={() => onBuy ? onBuy(note) : openCheckout(note)}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-brand-600 text-white hover:bg-brand-700 text-xs font-bold shadow-sm shadow-brand-500/20 transition-colors"
            >
              <span>Get for ₹{note.price}</span>
            </button>
          )}
        </div>

      </div>

    </div>
  );
};
