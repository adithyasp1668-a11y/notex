import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './pages/LandingPage';
import { ExplorePage } from './pages/ExplorePage';
import { NoteDetailPage } from './pages/NoteDetailPage';
import { BuyerLibraryPage } from './pages/BuyerLibraryPage';
import { CreatorDashboardPage } from './pages/CreatorDashboardPage';
import { AdminModerationPage } from './pages/AdminModerationPage';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './pages/AuthPages';
import { 
  AboutPage, 
  HowItWorksPage, 
  PricingModelPage, 
  FAQPage, 
  ContactPage, 
  CopyrightPolicyPage 
} from './pages/StaticPages';
import { CheckoutModal } from './components/common/CheckoutModal';
import { ProtectedPdfViewer } from './components/common/ProtectedPdfViewer';
import { CheckCircle2, AlertCircle, Info } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    checkoutNote, 
    isCheckoutOpen, 
    closeCheckout, 
    viewingNote, 
    isViewerOpen, 
    closeViewer,
    toast 
  } = useApp();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/explore" element={<ExplorePage />} />
          <Route path="/notes/:id" element={<NoteDetailPage />} />
          <Route path="/library" element={<BuyerLibraryPage />} />
          <Route path="/creator" element={<CreatorDashboardPage />} />
          <Route path="/admin" element={<AdminModerationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/pricing-model" element={<PricingModelPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/copyright-policy" element={<CopyrightPolicyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      <Footer />

      {/* Global Checkout Modal */}
      {isCheckoutOpen && checkoutNote && (
        <CheckoutModal 
          note={checkoutNote} 
          onClose={closeCheckout} 
        />
      )}

      {/* Global Protected Dynamic Watermark PDF Viewer */}
      {isViewerOpen && viewingNote && (
        <ProtectedPdfViewer 
          note={viewingNote} 
          onClose={closeViewer} 
        />
      )}

      {/* Global Interactive Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className={`px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold text-white ${
            toast.type === 'success' ? 'bg-emerald-600 shadow-emerald-500/25' :
            toast.type === 'error' ? 'bg-rose-600 shadow-rose-500/25' :
            'bg-navy-950 shadow-navy-950/25'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 shrink-0" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 shrink-0" />}
            {toast.type === 'info' && <Info className="w-4 h-4 shrink-0" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppContent />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
