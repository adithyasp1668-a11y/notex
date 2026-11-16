import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  SlidersHorizontal, 
  X, 
  BookOpen, 
  ArrowUpDown,
  Star,
  Database as DatabaseIcon,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NoteCard } from '../components/common/NoteCard';
import { NoteCardSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';
import { COLLEGES, BRANCHES } from '../data/mockData';
import { getMarketplaceNotes } from '../services/marketplaceService';
import { NoteItem } from '../types';

export const ExplorePage: React.FC = () => {
  const { openCheckout, openViewer } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  // Filters state initialized from URL search params
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedBranch, setSelectedBranch] = useState<string>(searchParams.get('branch') || 'ALL');
  const [selectedSemester, setSelectedSemester] = useState<string>(searchParams.get('semester') || 'ALL');
  const [selectedCollege, setSelectedCollege] = useState<string>(searchParams.get('college') || 'ALL');
  const [priceFilter, setPriceFilter] = useState<'ALL' | 'UNDER_40' | '40_TO_60' | 'ABOVE_60'>('ALL');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'LATEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'MOST_POPULAR' | 'HIGHEST_RATED'>('MOST_POPULAR');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Pagination & Database query state
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 9;
  const [notesList, setNotesList] = useState<NoteItem[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [isFromDatabase, setIsFromDatabase] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getMarketplaceNotes({
      searchQuery,
      branch: selectedBranch,
      semester: selectedSemester,
      college: selectedCollege,
      priceFilter,
      minRating,
      sortBy,
      page: currentPage,
      pageSize,
    }).then(res => {
      if (isMounted) {
        setNotesList(res.notes);
        setTotalCount(res.totalCount);
        setIsFromDatabase(res.fromDatabase);
        setLoading(false);
      }
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    return () => {
      isMounted = false;
    };
  }, [searchQuery, selectedBranch, selectedSemester, selectedCollege, priceFilter, minRating, sortBy, currentPage]);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedBranch('ALL');
    setSelectedSemester('ALL');
    setSelectedCollege('ALL');
    setPriceFilter('ALL');
    setMinRating(0);
    setCurrentPage(1);
    setSearchParams({});
  };

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumbs & Title */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                NoteX Academic Marketplace
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                <DatabaseIcon className="w-3 h-3" />
                Live PostgreSQL Backend
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-navy-950 font-display mt-0.5">
              Explore University Study Notes
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Showing {totalCount} verified notes curated for VTU & Indian engineering exams
            </p>
          </div>

          {/* Search bar inside page */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search subject, code, or topic..."
                className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-brand-500 shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Mobile Filter toggle */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 flex items-center gap-1.5 text-xs font-bold shadow-sm"
            >
              <Filter className="w-4 h-4 text-brand-600" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Main Layout: Sidebar Filters + Note Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ========================================================= */}
          {/* DESKTOP SIDEBAR FILTER PANEL                              */}
          {/* ========================================================= */}
          <aside className="hidden lg:block lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-6 sticky top-28">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-navy-950 uppercase tracking-wider flex items-center gap-2">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-brand-600" />
                  Filter Notes
                </span>
                <button
                  onClick={clearFilters}
                  className="text-xs text-brand-600 hover:underline font-semibold"
                >
                  Reset All
                </button>
              </div>

              {/* Branch Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Engineering Branch</label>
                <select
                  value={selectedBranch}
                  onChange={(e) => {
                    setSelectedBranch(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 focus:outline-none text-slate-800"
                >
                  <option value="ALL">All Branches</option>
                  {BRANCHES.map(b => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>

              {/* Semester Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Semester</label>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    onClick={() => { setSelectedSemester('ALL'); setCurrentPage(1); }}
                    className={`py-1.5 rounded-lg text-xs font-semibold border ${
                      selectedSemester === 'ALL'
                        ? 'bg-brand-50 border-brand-500 text-brand-700'
                        : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    All Sems
                  </button>
                  {[3, 4, 5, 6, 7, 8].map(sem => (
                    <button
                      key={sem}
                      onClick={() => { setSelectedSemester(sem.toString()); setCurrentPage(1); }}
                      className={`py-1.5 rounded-lg text-xs font-semibold border ${
                        selectedSemester === sem.toString()
                          ? 'bg-brand-50 border-brand-500 text-brand-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Sem {sem}
                    </button>
                  ))}
                </div>
              </div>

              {/* College Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">College / Syllabus</label>
                <select
                  value={selectedCollege}
                  onChange={(e) => {
                    setSelectedCollege(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full bg-slate-50 border border-slate-200 text-xs font-medium rounded-xl p-2.5 focus:outline-none text-slate-800"
                >
                  <option value="ALL">All Colleges (VTU)</option>
                  {COLLEGES.map(c => (
                    <option key={c.id} value={c.name}>{c.name.split(',')[0]}</option>
                  ))}
                </select>
              </div>

              {/* Price Range Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Price Tier</label>
                <div className="space-y-1.5 text-xs text-slate-600">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceFilter === 'ALL'} 
                      onChange={() => { setPriceFilter('ALL'); setCurrentPage(1); }} 
                    />
                    <span>All Prices</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceFilter === 'UNDER_40'} 
                      onChange={() => { setPriceFilter('UNDER_40'); setCurrentPage(1); }} 
                    />
                    <span>Budget (Under ₹40)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceFilter === '40_TO_60'} 
                      onChange={() => { setPriceFilter('40_TO_60'); setCurrentPage(1); }} 
                    />
                    <span>Standard (₹40 - ₹60)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="radio" 
                      name="price" 
                      checked={priceFilter === 'ABOVE_60'} 
                      onChange={() => { setPriceFilter('ABOVE_60'); setCurrentPage(1); }} 
                    />
                    <span>Comprehensive Master Notes (&gt;₹60)</span>
                  </label>
                </div>
              </div>

              {/* Rating Filter */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700">Minimum Rating</label>
                <div className="flex items-center gap-2">
                  {[0, 4.5, 4.8].map((rating) => (
                    <button
                      key={rating}
                      onClick={() => { setMinRating(rating); setCurrentPage(1); }}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold border flex items-center justify-center gap-1 ${
                        minRating === rating 
                          ? 'bg-amber-50 border-amber-400 text-amber-800' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {rating === 0 ? 'Any' : (
                        <>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{rating}+</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </aside>

          {/* ========================================================= */}
          {/* MAIN NOTES LISTING                                        */}
          {/* ========================================================= */}
          <main className="lg:col-span-3 space-y-6">
            
            {/* Top Toolbar: Active filter tags & Sorting dropdown */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
              
              <div className="flex items-center gap-2 flex-wrap text-xs">
                <span className="font-semibold text-slate-500">Active:</span>
                {selectedBranch !== 'ALL' && (
                  <span className="px-2.5 py-1 rounded-md bg-brand-50 text-brand-700 font-semibold flex items-center gap-1">
                    {selectedBranch}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedBranch('ALL')} />
                  </span>
                )}
                {selectedSemester !== 'ALL' && (
                  <span className="px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 font-semibold flex items-center gap-1">
                    Sem {selectedSemester}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSemester('ALL')} />
                  </span>
                )}
                {searchQuery && (
                  <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-700 font-semibold flex items-center gap-1">
                    "{searchQuery}"
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSearchQuery('')} />
                  </span>
                )}
                {selectedBranch === 'ALL' && selectedSemester === 'ALL' && !searchQuery && (
                  <span className="text-slate-400">All subjects & branches</span>
                )}
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                  <ArrowUpDown className="w-3.5 h-3.5" /> Sort:
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value as any);
                    setCurrentPage(1);
                  }}
                  className="bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none"
                >
                  <option value="MOST_POPULAR">Most Popular</option>
                  <option value="HIGHEST_RATED">Highest Rated</option>
                  <option value="LATEST">Latest Uploads</option>
                  <option value="PRICE_LOW">Lowest Price (₹)</option>
                  <option value="PRICE_HIGH">Highest Price (₹)</option>
                </select>
              </div>

            </div>

            {/* Loading Indicator */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <NoteCardSkeleton key={i} />
                ))}
              </div>
            ) : notesList.length === 0 ? (
              <EmptyState
                icon={BookOpen}
                title="No notes matched your criteria"
                description="Try clearing your search query or selecting another VTU branch or semester."
                actionLabel="Clear All Filters"
                onAction={clearFilters}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {notesList.map(note => (
                    <NoteCard
                      key={note.id}
                      note={note}
                      onPreview={() => openViewer(note)}
                      onBuy={() => openCheckout(note)}
                    />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pt-6 flex items-center justify-between border-t border-slate-200 text-xs">
                    <button
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 disabled:opacity-40 flex items-center gap-1 hover:bg-slate-50"
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    <span className="font-semibold text-slate-600">
                      Page <strong className="text-navy-950">{currentPage}</strong> of {totalPages}
                    </span>
                    <button
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      className="px-3.5 py-2 rounded-xl border border-slate-200 bg-white font-semibold text-slate-700 disabled:opacity-40 flex items-center gap-1 hover:bg-slate-50"
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Filters Slide-over / Modal */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex bg-black/50 backdrop-blur-sm lg:hidden">
          <div className="w-4/5 max-w-xs bg-white h-full p-6 overflow-y-auto space-y-6 ml-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="font-bold text-navy-900 text-sm">Filter Notes</span>
              <button onClick={() => setMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Branch */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => { setSelectedBranch(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border p-2 text-xs rounded-xl"
              >
                <option value="ALL">All Branches</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            {/* Semester */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 block">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => { setSelectedSemester(e.target.value); setCurrentPage(1); }}
                className="w-full bg-slate-50 border p-2 text-xs rounded-xl"
              >
                <option value="ALL">All Semesters</option>
                {[3, 4, 5, 6, 7, 8].map(s => <option key={s} value={s.toString()}>Sem {s}</option>)}
              </select>
            </div>

            <button
              onClick={() => setMobileFilterOpen(false)}
              className="w-full py-3 bg-brand-600 text-white rounded-xl font-bold text-xs"
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
