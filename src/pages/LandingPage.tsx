import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  BookOpen, 
  TrendingUp, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  ChevronRight, 
  Lock, 
  Coins, 
  FileText,
  Star,
  Zap,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoteCard } from '../components/common/NoteCard';
import { INITIAL_FEATURED_CREATORS, COLLEGES, BRANCHES } from '../data/mockData';

export const LandingPage: React.FC = () => {
  const { notes, openCheckout, openViewer } = useApp();
  const navigate = useNavigate();

  // Search input state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranch, setSelectedBranch] = useState<string>('All');

  // Interactive Earnings Calculator
  const [calcNotes, setCalcNotes] = useState(5);
  const [calcPrice, setCalcPrice] = useState(49);
  const [calcExpectedSales, setCalcExpectedSales] = useState(50);
  
  // NoteX proposed flat commission: ₹10
  const creatorPerSale = Math.max(0, calcPrice - 10);
  const totalPotentialEarnings = calcNotes * calcExpectedSales * creatorPerSale;
  const platformFeeTotal = calcNotes * calcExpectedSales * 10;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(`/explore?search=${encodeURIComponent(searchQuery)}${selectedBranch !== 'All' ? `&branch=${selectedBranch}` : ''}`);
  };

  const approvedNotes = notes.filter(n => n.status === 'APPROVED');
  const trendingNotes = approvedNotes.slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FCFCFD]">
      
      {/* ------------------------------------------------------------- */}
      {/* 1. HERO SECTION (Inspired by Studio.Design editorial layout)   */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden hero-grid-pattern border-b border-slate-200/80">
        
        {/* Soft background ambient gradient glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 left-10 w-96 h-96 bg-accent-purple/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Bold Typography & CTAs */}
            <div className="lg:col-span-7 space-y-6 text-left">
              
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 text-white text-xs font-semibold tracking-wide shadow-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>VTU 2021 & 2022 Scheme Semester Notes Live</span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-950 tracking-tight leading-[1.08] font-display">
                Your Notes.<br />
                Your Knowledge.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-indigo-600 to-accent-purple">
                  Your Earnings.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl font-normal leading-relaxed">
                Discover quality study notes created by students from colleges across India. 
                Share your knowledge, help others learn and earn from your academic effort.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/explore"
                  className="px-7 py-4 rounded-2xl bg-navy-950 text-white font-bold text-sm hover:bg-brand-600 shadow-xl shadow-navy-950/10 flex items-center gap-2.5 transition-all group"
                >
                  <span>Explore Notes</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/creator"
                  className="px-7 py-4 rounded-2xl bg-white border border-slate-300 text-slate-800 font-bold text-sm hover:border-brand-500 hover:text-brand-600 shadow-sm flex items-center gap-2 transition-all"
                >
                  <span>Become a Creator (Earn ₹)</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>Dynamic Watermarking Protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" />
                  <span>Flat ₹10 Platform Commission</span>
                </div>
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-brand-600" />
                  <span>Instant UPI Settlement</span>
                </div>
              </div>

            </div>

            {/* Right Column: Dynamic Editorial Staircase / Cascade Grid (Inspired by Studio.Design) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                
                {/* Cascading Cards layout */}
                <div className="space-y-4">
                  
                  {/* Top floating showcase card */}
                  <div className="p-4 bg-white/95 rounded-2xl border border-slate-200 shadow-elevated hover:shadow-2xl transition-all duration-300 transform -rotate-1 hover:rotate-0">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-md">
                        VTU CSE • Sem 5
                      </span>
                      <span className="font-extrabold text-navy-950 font-display text-sm">
                        ₹49
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      Computer Networks (21CS52) - Comprehensive VTU Notes
                    </h4>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Curated by Ananya S. (RVCE)</span>
                      <span className="flex items-center gap-1 font-semibold text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-current" /> 4.9 (142 reviews)
                      </span>
                    </div>
                  </div>

                  {/* Middle showcase card */}
                  <div className="p-4 bg-white/95 rounded-2xl border border-slate-200 shadow-elevated hover:shadow-2xl transition-all duration-300 transform translate-x-4 rotate-1 hover:rotate-0">
                    <div className="flex items-center justify-between text-xs mb-2">
                      <span className="font-bold text-purple-700 bg-purple-50 px-2.5 py-1 rounded-md">
                        VTU ISE • Sem 5
                      </span>
                      <span className="font-extrabold text-navy-950 font-display text-sm">
                        ₹39
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-900 text-sm leading-snug">
                      Database Management Systems (21CS53) - SQL & BCNF
                    </h4>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>Karthik Rao (BMSCE)</span>
                      <span className="text-emerald-600 font-semibold">₹10 Comm • ₹29 Creator Earns</span>
                    </div>
                  </div>

                  {/* Bottom showcase card */}
                  <div className="p-4 bg-navy-950 text-white rounded-2xl shadow-elevated hover:shadow-2xl transition-all duration-300 transform -translate-x-2">
                    <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                      <span>Protected Canvas Viewer Preview</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold text-[10px]">
                        Anti-Redistribution
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-300">
                      LICENSED TO: RAHUL KUMAR [NTX-90124]
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs">
                      <span className="text-slate-400">Zero cloud subscription barrier</span>
                      <span className="text-brand-400 font-bold">100% Free Tier Ready</span>
                    </div>
                  </div>

                </div>

              </div>
            </div>

          </div>

          {/* ------------------------------------------------------------- */}
          {/* 2. SEARCH BAR SECTION                                         */}
          {/* ------------------------------------------------------------- */}
          <div className="mt-14 max-w-4xl mx-auto">
            <form 
              onSubmit={handleSearchSubmit}
              className="p-2 sm:p-2.5 rounded-2xl bg-white border border-slate-300/80 shadow-elevated flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-3 w-full">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search subject (e.g. Computer Networks, DBMS, 21CS52, OS)..."
                  className="w-full bg-transparent border-none focus:outline-none text-sm text-navy-950 placeholder-slate-400 py-2"
                />
              </div>

              {/* Branch quick filter dropdown */}
              <div className="w-full sm:w-auto flex items-center gap-2">
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-2.5 focus:outline-none"
                >
                  <option value="All">All Branches</option>
                  {BRANCHES.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors whitespace-nowrap"
                >
                  Search Notes
                </button>
              </div>
            </form>

            {/* Quick chips */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600">
              <span className="font-semibold text-slate-600">Popular:</span>
              {['21CS52 Networks', '21CS53 DBMS', '21CS44 OS', '21EC52 DSP', '21ME33 Thermo'].map(chip => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setSearchQuery(chip);
                    navigate(`/explore?search=${encodeURIComponent(chip)}`);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 3. POPULAR UNIVERSITIES & COLLEGES                            */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Academic Network
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display mt-1">
              Popular Engineering Colleges & Universities
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Browse top-rated handwritten notes and exam revision material categorized by college syllabus.
            </p>
          </div>

          {/* Colleges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {COLLEGES.slice(0, 6).map((college) => (
              <Link
                key={college.id}
                to={`/explore?college=${encodeURIComponent(college.name)}`}
                className="p-4 rounded-2xl border border-slate-200 hover:border-brand-400 hover:shadow-md transition-all text-center group bg-slate-50/50 hover:bg-white"
              >
                <div className="w-10 h-10 mx-auto rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center font-bold text-xs mb-3 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <h4 className="text-xs font-bold text-navy-900 group-hover:text-brand-600 line-clamp-2">
                  {college.name.split(',')[0]}
                </h4>
                <p className="text-[10px] text-slate-600 mt-1">VTU Affiliated</p>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. BROWSE BY BRANCH & SEMESTER                                */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                Structured Categorization
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display mt-1">
                Browse by Engineering Branch
              </h2>
            </div>
            <Link
              to="/explore"
              className="text-sm font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1.5"
            >
              <span>View All Branches</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {BRANCHES.map(branch => (
              <Link
                key={branch}
                to={`/explore?branch=${encodeURIComponent(branch)}`}
                className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-brand-500 hover:shadow-md transition-all text-center group"
              >
                <div className="text-lg font-black text-navy-950 group-hover:text-brand-600 font-display">
                  {branch}
                </div>
                <div className="text-xs text-slate-600 mt-1">
                  Sem 3 to 8
                </div>
                <div className="mt-3 text-[11px] font-semibold text-brand-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  Browse Notes →
                </div>
              </Link>
            ))}
          </div>

          {/* Semesters row */}
          <div className="mt-8 p-4 rounded-2xl bg-white border border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
              Quick Semester Filter:
            </span>
            <div className="flex flex-wrap gap-2">
              {[3, 4, 5, 6, 7, 8].map(sem => (
                <Link
                  key={sem}
                  to={`/explore?semester=${sem}`}
                  className="px-3 py-1.5 rounded-xl border border-slate-200 hover:border-brand-500 text-xs font-bold text-slate-700 hover:text-brand-600 hover:bg-brand-50 transition-colors"
                >
                  Sem {sem}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. TRENDING NOTES SHOWCASE                                     */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
            <div>
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                High-Yield VTU Exam Material
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display mt-1">
                Trending Academic Notes
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Highest rated notes with solved previous year questions and module summaries.
              </p>
            </div>
            <Link
              to="/explore"
              className="px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-bold text-xs hover:border-brand-600 hover:text-brand-600 transition-colors"
            >
              Browse All ({notes.length})
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trendingNotes.map(note => (
              <NoteCard
                key={note.id}
                note={note}
                onPreview={() => openViewer(note)}
                onBuy={() => openCheckout(note)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. BEST-RATED STUDENT CREATORS                                */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-slate-50/60 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-purple-600 uppercase tracking-wider">
              Top Academic Mentors
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display mt-1">
              Best-Rated Student Creators
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Toppers and academic contributors earning monthly income from their handwritten course summaries.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {INITIAL_FEATURED_CREATORS.map(creator => (
              <div 
                key={creator.id}
                className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-lg transition-all flex flex-col items-center text-center"
              >
                <div className="relative mb-4">
                  <img 
                    src={creator.avatar} 
                    alt={creator.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-brand-500 shadow-md"
                  />
                  <div className="absolute -bottom-1 -right-1 px-1.5 py-0.5 rounded-full bg-emerald-500 text-white text-[9px] font-bold">
                    ★ {creator.rating}
                  </div>
                </div>

                <h3 className="text-base font-bold text-navy-950">{creator.name}</h3>
                <p className="text-xs text-brand-600 font-semibold">{creator.year}</p>
                <p className="text-xs text-slate-600 mt-1 line-clamp-1">{creator.college}</p>

                <div className="my-4 py-3 px-4 w-full rounded-xl bg-slate-50 border border-slate-100 grid grid-cols-2 gap-2 text-center">
                  <div>
                    <span className="text-[10px] text-slate-600 uppercase font-semibold block">Notes</span>
                    <span className="text-sm font-extrabold text-navy-900">{creator.notesCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-600 uppercase font-semibold block">Earnings</span>
                    <span className="text-sm font-extrabold text-emerald-600">₹{creator.earnings.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 italic line-clamp-2">
                  Specialty: {creator.specialty}
                </p>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. HOW NOTEX WORKS (3-Step Model)                             */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Transparent & Simple
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display mt-1">
              How NoteX Works
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              A fair student ecosystem that empowers note creators and provides affordable access to peers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-navy-950">Upload & Set Your Price</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Creators upload original handwritten or typed notes for their college syllabus. You choose your price (e.g. ₹39, ₹49, ₹89).
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">✓ Upload PDF file</li>
                <li className="flex items-center gap-1.5">✓ Specify University, Sem & Subject</li>
                <li className="flex items-center gap-1.5">✓ Set your own selling price</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-purple text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-navy-950">Watermark Protection</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                NoteX automatically protects every note with dynamic personalized forensic watermarking containing the buyer's ID to prevent piracy.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">✓ Built-in browser protected viewer</li>
                <li className="flex items-center gap-1.5">✓ Personalized diagonal license stamps</li>
                <li className="flex items-center gap-1.5">✓ No exposed direct PDF URLs</li>
              </ul>
            </div>

            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-200 text-left space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-extrabold text-lg shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-navy-950">Earn With Flat ₹10 Platform Fee</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                NoteX takes only a proposed ₹10 commission per sale. All remaining earnings belong to you and can be withdrawn directly via UPI.
              </p>
              <ul className="text-xs text-slate-600 space-y-1.5 pt-2">
                <li className="flex items-center gap-1.5">✓ Sell at ₹49 → You earn ₹39</li>
                <li className="flex items-center gap-1.5">✓ Real-time ledger balance</li>
                <li className="flex items-center gap-1.5">✓ Instant UPI payout requests</li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. INTERACTIVE STUDENT EARNINGS CALCULATOR                      */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-gradient-to-br from-navy-900 to-navy-950 text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-400 uppercase tracking-wider">
              Student Entrepreneurship
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-display mt-1">
              Calculate Your Potential Earnings
            </h2>
            <p className="text-slate-300 text-sm mt-2">
              See how much you can earn this semester by sharing your handwritten notes with peers.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-3xl p-6 sm:p-10 border border-white/15 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Sliders */}
            <div className="lg:col-span-7 space-y-6">
              
              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span>Number of Subject Notes Uploaded</span>
                  <span className="text-brand-400 font-mono text-base">{calcNotes} Notes</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="15"
                  value={calcNotes}
                  onChange={(e) => setCalcNotes(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span>Price Per Note</span>
                  <span className="text-brand-400 font-mono text-base">₹{calcPrice}</span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="149"
                  step="5"
                  value={calcPrice}
                  onChange={(e) => setCalcPrice(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2 font-semibold">
                  <span>Expected Student Buyers per Note</span>
                  <span className="text-brand-400 font-mono text-base">{calcExpectedSales} Students</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="200"
                  step="5"
                  value={calcExpectedSales}
                  onChange={(e) => setCalcExpectedSales(Number(e.target.value))}
                  className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
              </div>

              <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>NoteX proposed platform commission:</span>
                  <span className="font-semibold text-slate-300">₹10 per sale (₹{platformFeeTotal.toLocaleString()} total)</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-semibold">
                  <span>Creator share per purchase:</span>
                  <span>₹{creatorPerSale} / copy</span>
                </div>
              </div>

            </div>

            {/* Results Display */}
            <div className="lg:col-span-5 p-8 rounded-2xl bg-white text-navy-950 text-center space-y-4 shadow-2xl">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                Estimated Net Student Earnings
              </span>
              <div className="text-4xl sm:text-5xl font-black text-brand-600 font-display">
                ₹{totalPotentialEarnings.toLocaleString()}
              </div>
              <p className="text-xs text-slate-500">
                Direct to your UPI wallet. No subscription charges. Zero upfront investment.
              </p>
              <Link
                to="/creator"
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl bg-navy-950 hover:bg-brand-600 text-white font-bold text-sm transition-all shadow-md"
              >
                <span>Start Selling Notes Today</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. STUDENT TESTIMONIALS (Clearly marked as sample)             */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
              Sample Student Experiences
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display mt-3">
              Loved by VTU Students Across Semesters
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "Cleared Computer Networks in 5th Sem with 86 marks thanks to Ananya's notes. The Dijkstra routing step-by-step example came directly in the VTU question paper."
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-xs">
                <strong className="block text-slate-900">Nikhil Verma</strong>
                <span className="text-slate-500">BMS College of Engineering (BMSCE)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "I earned ₹14,000 last month just by uploading my 4th and 5th Sem DBMS and OS handwritten notes. The ₹10 commission model is totally fair."
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-xs">
                <strong className="block text-slate-900">Karthik Rao (Creator)</strong>
                <span className="text-slate-500">RV College of Engineering (RVCE)</span>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-sm text-slate-700 italic leading-relaxed">
                "Watermarking gave me confidence to share my notes without fear of someone printing and re-selling them in local xerox shops."
              </p>
              <div className="pt-2 border-t border-slate-200/80 text-xs">
                <strong className="block text-slate-900">Priya Hegde (Creator)</strong>
                <span className="text-slate-500">MS Ramaiah Institute of Tech (MSRIT)</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 10. STUDENT FAQ SECTION                                       */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 bg-slate-50/70">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-12">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-950 font-display mt-1">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-base font-bold text-navy-950">
                Can I both buy notes and sell my own notes from the same account?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Yes! NoteX allows any registered student to explore and purchase notes, as well as upload their original notes and earn money from a single account without separate registrations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-base font-bold text-navy-950">
                How does the ₹10 platform commission work?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                NoteX charges a flat proposed ₹10 commission per successful note purchase to cover cloud bandwidth, forensic watermarking, and server maintenance. If you price your note at ₹49, you receive ₹39 directly in your creator wallet.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-base font-bold text-navy-950">
                How does dynamic watermarking protect my notes from piracy?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                When a student reads your notes on NoteX, our custom Canvas PDF viewer dynamically prints the buyer's full name, email, and unique purchase transaction reference diagonally across every page. This strongly discourages unauthorized re-sharing.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h3 className="text-base font-bold text-navy-950">
                Is NoteX free to start for creators?
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                100% free! We believe in zero upfront costs for student entrepreneurs. There are no registration fees, listing charges, or recurring subscriptions.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 11. BOTTOM CTA BANNER                                         */}
      {/* ------------------------------------------------------------- */}
      <section className="py-16 bg-navy-950 text-white text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold font-display">
            Ready to Turn Your Academic Effort Into Income?
          </h2>
          <p className="text-slate-300 text-sm max-w-xl mx-auto">
            Join thousands of engineering students discovering topper notes and earning from their coursework.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              to="/explore"
              className="px-6 py-3.5 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 transition-all"
            >
              Explore All Notes
            </Link>
            <Link
              to="/creator"
              className="px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/20 transition-all"
            >
              Upload Notes & Earn
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
