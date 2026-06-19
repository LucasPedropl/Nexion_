export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.4";
  };
  public: {
    Tables: {
      documents: {
        Row: {
          category: string | null;
          content: string;
          created_at: string;
          created_by: string;
          id: string;
          project_id: string;
          slug: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          category?: string | null;
          content?: string;
          created_at?: string;
          created_by: string;
          id?: string;
          project_id: string;
          slug: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          category?: string | null;
          content?: string;
          created_at?: string;
          created_by?: string;
          id?: string;
          project_id?: string;
          slug?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "documents_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "documents_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      kanban_columns: {
        Row: {
          color: string;
          created_at: string;
          id: string;
          label: string;
          position: number;
          project_id: string;
        };
        Insert: {
          color?: string;
          created_at?: string;
          id?: string;
          label: string;
          position: number;
          project_id: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          id?: string;
          label?: string;
          position?: number;
          project_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "kanban_columns_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      notifications: {
        Row: {
          body: string | null;
          created_at: string;
          id: string;
          metadata: Json;
          read_at: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Insert: {
          body?: string | null;
          created_at?: string;
          id?: string;
          metadata?: Json;
          read_at?: string | null;
          title: string;
          type: string;
          user_id: string;
        };
        Update: {
          body?: string | null;
          created_at?: string;
          id?: string;
          metadata?: Json;
          read_at?: string | null;
          title?: string;
          type?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      profiles: {
        Row: {
          avatar_url: string | null;
          created_at: string;
          email: string;
          full_name: string;
          id: string;
          theme: string;
          updated_at: string;
        };
        Insert: {
          avatar_url?: string | null;
          created_at?: string;
          email: string;
          full_name: string;
          id: string;
          theme?: string;
          updated_at?: string;
        };
        Update: {
          avatar_url?: string | null;
          created_at?: string;
          email?: string;
          full_name?: string;
          id?: string;
          theme?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      project_invitations: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          invited_by: string;
          project_id: string;
          role: Database["public"]["Enums"]["project_role"];
          status: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id?: string;
          invited_by: string;
          project_id: string;
          role?: Database["public"]["Enums"]["project_role"];
          status?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          invited_by?: string;
          project_id?: string;
          role?: Database["public"]["Enums"]["project_role"];
          status?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_invitations_invited_by_fkey";
            columns: ["invited_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_invitations_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
      project_members: {
        Row: {
          id: string;
          joined_at: string;
          project_id: string;
          role: Database["public"]["Enums"]["project_role"];
          user_id: string;
        };
        Insert: {
          id?: string;
          joined_at?: string;
          project_id: string;
          role?: Database["public"]["Enums"]["project_role"];
          user_id: string;
        };
        Update: {
          id?: string;
          joined_at?: string;
          project_id?: string;
          role?: Database["public"]["Enums"]["project_role"];
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "project_members_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "project_members_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      projects: {
        Row: {
          created_at: string;
          description: string | null;
          id: string;
          invite_code: string;
          name: string;
          owner_id: string;
          slug: string;
          updated_at: string;
        };
        Insert: {
          created_at?: string;
          description?: string | null;
          id?: string;
          invite_code?: string;
          name: string;
          owner_id: string;
          slug: string;
          updated_at?: string;
        };
        Update: {
          created_at?: string;
          description?: string | null;
          id?: string;
          invite_code?: string;
          name?: string;
          owner_id?: string;
          slug?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "projects_owner_id_fkey";
            columns: ["owner_id"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
        ];
      };
      task_documents: {
        Row: {
          document_id: string;
          task_id: string;
        };
        Insert: {
          document_id: string;
          task_id: string;
        };
        Update: {
          document_id?: string;
          task_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "task_documents_document_id_fkey";
            columns: ["document_id"];
            isOneToOne: false;
            referencedRelation: "documents";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "task_documents_task_id_fkey";
            columns: ["task_id"];
            isOneToOne: false;
            referencedRelation: "tasks";
            referencedColumns: ["id"];
          },
        ];
      };
      tasks: {
        Row: {
          assigned_to: string | null;
          column_id: string | null;
          created_at: string;
          created_by: string;
          description: string | null;
          id: string;
          position: number;
          priority: string;
          project_id: string;
          title: string;
          updated_at: string;
        };
        Insert: {
          assigned_to?: string | null;
          column_id?: string | null;
          created_at?: string;
          created_by: string;
          description?: string | null;
          id?: string;
          position?: number;
          priority?: string;
          project_id: string;
          title: string;
          updated_at?: string;
        };
        Update: {
          assigned_to?: string | null;
          column_id?: string | null;
          created_at?: string;
          created_by?: string;
          description?: string | null;
          id?: string;
          position?: number;
          priority?: string;
          project_id?: string;
          title?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "tasks_assigned_to_fkey";
            columns: ["assigned_to"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_column_id_fkey";
            columns: ["column_id"];
            isOneToOne: false;
            referencedRelation: "kanban_columns";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_created_by_fkey";
            columns: ["created_by"];
            isOneToOne: false;
            referencedRelation: "profiles";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "tasks_project_id_fkey";
            columns: ["project_id"];
            isOneToOne: false;
            referencedRelation: "projects";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      project_role: "owner" | "admin" | "member";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};
