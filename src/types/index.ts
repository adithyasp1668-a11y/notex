export type UserRole = 'buyer' | 'creator' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  college: string;
  university: string;
  branch: string;
  semester: number;
  isCreator: boolean;
  isAdmin: boolean;
  createdAt: string;
}

export type EngineeringBranch = 'CSE' | 'ISE' | 'ECE' | 'EEE' | 'Mechanical' | 'Civil' | 'AI & DS';

export interface NoteItem {
  id: string;
  title: string;
  description: string;
  university: string;
  college: string;
  course: string;
  branch: EngineeringBranch;
  semester: number;
  subject: string;
  subjectCode: string;
  modules: string[]; // e.g. ["Module 1: Intro", "Module 2: Network Layer"]
  price: number; // in INR e.g. 49
  pagesCount: number;
  coverImage: string;
  samplePreviewPages: string[]; // image URLs or rendered slides
  fullPdfUrl?: string;
  creatorId: string;
  creatorName: string;
  creatorCollege: string;
  creatorAvatar?: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  uploadedAt: string;
  featured?: boolean;
}

export interface ReviewItem {
  id: string;
  noteId: string;
  buyerId: string;
  buyerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  verifiedPurchase: boolean;
}

export interface PurchaseRecord {
  id: string;
  referenceId: string; // e.g. "NTX-91823"
  noteId: string;
  noteTitle: string;
  subject: string;
  buyerId: string;
  buyerName: string;
  buyerEmail: string;
  creatorId: string;
  amount: number;
  platformCommission: number; // ₹10
  creatorEarning: number; // amount - 10
  status: 'COMPLETED' | 'FAILED' | 'REFUNDED';
  isTestTransaction: boolean;
  purchasedAt: string;
}

export interface CreatorStats {
  totalUploaded: number;
  approvedCount: number;
  pendingCount: number;
  totalSales: number;
  grossEarnings: number;
  platformCommissions: number;
  availableBalance: number;
  pendingBalance: number;
  lifetimeEarnings: number;
}

export interface PayoutRequest {
  id: string;
  creatorId: string;
  amount: number;
  upiId: string;
  status: 'PENDING' | 'PROCESSED' | 'REJECTED';
  requestedAt: string;
}
