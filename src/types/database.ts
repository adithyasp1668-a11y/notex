export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          full_name: string
          email: string
          phone: string | null
          college_id: string | null
          branch_id: string | null
          semester: number | null
          avatar_url: string | null
          role: 'student' | 'admin'
          is_creator: boolean
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name: string
          email: string
          phone?: string | null
          college_id?: string | null
          branch_id?: string | null
          semester?: number | null
          avatar_url?: string | null
          role?: 'student' | 'admin'
          is_creator?: boolean
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string
          email?: string
          phone?: string | null
          college_id?: string | null
          branch_id?: string | null
          semester?: number | null
          avatar_url?: string | null
          role?: 'student' | 'admin'
          is_creator?: boolean
          is_verified?: boolean
          updated_at?: string
        }
      }
      universities: {
        Row: {
          id: string
          university_name: string
          abbreviation: string
          created_at: string
        }
        Insert: {
          id?: string
          university_name: string
          abbreviation: string
          created_at?: string
        }
        Update: {
          university_name?: string
          abbreviation?: string
        }
      }
      colleges: {
        Row: {
          id: string
          university_id: string
          college_name: string
          city: string
          state: string
          created_at: string
        }
        Insert: {
          id?: string
          university_id: string
          college_name: string
          city: string
          state: string
          created_at?: string
        }
        Update: {
          college_name?: string
          city?: string
          state?: string
        }
      }
      branches: {
        Row: {
          id: string
          branch_name: string
          branch_code: string
        }
        Insert: {
          id?: string
          branch_name: string
          branch_code: string
        }
        Update: {
          branch_name?: string
          branch_code?: string
        }
      }
      subjects: {
        Row: {
          id: string
          subject_name: string
          subject_code: string
          branch_id: string
          semester: number
        }
        Insert: {
          id?: string
          subject_name: string
          subject_code: string
          branch_id: string
          semester: number
        }
        Update: {
          subject_name?: string
          subject_code?: string
          branch_id?: string
          semester?: number
        }
      }
      notes: {
        Row: {
          id: string
          creator_id: string
          subject_id: string
          title: string
          description: string | null
          price: number
          page_count: number
          status: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
          cover_image: string | null
          modules: Json
          sample_preview_pages: string[]
          rejection_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          subject_id: string
          title: string
          description?: string | null
          price: number
          page_count: number
          status?: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
          cover_image?: string | null
          modules?: Json
          sample_preview_pages?: string[]
          rejection_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          title?: string
          description?: string | null
          price?: number
          page_count?: number
          status?: 'DRAFT' | 'PENDING_REVIEW' | 'APPROVED' | 'REJECTED' | 'SUSPENDED'
          cover_image?: string | null
          modules?: Json
          rejection_reason?: string | null
          updated_at?: string
        }
      }
      note_files: {
        Row: {
          id: string
          note_id: string
          storage_key: string
          file_type: string
          file_size: number
          page_count: number
          created_at: string
        }
        Insert: {
          id?: string
          note_id: string
          storage_key: string
          file_type?: string
          file_size: number
          page_count: number
          created_at?: string
        }
        Update: {
          storage_key?: string
          file_size?: number
          page_count?: number
        }
      }
      purchases: {
        Row: {
          id: string
          reference_id: string
          buyer_id: string
          note_id: string
          creator_id: string
          amount: number
          commission: number
          creator_amount: number
          status: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          is_test_transaction: boolean
          purchased_at: string
        }
        Insert: {
          id?: string
          reference_id: string
          buyer_id: string
          note_id: string
          creator_id: string
          amount: number
          commission?: number
          creator_amount: number
          status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
          is_test_transaction?: boolean
          purchased_at?: string
        }
        Update: {
          status?: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED'
        }
      }
      payments: {
        Row: {
          id: string
          purchase_id: string | null
          gateway_order_id: string | null
          gateway_payment_id: string | null
          amount: number
          status: 'INITIATED' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
          webhook_event_id: string | null
          is_test: boolean
          created_at: string
        }
        Insert: {
          id?: string
          purchase_id?: string | null
          gateway_order_id?: string | null
          gateway_payment_id?: string | null
          amount: number
          status: 'INITIATED' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
          webhook_event_id?: string | null
          is_test?: boolean
          created_at?: string
        }
        Update: {
          status?: 'INITIATED' | 'SUCCESS' | 'FAILED' | 'REFUNDED'
        }
      }
      creator_wallets: {
        Row: {
          id: string
          creator_id: string
          available_balance: number
          pending_balance: number
          total_earned: number
          updated_at: string
        }
        Insert: {
          id?: string
          creator_id: string
          available_balance?: number
          pending_balance?: number
          total_earned?: number
          updated_at?: string
        }
        Update: {
          available_balance?: number
          pending_balance?: number
          total_earned?: number
          updated_at?: string
        }
      }
      wallet_transactions: {
        Row: {
          id: string
          wallet_id: string
          purchase_id: string | null
          payout_id: string | null
          transaction_type: 'SALE_CREDIT' | 'PAYOUT_DEBIT' | 'COMMISSION_DEDUCTION' | 'REFUND_DEBIT' | 'ADJUSTMENT'
          amount: number
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          wallet_id: string
          purchase_id?: string | null
          payout_id?: string | null
          transaction_type: 'SALE_CREDIT' | 'PAYOUT_DEBIT' | 'COMMISSION_DEDUCTION' | 'REFUND_DEBIT' | 'ADJUSTMENT'
          amount: number
          description?: string | null
          created_at?: string
        }
        Update: {
          amount?: number
          description?: string | null
        }
      }
      payouts: {
        Row: {
          id: string
          creator_id: string
          amount: number
          payout_method: string
          payout_reference: string
          status: 'PENDING' | 'PROCESSED' | 'REJECTED'
          requested_at: string
          processed_at: string | null
        }
        Insert: {
          id?: string
          creator_id: string
          amount: number
          payout_method?: string
          payout_reference: string
          status?: 'PENDING' | 'PROCESSED' | 'REJECTED'
          requested_at?: string
          processed_at?: string | null
        }
        Update: {
          status?: 'PENDING' | 'PROCESSED' | 'REJECTED'
          processed_at?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          buyer_id: string
          note_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          buyer_id: string
          note_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          rating?: number
          comment?: string | null
        }
      }
      reports: {
        Row: {
          id: string
          reporter_id: string
          note_id: string
          reason: string
          description: string | null
          status: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
          created_at: string
        }
        Insert: {
          id?: string
          reporter_id: string
          note_id: string
          reason: string
          description?: string | null
          status?: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
          created_at?: string
        }
        Update: {
          status?: 'PENDING' | 'INVESTIGATING' | 'RESOLVED' | 'DISMISSED'
        }
      }
      wishlists: {
        Row: {
          id: string
          user_id: string
          note_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          note_id: string
          created_at?: string
        }
        Update: {
          note_id?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          message: string
          is_read: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          message: string
          is_read?: boolean
          created_at?: string
        }
        Update: {
          is_read?: boolean
        }
      }
      admin_audit_logs: {
        Row: {
          id: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string
          details: Json
          created_at: string
        }
        Insert: {
          id?: string
          admin_id: string
          action: string
          entity_type: string
          entity_id: string
          details?: Json
          created_at?: string
        }
        Update: {
          details?: Json
        }
      }
      platform_settings: {
        Row: {
          id: string
          setting_key: string
          setting_value: Json
          updated_at: string
        }
        Insert: {
          id?: string
          setting_key: string
          setting_value: Json
          updated_at?: string
        }
        Update: {
          setting_value?: Json
          updated_at?: string
        }
      }
    }
  }
}
