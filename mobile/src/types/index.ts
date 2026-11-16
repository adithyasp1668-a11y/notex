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
  modules: string[];
  price: number;
  pagesCount: number;
  coverImage: string;
  creatorName: string;
  creatorCollege: string;
  rating: number;
  reviewsCount: number;
  salesCount: number;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED';
}

export interface PurchaseRecord {
  id: string;
  referenceId: string;
  noteId: string;
  noteTitle: string;
  amount: number;
  purchasedAt: string;
}
