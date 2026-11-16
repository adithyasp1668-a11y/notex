import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, BookOpen, Coins, ArrowRight, Heart, HelpCircle, Mail, FileText, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50/50 py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
      <div>
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">About NoteX</span>
        <h1 className="text-3xl font-black text-navy-950 font-display mt-1">Empowering Student Knowledge & Academic Independence</h1>
      </div>
      <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
        <p>
          NoteX was founded on a simple insight: every semester, thousands of diligent college students create remarkable, high-yield study summaries, solved numerical booklets, and handwritten diagrams. Yet, when exams conclude, this valuable effort remains locked in physical notebooks or forgotten folders.
        </p>
        <p>
          At the same time, peer students struggle with disjointed textbooks, outdated lecture slides, and unverified internet notes. NoteX bridges this gap by creating India's premier student-to-student educational notes marketplace.
        </p>
        <h3 className="text-lg font-bold text-navy-950 pt-4">Our Core Philosophy</h3>
        <ul className="space-y-2 list-disc pl-5">
          <li><strong>Fair Creator Compensation:</strong> We believe student effort deserves real rewards. Creators set their own prices and keep the gross share after a minimal ₹10 platform fee.</li>
          <li><strong>Zero Cost Barrier:</strong> Built by student entrepreneurs for students, operating with zero upfront cost and free-tier infrastructure.</li>
          <li><strong>Copyright & Piracy Deterrence:</strong> Dynamic forensic watermarking stamps every page with the buyer's identity to prevent unauthorized redistribution.</li>
        </ul>
      </div>
      <div className="pt-6 border-t border-slate-200">
        <Link to="/explore" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700 transition-colors">
          Explore Notes Marketplace <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  </div>
);

export const HowItWorksPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50/50 py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
      <div>
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Workflow Guide</span>
        <h1 className="text-3xl font-black text-navy-950 font-display mt-1">How NoteX Works for Buyers and Creators</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="p-6 rounded-2xl bg-brand-50/50 border border-brand-100 space-y-3">
          <span className="px-2.5 py-1 rounded bg-brand-600 text-white font-bold text-xs">For Students & Buyers</span>
          <h3 className="text-base font-bold text-navy-950">1. Discover & Preview</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Search by University (VTU), College, Branch (CSE, ISE, ECE, EEE, Mech), and Semester. Inspect free 3-page samples before purchasing.
          </p>
          <h3 className="text-base font-bold text-navy-950">2. Instant Unlock</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Simulate payment via UPI/Card in our test checkout. Notes are instantly unlocked in your personal library.
          </p>
          <h3 className="text-base font-bold text-navy-950">3. Protected Canvas Reader</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Read from any device in our custom high-resolution document viewer with personalized watermarking.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-purple-50/50 border border-purple-100 space-y-3">
          <span className="px-2.5 py-1 rounded bg-purple-600 text-white font-bold text-xs">For Student Creators</span>
          <h3 className="text-base font-bold text-navy-950">1. Upload Original Notes</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Upload your handwritten or typed PDF note. Select your syllabus, subject code, and specify module coverage.
          </p>
          <h3 className="text-base font-bold text-navy-950">2. Set Your Selling Price</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Choose your selling price (e.g., ₹39, ₹49, ₹89). You retain every rupee above our fixed ₹10 platform hosting fee.
          </p>
          <h3 className="text-base font-bold text-navy-950">3. Instant UPI Payouts</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Track daily sales in your Creator Studio and request instant payouts directly to your UPI ID (GPay, PhonePe, Paytm).
          </p>
        </div>
      </div>
    </div>
  </div>
);

