import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  CreditCard, 
  Smartphone, 
  Sparkles, 
  ArrowRight,
  Info,
  Loader2
} from 'lucide-react';
import { NoteItem } from '../../types';
import { useApp } from '../../context/AppContext';

interface CheckoutModalProps {
  note: NoteItem;
  onClose: () => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ note, onClose }) => {
  const { processPayment, user } = useApp();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card'>('upi');

  const platformCommission = 10;
  const creatorGross = Math.max(0, note.price - platformCommission);

  const handleSimulate = async (success: boolean) => {
    setLoading(true);
    await processPayment(success);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-navy-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full border border-slate-200 shadow-2xl overflow-hidden relative">
        
        {/* Banner Alert indicating Mock Mode as required by Prompt */}
        <div className="bg-amber-50 border-b border-amber-200/80 px-5 py-2.5 flex items-center justify-between text-xs text-amber-900">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-600 shrink-0" />
            <span className="font-semibold">
              MOCK PAYMENT MODE • TEST TRANSACTIONS ONLY
            </span>
          </div>
          <span className="text-[10px] font-mono bg-amber-200/60 px-2 py-0.5 rounded text-amber-950">
            Zero-Cost Architecture
          </span>
        </div>

        {/* Modal Header */}
        <div className="p-6 pb-4 flex items-start justify-between border-b border-slate-100">
          <div>
            <span className="text-[11px] font-bold text-brand-600 uppercase tracking-wider">
              Secure Checkout
            </span>
            <h2 className="text-xl font-extrabold text-navy-950 font-display mt-0.5">
              Confirm Note Purchase
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Note Summary Card */}
        <div className="p-6 space-y-6">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex gap-4">
            <img 
              src={note.coverImage} 
              alt={note.title}
              className="w-20 h-20 rounded-xl object-cover shrink-0 border border-slate-200" 
            />
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-100 text-brand-700">
                {note.branch} Sem {note.semester}
              </span>
              <h3 className="text-sm font-bold text-navy-950 line-clamp-2 mt-1">
                {note.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                By {note.creatorName} • {note.pagesCount} Pages
              </p>
            </div>
          </div>

          {/* Transparent Commission & Pricing Breakdown (Prompt Section 11 & 12) */}
          <div className="space-y-3 rounded-2xl bg-slate-50/60 p-4 border border-slate-200/80 text-xs">
            <div className="font-bold text-slate-700 uppercase tracking-wider text-[11px]">
              NoteX Pricing Transparency
            </div>
            
            <div className="flex justify-between text-slate-600">
              <span>Creator Note Selling Price</span>
              <span className="font-semibold text-slate-900">₹{note.price}.00</span>
            </div>

            <div className="flex justify-between text-slate-600">
              <span className="flex items-center gap-1">
                NoteX Proposed Platform Fee
                <span className="text-[10px] text-slate-400">(Hosting & Watermarking)</span>
              </span>
              <span className="font-semibold text-brand-600">₹{platformCommission}.00</span>
            </div>

            <div className="flex justify-between text-emerald-700 font-medium">
              <span>Student Creator Gross Share</span>
              <span className="font-bold">₹{creatorGross}.00</span>
            </div>

            <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-extrabold text-navy-950">
              <span>Total Payable by Buyer</span>
              <span className="text-base text-brand-600 font-display">₹{note.price}.00</span>
            </div>
          </div>

          {/* Simulated Payment Methods */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
              Simulated Gateway Channel
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('upi')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <Smartphone className="w-4 h-4 text-brand-600" />
                <span>Simulated UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('card')}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all ${
                  paymentMethod === 'card'
                    ? 'border-brand-600 bg-brand-50 text-brand-700 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <CreditCard className="w-4 h-4 text-purple-600" />
                <span>Simulated Card / NetBanking</span>
              </button>
            </div>
          </div>

          {/* Test Action Buttons */}
          <div className="space-y-2 pt-2">
            <button
              disabled={loading}
              onClick={() => handleSimulate(true)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white font-bold text-sm hover:opacity-95 shadow-md shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing Mock Checkout...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simulate Successful Payment (₹{note.price})</span>
                </>
              )}
            </button>

            <button
              disabled={loading}
              onClick={() => handleSimulate(false)}
              className="w-full py-2.5 px-4 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 font-semibold text-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <AlertCircle className="w-4 h-4" />
              <span>Simulate Failed Payment (Test Error Handling)</span>
            </button>
          </div>

          {/* Security footnote */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-slate-600 text-center">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Licensed to {user.name} • Instant Library Access upon simulation</span>
          </div>

        </div>

      </div>
    </div>
  );
};
