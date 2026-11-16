import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Sparkles, 
  Search, 
  ShieldCheck, 
  UploadCloud, 
  LayoutDashboard, 
  Library, 
  ChevronDown,
  Menu,
  X,
  GraduationCap,
  LogIn,
  LogOut,
  User as UserIcon
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const Navbar: React.FC = () => {
  const { currentRole, setCurrentRole, user: localUser, purchasedNotes } = useApp();
  const { user: authUser, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const displayName = profile?.full_name || authUser?.email?.split('@')[0] || localUser.name;
  const userEmail = authUser?.email || localUser.email;
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const handleLogout = async () => {
    await signOut();
    setUserDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-brand-700 via-brand-600 to-accent-purple text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
                <span className="font-extrabold text-xl tracking-tighter">NX</span>
                <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-white" title="Verified VTU Hub" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-extrabold tracking-tight text-navy-950 font-display flex items-center gap-1.5">
                  Note<span className="text-brand-600">X</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">
                  Student Marketplace
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
              <Link 
                to="/explore" 
                className={`px-3.5 py-2 rounded-lg transition-colors hover:text-navy-900 hover:bg-slate-100/70 ${
                  isActive('/explore') ? 'text-brand-600 bg-brand-50/80 font-semibold' : ''
                }`}
              >
                Explore Notes
              </Link>
              <Link 
                to="/how-it-works" 
                className={`px-3.5 py-2 rounded-lg transition-colors hover:text-navy-900 hover:bg-slate-100/70 ${
                  isActive('/how-it-works') ? 'text-brand-600 bg-brand-50/80 font-semibold' : ''
                }`}
              >
                How It Works
              </Link>
              <Link 
                to="/pricing-model" 
                className={`px-3.5 py-2 rounded-lg transition-colors hover:text-navy-900 hover:bg-slate-100/70 ${
                  isActive('/pricing-model') ? 'text-brand-600 bg-brand-50/80 font-semibold' : ''
                }`}
              >
                ₹10 Commission Model
              </Link>
              <Link 
                to="/faq" 
                className={`px-3.5 py-2 rounded-lg transition-colors hover:text-navy-900 hover:bg-slate-100/70 ${
                  isActive('/faq') ? 'text-brand-600 bg-brand-50/80 font-semibold' : ''
                }`}
              >
                FAQ
              </Link>
            </nav>
          </div>

          {/* Right Action Toolbar */}
          <div className="hidden lg:flex items-center gap-4">
            
            {/* Quick Link to My Library */}
            <Link 
              to="/library"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-700 hover:text-brand-600 hover:bg-slate-100 transition-colors border border-slate-200/60 shadow-sm"
            >
              <Library className="w-4 h-4 text-brand-600" />
              <span>My Library</span>
              {purchasedNotes.length > 0 && (
                <span className="ml-0.5 px-2 py-0.5 text-xs font-bold bg-brand-600 text-white rounded-full">
                  {purchasedNotes.length}
                </span>
              )}
            </Link>

            {/* Quick Role Switcher (For Interactive Testing) */}
            <div className="relative">
              <button 
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200/80 border border-slate-200 text-xs font-medium text-slate-700 transition-colors"
                title="Switch role mode to test Buyer, Creator or Admin views"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Mode: <strong className="capitalize text-navy-900">{currentRole}</strong></span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {roleDropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 p-2 z-50">
                  <div className="px-3 py-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    Switch Mode
                  </div>
                  {(['buyer', 'creator', 'admin'] as UserRole[]).map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setCurrentRole(role);
                        setRoleDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-medium flex items-center justify-between transition-colors ${
                        currentRole === role ? 'bg-brand-50 text-brand-700 font-bold' : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <span className="capitalize">{role} Experience</span>
                      {role === 'creator' && <UploadCloud className="w-3.5 h-3.5 text-accent-purple" />}
                      {role === 'admin' && <ShieldCheck className="w-3.5 h-3.5 text-red-500" />}
                      {role === 'buyer' && <BookOpen className="w-3.5 h-3.5 text-blue-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Role-Specific Portal Button */}
            {currentRole === 'creator' ? (
              <Link
                to="/creator"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold hover:opacity-95 shadow-md shadow-purple-500/20 transition-all"
              >
                <LayoutDashboard className="w-4 h-4" />
                Creator Studio
              </Link>
            ) : currentRole === 'admin' ? (
              <Link
                to="/admin"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-navy-950 shadow-md transition-all"
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Admin Moderation
              </Link>
            ) : (
              <Link
                to="/creator"
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-navy-900 text-white text-sm font-semibold hover:bg-brand-700 shadow-md transition-all"
              >
                <UploadCloud className="w-4 h-4" />
                Sell Notes (Earn ₹)
              </Link>
            )}

            {/* Profile / Auth Button */}
            {authUser ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 border-l border-slate-200 focus:outline-none"
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-xs border border-brand-200">
                    {initials}
                  </div>
                  <div className="hidden xl:block text-left">
                    <p className="text-xs font-bold text-navy-900 leading-none truncate max-w-[100px]">{displayName}</p>
                    <p className="text-[10px] text-slate-400 leading-tight">Student Account</p>
                  </div>
                </button>

                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-white shadow-xl border border-slate-200 p-2 z-50">
                    <div className="px-3 py-2 text-xs border-b border-slate-100">
                      <p className="font-bold text-navy-950">{displayName}</p>
                      <p className="text-[11px] text-slate-400 truncate">{userEmail}</p>
                    </div>
                    <Link
                      to="/library"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 mt-1"
                    >
                      <UserIcon className="w-3.5 h-3.5 text-slate-400" />
                      <span>My Profile & Library</span>
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2 mt-1 font-semibold"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-xl border border-slate-300 text-slate-800 text-xs font-bold hover:bg-slate-50 transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-bold hover:bg-brand-700 transition-colors shadow-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

          </div>

          {/* Mobile hamburger */}
          <div className="flex items-center gap-2 md:hidden">
            <Link 
              to="/library"
              className="p-2 rounded-lg text-slate-600 hover:text-navy-900"
            >
              <Library className="w-5 h-5" />
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-navy-900 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link 
            to="/explore" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Explore Notes
          </Link>
          <Link 
            to="/library" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            My Library ({purchasedNotes.length})
          </Link>
          <Link 
            to="/creator" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-brand-600 bg-brand-50"
          >
            Creator Dashboard & Sell
          </Link>
          <Link 
            to="/admin" 
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-700 hover:bg-slate-50"
          >
            Admin Moderation
          </Link>
          <div className="pt-2 border-t border-slate-100 flex items-center gap-2">
            <Link 
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center text-xs font-bold border border-slate-200 rounded-xl"
            >
              Sign In
            </Link>
            <Link 
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2 text-center text-xs font-bold bg-brand-600 text-white rounded-xl"
            >
              Create Account
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
