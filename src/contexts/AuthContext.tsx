import React, { createContext, useContext, useEffect, useState } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase, Profile, FreelancerProfile, EmployerProfile } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  freelancerProfile: FreelancerProfile | null;
  employerProfile: EmployerProfile | null;
  loading: boolean;
  signUp: (data: SignUpData) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  // Aliases for backward compatibility
  register: (data: SignUpData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'freelancer' | 'employer';
  phone?: string;
  companyName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [freelancerProfile, setFreelancerProfile] = useState<FreelancerProfile | null>(null);
  const [employerProfile, setEmployerProfile] = useState<EmployerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Load user and profile
  const loadUserAndProfile = async () => {
    try {
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !currentUser) {
        setUser(null);
        setProfile(null);
        setFreelancerProfile(null);
        setEmployerProfile(null);
        return;
      }

      setUser(currentUser);

      // Get profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', currentUser.id)
        .maybeSingle();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        return;
      }

      setProfile(profileData);

      // Get role-specific profile
      if (profileData?.role === 'freelancer') {
        const { data: fpData } = await supabase
          .from('freelancer_profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .maybeSingle();
        setFreelancerProfile(fpData);
      } else if (profileData?.role === 'employer') {
        const { data: epData } = await supabase
          .from('employer_profiles')
          .select('*')
          .eq('user_id', currentUser.id)
          .maybeSingle();
        setEmployerProfile(epData);
      }

    } catch (error) {
      console.error('Load user error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUserAndProfile();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user || null);
        if (session?.user) {
          loadUserAndProfile();
        } else {
          setProfile(null);
          setFreelancerProfile(null);
          setEmployerProfile(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (data: SignUpData) => {
    const { email, password, firstName, lastName, role, phone, companyName } = data;

    const { data: authData, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          role,
          phone,
          company_name: companyName
        }
      }
    });

    if (error) throw error;

    // Profile will be created automatically by database trigger
    await loadUserAndProfile();
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Update last login
    const { data: { user: currentUser } } = await supabase.auth.getUser();
    if (currentUser) {
      await supabase
        .from('profiles')
        .update({ last_login: new Date().toISOString() })
        .eq('id', currentUser.id);
    }

    await loadUserAndProfile();
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    
    setUser(null);
    setProfile(null);
    setFreelancerProfile(null);
    setEmployerProfile(null);
  };

  const refreshProfile = async () => {
    await loadUserAndProfile();
  };

  const value = {
    user,
    profile,
    freelancerProfile,
    employerProfile,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile,
    // Aliases for backward compatibility
    register: signUp,
    login: signIn,
    logout: signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
