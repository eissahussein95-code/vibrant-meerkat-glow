import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tdkqqeqjbmozqdtshsqa.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRka3FxZXFqYm1venFkdHNoc3FhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTI0NzAsImV4cCI6MjA3NjU2ODQ3MH0.LlkUaMRfGhg_RApRWN82Wx2vgEAAswI-vzTaMqjQ7b0';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper types
export type UserRole = 'admin' | 'freelancer' | 'employer';
export type UserStatus = 'pending' | 'active' | 'suspended' | 'banned';

export interface Profile {
  id: string;
  email: string;
  role: UserRole;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar_url?: string;
  is_verified: boolean;
  status: UserStatus;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface FreelancerProfile {
  id: number;
  user_id: string;
  title?: string;
  bio?: string;
  hourly_rate?: number;
  availability: 'available' | 'busy' | 'unavailable';
  experience_years?: number;
  location?: string;
  timezone?: string;
  languages?: string[];
  website_url?: string;
  linkedin_url?: string;
  github_url?: string;
  behance_url?: string;
  dribbble_url?: string;
  total_earnings: number;
  total_jobs_completed: number;
  rating: number;
  total_reviews: number;
}

export interface EmployerProfile {
  id: number;
  user_id: string;
  company_name: string;
  company_size?: '1-10' | '11-50' | '51-200' | '201-500' | '500+';
  industry?: string;
  company_description?: string;
  company_website?: string;
  company_logo_url?: string;
  location?: string;
  founded_year?: number;
  linkedin_url?: string;
  verification_status: 'pending' | 'verified' | 'rejected';
  total_jobs_posted: number;
  total_spent: number;
  rating: number;
  total_reviews: number;
}
