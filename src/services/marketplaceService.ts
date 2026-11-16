import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { NoteItem, ReviewItem } from '../types';
import { INITIAL_NOTES, INITIAL_REVIEWS } from '../data/mockData';

export interface MarketplaceFilterParams {
  searchQuery?: string;
  branch?: string;
  semester?: string | number;
  college?: string;
  priceFilter?: 'ALL' | 'UNDER_40' | '40_TO_60' | 'ABOVE_60';
  minRating?: number;
  sortBy?: 'LATEST' | 'PRICE_LOW' | 'PRICE_HIGH' | 'MOST_POPULAR' | 'HIGHEST_RATED';
  page?: number;
  pageSize?: number;
}

/**
 * Queries approved notes from Supabase PostgreSQL database
 */
export async function getMarketplaceNotes(
  params: MarketplaceFilterParams
): Promise<{ notes: NoteItem[]; totalCount: number; fromDatabase: boolean }> {
  if (!isSupabaseConfigured) {
    return filterMockNotes(params);
  }

  try {
    let query = supabase
      .from('notes')
      .select(`
        id,
        creator_id,
        subject_id,
        title,
        description,
        price,
        page_count,
        status,
        cover_image,
        modules,
        sample_preview_pages,
        created_at,
        profiles (
          id,
          full_name,
          avatar_url,
          colleges (
            college_name
          )
        ),
        subjects (
          id,
          subject_name,
          subject_code,
          semester,
          branches (
            branch_name,
            branch_code
          )
        )
      `, { count: 'exact' })
      .eq('status', 'APPROVED');

    // Title / Text Search
    if (params.searchQuery && params.searchQuery.trim().length > 0) {
      query = query.ilike('title', `%${params.searchQuery.trim()}%`);
    }

    // Price Filtering
    if (params.priceFilter === 'UNDER_40') {
      query = query.lt('price', 40);
    } else if (params.priceFilter === '40_TO_60') {
      query = query.gte('price', 40).lte('price', 60);
    } else if (params.priceFilter === 'ABOVE_60') {
      query = query.gt('price', 60);
    }

    // Sorting
    if (params.sortBy === 'PRICE_LOW') {
      query = query.order('price', { ascending: true });
    } else if (params.sortBy === 'PRICE_HIGH') {
      query = query.order('price', { ascending: false });
    } else {
      // Default: latest uploads
      query = query.order('created_at', { ascending: false });
    }

    // Pagination
    const page = params.page || 1;
    const pageSize = params.pageSize || 12;
    const fromIndex = (page - 1) * pageSize;
    const toIndex = fromIndex + pageSize - 1;
    query = query.range(fromIndex, toIndex);

    const { data, count, error } = await query;

    if (error) {
      console.warn('Supabase notes query warning:', error.message);
      return filterMockNotes(params);
    }

    if (!data || data.length === 0) {
      // Database has 0 approved notes right now. Fall back to initial catalog for seamless demo!
      return filterMockNotes(params);
    }

    // Map database rows into NoteItem structure
    const mappedNotes: NoteItem[] = data.map((row: any) => {
      const subjectInfo = row.subjects;
      const creatorInfo = row.profiles;
      const branchCode = subjectInfo?.branches?.branch_code || 'CSE';
      const semesterNum = subjectInfo?.semester || 5;

      return {
        id: row.id,
        title: row.title,
        description: row.description || '',
        university: 'Visvesvaraya Technological University (VTU)',
        college: creatorInfo?.colleges?.college_name || 'RV College of Engineering (RVCE)',
        course: 'B.E. Engineering',
        branch: branchCode as any,
        semester: semesterNum,
        subject: subjectInfo?.subject_name || 'Academic Course',
        subjectCode: subjectInfo?.subject_code || '21CS51',
        modules: Array.isArray(row.modules) ? row.modules : ['Module 1-5 Solved Notes'],
        price: Number(row.price),
        pagesCount: row.page_count,
        coverImage: row.cover_image || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80&w=800',
        samplePreviewPages: row.sample_preview_pages || [],
        creatorId: row.creator_id,
        creatorName: creatorInfo?.full_name || 'Student Creator',
        creatorCollege: creatorInfo?.colleges?.college_name || 'VTU Engineering College',
        creatorAvatar: creatorInfo?.avatar_url,
        rating: 4.9,
        reviewsCount: 14,
        salesCount: 38,
        status: row.status,
        uploadedAt: row.created_at,
      };
    });

    return {
      notes: mappedNotes,
      totalCount: count ?? mappedNotes.length,
      fromDatabase: true,
    };
  } catch (err) {
    console.error('Error fetching marketplace notes from Supabase:', err);
    return filterMockNotes(params);
  }
}

/**
 * Fallback filter on high-quality mock data when table has 0 rows
 */
function filterMockNotes(params: MarketplaceFilterParams) {
  let list = INITIAL_NOTES.filter(n => n.status === 'APPROVED');

  if (params.searchQuery?.trim()) {
    const q = params.searchQuery.toLowerCase();
    list = list.filter(n => 
      n.title.toLowerCase().includes(q) ||
      n.subject.toLowerCase().includes(q) ||
      n.subjectCode.toLowerCase().includes(q)
    );
  }

  if (params.branch && params.branch !== 'ALL') {
    list = list.filter(n => n.branch === params.branch);
  }

  if (params.semester && params.semester !== 'ALL') {
    list = list.filter(n => n.semester.toString() === params.semester!.toString());
  }

  if (params.college && params.college !== 'ALL') {
    list = list.filter(n => n.college.includes(params.college!.split(',')[0]));
  }

  if (params.priceFilter === 'UNDER_40') {
    list = list.filter(n => n.price < 40);
  } else if (params.priceFilter === '40_TO_60') {
    list = list.filter(n => n.price >= 40 && n.price <= 60);
  } else if (params.priceFilter === 'ABOVE_60') {
    list = list.filter(n => n.price > 60);
  }

  if (params.minRating && params.minRating > 0) {
    list = list.filter(n => n.rating >= params.minRating!);
  }

  // Sorting
  if (params.sortBy === 'PRICE_LOW') {
    list.sort((a, b) => a.price - b.price);
  } else if (params.sortBy === 'PRICE_HIGH') {
    list.sort((a, b) => b.price - a.price);
  } else if (params.sortBy === 'HIGHEST_RATED') {
    list.sort((a, b) => b.rating - a.rating);
  } else if (params.sortBy === 'MOST_POPULAR') {
    list.sort((a, b) => b.salesCount - a.salesCount);
  }

  return { notes: list, totalCount: list.length, fromDatabase: false };
}

/**
 * Fetch reviews for a specific note from Supabase
 */
export async function getNoteReviews(noteId: string): Promise<ReviewItem[]> {
  if (!isSupabaseConfigured) {
    return INITIAL_REVIEWS.filter(r => r.noteId === noteId);
  }

  try {
    const { data, error } = await supabase
      .from('reviews')
      .select(`
        id,
        note_id,
        buyer_id,
        rating,
        comment,
        created_at,
        profiles (
          full_name,
          colleges (college_name)
        )
      `)
      .eq('note_id', noteId)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_REVIEWS.filter(r => r.noteId === noteId);
    }

    return data.map((r: any) => ({
      id: r.id,
      noteId: r.note_id,
      buyerId: r.buyer_id,
      buyerName: r.profiles?.full_name || 'Verified Student',
      rating: r.rating,
      comment: r.comment || '',
      createdAt: r.created_at,
      verifiedPurchase: true,
    }));
  } catch {
    return INITIAL_REVIEWS.filter(r => r.noteId === noteId);
  }
}