export const PricingModelPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50/50 py-16">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Transparent Business Model</span>
      <h1 className="text-3xl font-black text-navy-950 font-display">The NoteX ₹10 Commission Model</h1>
      <p className="text-sm text-slate-600 leading-relaxed">
        Unlike traditional educational marketplaces that take 30% to 50% cuts from content creators, NoteX charges a flat proposed ₹10 platform fee per successful transaction.
      </p>

      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3 text-xs">
        <h4 className="font-bold text-navy-950 text-sm">Real Example Breakdown:</h4>
        <div className="flex justify-between py-1 border-b border-slate-200">
          <span>Student Selling Price:</span>
          <span className="font-bold text-slate-900">₹49.00</span>
        </div>
        <div className="flex justify-between py-1 border-b border-slate-200 text-brand-600 font-semibold">
          <span>NoteX Platform Fee (Bandwidth, Storage, Dynamic Watermarking):</span>
          <span>- ₹10.00</span>
        </div>
        <div className="flex justify-between py-2 text-emerald-700 font-bold text-sm">
          <span>Creator Net Earnings per Sale:</span>
          <span>₹39.00 (80% of price!)</span>
        </div>
      </div>
    </div>
  </div>
);

export const FAQPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50/50 py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
      <div>
        <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Help & Answers</span>
        <h1 className="text-3xl font-black text-navy-950 font-display mt-1">Frequently Asked Questions</h1>
      </div>

      <div className="space-y-4">
        {[
          { q: "Is NoteX currently in test mode?", a: "Yes, this version is configured with a complete zero-cost Mock Payment system allowing students to test purchasing, watermarked reading, and creator earnings without real bank transactions." },
          { q: "Can I sell notes from other universities?", a: "While our initial launch is focused on Visvesvaraya Technological University (VTU) and Indian engineering branches, students from any university can register and submit their original study notes." },
          { q: "How are copyright violations handled?", a: "We enforce a zero-tolerance policy against pirated textbooks or commercial material. Uploaders must certify original ownership, and notes go through administrative moderation." },
          { q: "Can I download the PDF directly?", a: "To safeguard student creators against bulk redistribution in xerox shops, notes are protected inside our custom dynamic canvas reader with user-specific watermarks." }
        ].map((item, idx) => (
          <div key={idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="text-sm font-bold text-navy-950">{item.q}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{item.a}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
);

export const CopyrightPolicyPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50/50 py-16">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6 text-sm text-slate-600 leading-relaxed">
      <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Legal Compliance</span>
      <h1 className="text-3xl font-black text-navy-950 font-display">Copyright & Content Policy</h1>
      
      <p>
        NoteX is committed to respecting the intellectual property rights of others and requires its creators to do the same. All content uploaded to NoteX must be original academic study summaries created by the uploader.
      </p>

      <h3 className="text-base font-bold text-navy-950 pt-2">Prohibited Content:</h3>
      <ul className="list-disc pl-5 space-y-1 text-xs">
        <li>Direct scans or unauthorized copies of published textbooks or commercial study guides.</li>
        <li>Copyrighted examination questions without transformative explanations.</li>
        <li>Plagiarized notes from third-party websites or services.</li>
      </ul>

      <h3 className="text-base font-bold text-navy-950 pt-2">Takedown Requests:</h3>
      <p className="text-xs">
        If you believe your copyrighted work has been improperly shared on NoteX, contact our compliance team at <code>dmca@notex.edu.in</code> with the note URL and proof of ownership. Takedowns are processed within 24 hours.
      </p>
    </div>
  </div>
);

export const ContactPage: React.FC = () => (
  <div className="min-h-screen bg-slate-50/50 py-16">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-6">
      <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Get In Touch</span>
      <h1 className="text-3xl font-black text-navy-950 font-display">Contact NoteX Support</h1>
      <p className="text-sm text-slate-600">
        Have questions about college notes, creator payouts, or partnership opportunities? Reach out to our student developer team.
      </p>

      <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
        <div className="flex items-center gap-3">
          <Mail className="w-5 h-5 text-brand-600" />
          <div>
            <strong className="block text-slate-900">Email Inquiries</strong>
            <span className="text-slate-500">support@notex.edu.in</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-purple-600" />
          <div>
            <strong className="block text-slate-900">Campus Ambassador Program</strong>
            <span className="text-slate-500">campus@notex.edu.in (VTU Affiliated Colleges)</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
