import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  UserRole, 
  NoteItem, 
  PurchaseRecord, 
  ReviewItem, 
  PayoutRequest 
} from '../types';
import { INITIAL_USER, INITIAL_NOTES, INITIAL_REVIEWS } from '../data/mockData';
import { processNotePurchase, submitPayoutRequest } from '../services/purchaseService';

interface AppContextType {
  user: UserProfile;
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  notes: NoteItem[];
  purchasedNotes: PurchaseRecord[];
  wishlist: string[];
  reviews: ReviewItem[];
  payoutRequests: PayoutRequest[];
  
  // Checkout & Payment
  checkoutNote: NoteItem | null;
  isCheckoutOpen: boolean;
  openCheckout: (note: NoteItem) => void;
  closeCheckout: () => void;
  processPayment: (simulatedSuccess: boolean) => Promise<{ success: boolean; message: string; purchase?: PurchaseRecord }>;
  
  // Protected PDF Viewer
  viewingNote: NoteItem | null;
  isViewerOpen: boolean;
  openViewer: (note: NoteItem) => void;
  closeViewer: () => void;
  
  // Wishlist
  toggleWishlist: (noteId: string) => void;
  isWishlisted: (noteId: string) => boolean;
  isPurchased: (noteId: string) => boolean;
  
  // Creator actions
  uploadNote: (newNote: Omit<NoteItem, 'id' | 'rating' | 'reviewsCount' | 'salesCount' | 'status' | 'uploadedAt'>) => void;
  requestPayout: (amount: number, upiId: string) => boolean;
  
  // Admin moderation
  approveNote: (noteId: string) => void;
  rejectNote: (noteId: string, reason: string) => void;
  
  // Reviews
  addReview: (noteId: string, rating: number, comment: string) => void;
  
