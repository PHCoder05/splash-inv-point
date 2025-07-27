export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      departments: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      inventory_transactions: {
        Row: {
          id: string
          product_id: string
          transaction_type: 'purchase' | 'issue' | 'return' | 'adjustment'
          quantity: number
          unit_price: number | null
          total_amount: number | null
          transaction_date: string
          vendor_id: string | null
          person_id: string | null
          department_id: string | null
          reference_number: string | null
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          transaction_type: 'purchase' | 'issue' | 'return' | 'adjustment'
          quantity: number
          unit_price?: number | null
          total_amount?: number | null
          transaction_date: string
          vendor_id?: string | null
          person_id?: string | null
          department_id?: string | null
          reference_number?: string | null
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          transaction_type?: 'purchase' | 'issue' | 'return' | 'adjustment'
          quantity?: number
          unit_price?: number | null
          total_amount?: number | null
          transaction_date?: string
          vendor_id?: string | null
          person_id?: string | null
          department_id?: string | null
          reference_number?: string | null
          notes?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_transactions_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_transactions_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          }
        ]
      }
      people: {
        Row: {
          id: string
          name: string
          email: string | null
          phone: string | null
          department_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email?: string | null
          phone?: string | null
          department_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string | null
          phone?: string | null
          department_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "people_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          }
        ]
      }
      products: {
        Row: {
          id: string
          description: string
          vendor_id: string
          category_id: string
          unit: string
          rate: number
          quantity: number
          min_stock: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          description: string
          vendor_id: string
          category_id: string
          unit: string
          rate?: number
          quantity?: number
          min_stock?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          description?: string
          vendor_id?: string
          category_id?: string
          unit?: string
          rate?: number
          quantity?: number
          min_stock?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "products_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "products_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "vendors"
            referencedColumns: ["id"]
          }
        ]
      }
      usage_records: {
        Row: {
          id: string
          product_id: string
          quantity: number
          person_id: string | null
          department_id: string | null
          usage_date: string
          purpose: string | null
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          quantity: number
          person_id?: string | null
          department_id?: string | null
          usage_date: string
          purpose?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          quantity?: number
          person_id?: string | null
          department_id?: string | null
          usage_date?: string
          purpose?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "usage_records_department_id_fkey"
            columns: ["department_id"]
            isOneToOne: false
            referencedRelation: "departments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_records_person_id_fkey"
            columns: ["person_id"]
            isOneToOne: false
            referencedRelation: "people"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "usage_records_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          }
        ]
      }
      vendors: {
        Row: {
          id: string
          name: string
          contact_person: string | null
          email: string | null
          phone: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          contact_person?: string | null
          email?: string | null
          phone?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      product_stock_status: {
        Row: {
          id: string | null
          description: string | null
          quantity: number | null
          min_stock: number | null
          unit: string | null
          rate: number | null
          stock_status: 'in_stock' | 'low_stock' | 'out_of_stock' | null
          category: string | null
          vendor: string | null
          created_at: string | null
          updated_at: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_stock_status: {
        Args: {
          product_quantity: number
          product_min_stock: number
        }
        Returns: 'in_stock' | 'low_stock' | 'out_of_stock'
      }
      update_updated_at_column: {
        Args: Record<string, never>
        Returns: unknown
      }
    }
    Enums: {
      stock_status: 'in_stock' | 'low_stock' | 'out_of_stock'
      transaction_type: 'purchase' | 'issue' | 'return' | 'adjustment'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 