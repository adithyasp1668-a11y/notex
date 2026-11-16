import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, BookOpen, Heart, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-navy-950 text-slate-400 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-accent-purple text-white font-extrabold text-lg">
                NX
              </div>
              <span className="text-2xl font-extrabold tracking-tight text-white font-display">
                Note<span className="text-brand-500">X</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              India's premier student-to-student academic notes marketplace. 
              Upload your original university notes, set your price, and earn on every purchase.
            </p>
            <div className="flex items-center gap-2 pt-1 text-xs text-slate-400">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Anti-Piracy Watermarking
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-medium">
                Flat ₹10 Platform Fee
              </span>
            </div>
          </div>

          {/* VTU Branches */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Engineering Branches</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore?branch=CSE" className="hover:text-white transition-colors">Computer Science (CSE)</Link></li>
              <li><Link to="/explore?branch=ISE" className="hover:text-white transition-colors">Information Science (ISE)</Link></li>
              <li><Link to="/explore?branch=ECE" className="hover:text-white transition-colors">Electronics & Comm. (ECE)</Link></li>
              <li><Link to="/explore?branch=EEE" className="hover:text-white transition-colors">Electrical & Electronics (EEE)</Link></li>
              <li><Link to="/explore?branch=Mechanical" className="hover:text-white transition-colors">Mechanical Engineering</Link></li>
              <li><Link to="/explore?branch=AI%20%26%20DS" className="hover:text-white transition-colors">Artificial Intelligence & DS</Link></li>
            </ul>
          </div>

          {/* Platform */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Platform & Explore</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/explore" className="hover:text-white transition-colors">Browse All Notes</Link></li>
              <li><Link to="/creator" className="hover:text-white transition-colors">Creator Studio & Upload</Link></li>
              <li><Link to="/how-it-works" className="hover:text-white transition-colors">How NoteX Works</Link></li>
              <li><Link to="/library" className="hover:text-white transition-colors">Buyer Library</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Admin Moderation</Link></li>
              <li><Link to="/about" className="hover:text-white transition-colors">About NoteX</Link></li>
            </ul>
          </div>

          {/* Legal & Trust */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Legal & Transparency</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/copyright-policy" className="hover:text-white transition-colors">Copyright & DMCA Policy</Link></li>
              <li><Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link to="/pricing-model" className="hover:text-white transition-colors">₹10 Commission Breakdown</Link></li>
              <li><Link to="/faq" className="hover:text-white transition-colors">Student FAQ</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">Support & Contact</Link></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} NoteX India. Built for students, powered by peer creators. All original creator copyrights reserved.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              Initial Launch: Visvesvaraya Technological University (VTU)
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