  // Toast notification
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('notex_user');
    return saved ? JSON.parse(saved) : INITIAL_USER;
  });

  const [currentRole, setCurrentRole] = useState<UserRole>('buyer');

  const [notes, setNotes] = useState<NoteItem[]>(() => {
    const saved = localStorage.getItem('notex_notes');
    return saved ? JSON.parse(saved) : INITIAL_NOTES;
  });

  const [purchasedNotes, setPurchasedNotes] = useState<PurchaseRecord[]>(() => {
    const saved = localStorage.getItem('notex_purchases');
    // Pre-populate with one purchased note so user immediately sees library in action
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'pur-init-01',
        referenceId: 'NTX-90124',
        noteId: 'ntx-note-101',
        noteTitle: 'Computer Networks (21CS52) - Comprehensive VTU 5th Sem Notes',
        subject: 'Computer Networks',
        buyerId: INITIAL_USER.id,
        buyerName: INITIAL_USER.name,
        buyerEmail: INITIAL_USER.email,
        creatorId: 'usr-creator-01',
        amount: 49,
        platformCommission: 10,
        creatorEarning: 39,
        status: 'COMPLETED',
        isTestTransaction: true,
        purchasedAt: '2024-11-01T10:00:00Z',
      }
    ];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('notex_wishlist');
    return saved ? JSON.parse(saved) : ['ntx-note-102', 'ntx-note-106'];
  });

  const [reviews, setReviews] = useState<ReviewItem[]>(() => {
    const saved = localStorage.getItem('notex_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [payoutRequests, setPayoutRequests] = useState<PayoutRequest[]>([
    {
      id: 'pay-req-01',
      creatorId: INITIAL_USER.id,
      amount: 450,
      upiId: 'rahul.k@oksbi',
      status: 'PROCESSED',
      requestedAt: '2024-11-02T14:30:00Z',
    }
  ]);

  // Modals
  const [checkoutNote, setCheckoutNote] = useState<NoteItem | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [viewingNote, setViewingNote] = useState<NoteItem | null>(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  useEffect(() => {
    localStorage.setItem('notex_notes', JSON.stringify(notes));
  }, [notes]);

  useEffect(() => {
    localStorage.setItem('notex_purchases', JSON.stringify(purchasedNotes));
  }, [purchasedNotes]);

  useEffect(() => {
    localStorage.setItem('notex_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem('notex_reviews', JSON.stringify(reviews));
  }, [reviews]);

  const openCheckout = (note: NoteItem) => {
    setCheckoutNote(note);
    setIsCheckoutOpen(true);
  };

  const closeCheckout = () => {
    setIsCheckoutOpen(false);
    setCheckoutNote(null);
  };

  const openViewer = (note: NoteItem) => {
    setViewingNote(note);
    setIsViewerOpen(true);
  };

  const closeViewer = () => {
    setIsViewerOpen(false);
    setViewingNote(null);
  };

  const toggleWishlist = (noteId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(noteId);
      if (exists) {
        showToast('Removed from wishlist', 'info');
        return prev.filter(id => id !== noteId);
      } else {
        showToast('Saved to your wishlist', 'success');
        return [...prev, noteId];
      }
    });
  };

  const isWishlisted = (noteId: string) => wishlist.includes(noteId);
  const isPurchased = (noteId: string) => purchasedNotes.some(p => p.noteId === noteId && p.status === 'COMPLETED');

  const processPayment = async (simulatedSuccess: boolean) => {
    if (!checkoutNote) {
      return { success: false, message: 'No item in checkout' };
    }

    const res = await processNotePurchase(
      checkoutNote.id,
      checkoutNote.title,
      checkoutNote.subject,
      checkoutNote.price,
      user.id,
      user.name,
      user.email,
      checkoutNote.creatorId,
      simulatedSuccess
    );

    if (!res.success) {
      showToast(res.message, 'error');
      return { success: false, message: res.message };
    }

    if (res.purchase) {
      setPurchasedNotes(prev => [res.purchase!, ...prev]);
      setNotes(prev => prev.map(n => n.id === checkoutNote.id ? { ...n, salesCount: n.salesCount + 1 } : n));
      showToast(res.message, 'success');
      closeCheckout();
      return { success: true, message: res.message, purchase: res.purchase };
    }

    return { success: false, message: 'Unexpected purchase response' };
  };

  const uploadNote = (noteData: Omit<NoteItem, 'id' | 'rating' | 'reviewsCount' | 'salesCount' | 'status' | 'uploadedAt'>) => {
    const newNote: NoteItem = {
      ...noteData,
      id: `ntx-note-${Date.now()}`,
      rating: 5.0,
      reviewsCount: 0,
      salesCount: 0,
      status: 'PENDING_REVIEW', // as per Master Prompt step 5 & 10
      uploadedAt: new Date().toISOString(),
    };

    setNotes(prev => [newNote, ...prev]);
    showToast('Note submitted! Status: PENDING_REVIEW by NoteX administrators.', 'success');
  };

  const requestPayout = (amount: number, upiId: string): boolean => {
    submitPayoutRequest(user.id, amount, upiId);
    const newReq: PayoutRequest = {
      id: `pay-req-${Date.now()}`,
      creatorId: user.id,
      amount,
      upiId,
      status: 'PENDING',
      requestedAt: new Date().toISOString(),
    };
    setPayoutRequests(prev => [newReq, ...prev]);
    showToast(`Payout request of ₹${amount} submitted for UPI: ${upiId}`, 'success');
    return true;
  };

  const approveNote = (noteId: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, status: 'APPROVED' } : n));
    showToast('Note listing has been APPROVED and is now live on marketplace!', 'success');
  };

  const rejectNote = (noteId: string, reason: string) => {
    setNotes(prev => prev.map(n => n.id === noteId ? { ...n, status: 'REJECTED', rejectionReason: reason } : n));
    showToast(`Note rejected. Reason recorded: "${reason}"`, 'info');
  };

  const addReview = (noteId: string, rating: number, comment: string) => {
    const newRev: ReviewItem = {
      id: `rev-${Date.now()}`,
      noteId,
      buyerId: user.id,
      buyerName: user.name,
      rating,
      comment,
      createdAt: new Date().toISOString(),
      verifiedPurchase: true,
    };
    setReviews(prev => [newRev, ...prev]);
    showToast('Your verified student review was published!', 'success');
  };

  return (
    <AppContext.Provider
      value={{
        user,
        currentRole,
        setCurrentRole,
        notes,
        purchasedNotes,
        wishlist,
        reviews,
        payoutRequests,
        checkoutNote,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        processPayment,
        viewingNote,
        isViewerOpen,
        openViewer,
        closeViewer,
        toggleWishlist,
        isWishlisted,
        isPurchased,
        uploadNote,
        requestPayout,
        approveNote,
        rejectNote,
        addReview,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
