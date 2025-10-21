import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  icon: React.ReactNode;
}

interface Job {
  id: number;
  title: string;
  employer_id: number;
  employer_name?: string;
  status: string;
  budget: number;
  created_at: string;
  category?: string;
  skills_required?: any;
}

interface Activity {
  id: number;
  action: string;
  user_id?: string;
  entity_type?: string;
  entity_id?: number;
  details?: any;
  created_at: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  status: string;
  created_at: string;
  avatar_url?: string;
}

interface PlatformStats {
  totalUsers: number;
  activeJobs: number;
  platformRevenue: number;
  pendingVerifications: number;
}

export default function AdminDashboard() {
  const { profile, loading: authLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Real data from Supabase
  const [stats, setStats] = useState<PlatformStats>({
    totalUsers: 0,
    activeJobs: 0,
    platformRevenue: 0,
    pendingVerifications: 0
  });

  const [users, setUsers] = useState<User[]>([]);
  const [recentJobs, setRecentJobs] = useState<Job[]>([]);
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [pendingUsers, setPendingUsers] = useState<User[]>([]);
  const [freelancerCount, setFreelancerCount] = useState(0);
  const [employerCount, setEmployerCount] = useState(0);
  const [freelancers, setFreelancers] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all data in parallel
      await Promise.all([
        fetchPlatformStats(),
        fetchUsers(),
        fetchPendingJobs(),
        fetchRecentActivities(),
        fetchPendingVerifications()
      ]);
    } catch (err: any) {
      console.error('Error fetching dashboard data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const fetchPlatformStats = async () => {
    // Get total users
    const { count: totalUsers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Get active jobs (open status)
    const { count: activeJobs } = await supabase
      .from('jobs')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'open');

    // Get platform revenue (sum of service fees)
    const { data: revenueData } = await supabase
      .from('transactions')
      .select('service_fee')
      .eq('status', 'completed');

    const platformRevenue = revenueData?.reduce((sum, t) => sum + (Number(t.service_fee) || 0), 0) || 0;

    // Get pending verifications
    const { count: pendingVerifications } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('is_verified', false)
      .neq('role', 'admin');

    setStats({
      totalUsers: totalUsers || 0,
      activeJobs: activeJobs || 0,
      platformRevenue: platformRevenue || 0,
      pendingVerifications: pendingVerifications || 0
    });
  };

  const fetchUsers = async () => {
    // Get recent users
    const { data: usersData } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(10);

    setUsers(usersData || []);

    // Get freelancer count
    const { count: freelancers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'freelancer');

    setFreelancerCount(freelancers || 0);

    // Get employer count
    const { count: employers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'employer');

    setEmployerCount(employers || 0);
  };

  const fetchPendingJobs = async () => {
    // Get jobs pending review AND open jobs for matching
    const { data: jobsData } = await supabase
      .from('jobs')
      .select(`
        id,
        title,
        employer_id,
        status,
        budget,
        category,
        skills_required,
        created_at
      `)
      .in('status', ['pending', 'open'])
      .order('created_at', { ascending: false })
      .limit(20);

    // Fetch employer names
    if (jobsData && jobsData.length > 0) {
      const employerIds = [...new Set(jobsData.map(j => j.employer_id))];
      const { data: employersData } = await supabase
        .from('employer_profiles')
        .select('id, company_name')
        .in('id', employerIds);

      const employerMap = new Map(employersData?.map(e => [e.id, e.company_name]));
      
      const enrichedJobs = jobsData.map(job => ({
        ...job,
        employer_name: employerMap.get(job.employer_id) || 'Unknown Employer'
      }));

      // Filter pending jobs for the Job Oversight section
      const pendingJobs = enrichedJobs.filter(j => j.status === 'pending');
      setRecentJobs(pendingJobs);
    } else {
      setRecentJobs([]);
    }
  };

  const fetchRecentActivities = async () => {
    const { data: activitiesData } = await supabase
      .from('activity_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20);

    setRecentActivities(activitiesData || []);
  };

  const fetchPendingVerifications = async () => {
    const { data: pendingData } = await supabase
      .from('profiles')
      .select('*')
      .eq('is_verified', false)
      .neq('role', 'admin')
      .order('created_at', { ascending: false })
      .limit(10);

    setPendingUsers(pendingData || []);
  };

  const fetchFreelancers = async () => {
    // Get all freelancers with their profiles
    const { data: freelancersData } = await supabase
      .from('profiles')
      .select('id, email, first_name, last_name, role, is_verified')
      .eq('role', 'freelancer')
      .eq('is_verified', true)
      .order('created_at', { ascending: false })
      .limit(50);

    setFreelancers(freelancersData || []);
  };

  const handleCreateInvitation = async (freelancerId: string) => {
    if (!selectedJob) {
      alert('Please select a job first');
      return;
    }

    try {
      // First, get freelancer_profiles.id from user_id
      const { data: freelancerProfile } = await supabase
        .from('freelancer_profiles')
        .select('id')
        .eq('user_id', freelancerId)
        .single();

      if (!freelancerProfile) {
        alert('Freelancer profile not found');
        return;
      }

      const { error } = await supabase
        .from('job_invitations')
        .insert({
          job_id: selectedJob.id,
          freelancer_id: freelancerProfile.id,
          invited_by: profile?.id,
          message: `You have been shortlisted for: ${selectedJob.title}`,
          status: 'pending',
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
        });

      if (error) throw error;

      alert('Invitation sent successfully!');
    } catch (err: any) {
      console.error('Error creating invitation:', err);
      alert('Failed to create invitation: ' + err.message);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_verified: true, status: 'active' })
        .eq('id', userId);

      if (error) throw error;

      // Refresh data
      await fetchPendingVerifications();
      await fetchPlatformStats();
      alert('User verified successfully!');
    } catch (err: any) {
      console.error('Error verifying user:', err);
      alert('Failed to verify user: ' + err.message);
    }
  };

  const handleApproveJob = async (jobId: number) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'open' })
        .eq('id', jobId);

      if (error) throw error;

      // Refresh jobs
      await fetchPendingJobs();
      await fetchPlatformStats();
      alert('Job approved successfully!');
    } catch (err: any) {
      console.error('Error approving job:', err);
      alert('Failed to approve job: ' + err.message);
    }
  };

  const handleRejectJob = async (jobId: number) => {
    try {
      const { error } = await supabase
        .from('jobs')
        .update({ status: 'rejected' })
        .eq('id', jobId);

      if (error) throw error;

      // Refresh jobs
      await fetchPendingJobs();
      alert('Job rejected successfully!');
    } catch (err: any) {
      console.error('Error rejecting job:', err);
      alert('Failed to reject job: ' + err.message);
    }
  };

  const StatCard: React.FC<StatCardProps> = ({ title, value, change, icon }) => (
    <Card padding="md" className="relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-secondary text-sm mb-1">{title}</p>
          <h3 className="text-3xl font-bold text-primary mb-2">{value}</h3>
          {change && (
            <p className="text-sm text-success flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              {change}
            </p>
          )}
        </div>
        <div className="text-purple-500 opacity-20">
          {icon}
        </div>
      </div>
    </Card>
  );

  const renderOverviewSection = () => (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Platform Overview</h2>
        <p className="text-secondary">Monitor key metrics and platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Users"
          value={stats.totalUsers.toLocaleString()}
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatCard
          title="Active Jobs"
          value={stats.activeJobs}
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          title="Platform Revenue"
          value={`$${stats.platformRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatCard
          title="Pending Verifications"
          value={stats.pendingVerifications}
          icon={
            <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Quick Stats Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="md">
          <h3 className="text-xl font-semibold text-primary mb-4">User Growth</h3>
          <div className="h-64 flex items-center justify-center text-secondary">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-xl font-semibold text-primary mb-4">Revenue Trends</h3>
          <div className="h-64 flex items-center justify-center text-secondary">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
              <p>Chart visualization would go here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderUserManagement = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">User Management</h2>
        <p className="text-secondary">Manage platform users and verifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card padding="md">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{freelancerCount}</p>
              <p className="text-sm text-secondary">Freelancers</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveSection('users')}>
            View All
          </Button>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{employerCount}</p>
              <p className="text-sm text-secondary">Employers</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="w-full" onClick={() => setActiveSection('users')}>
            View All
          </Button>
        </Card>

        <Card padding="md">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-warning/10 rounded-lg">
              <svg className="w-8 h-8 text-warning" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{stats.pendingVerifications}</p>
              <p className="text-sm text-secondary">Pending Reviews</p>
            </div>
          </div>
          <Button variant="primary" size="sm" className="w-full" onClick={fetchPendingVerifications}>
            Review Now
          </Button>
        </Card>
      </div>

      <Card padding="md">
        <h3 className="text-xl font-semibold text-primary mb-4">Recent User Registrations</h3>
        <div className="space-y-3">
          {users.length === 0 ? (
            <div className="text-center py-8 text-secondary">
              <p>No users found</p>
            </div>
          ) : (
            users.slice(0, 4).map((user) => {
              const initials = `${user.first_name?.[0] || ''}${user.last_name?.[0] || ''}`.toUpperCase();
              const timeAgo = new Date(user.created_at).toLocaleDateString();
              
              return (
                <div key={user.id} className="flex items-center justify-between p-3 bg-elevated rounded-lg">
                  <div className="flex items-center gap-3">
                    {user.avatar_url ? (
                      <img src={user.avatar_url} alt={user.first_name} className="w-10 h-10 rounded-full" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <span className="text-purple-500 font-semibold">{initials || '?'}</span>
                      </div>
                    )}
                    <div>
                      <p className="text-primary font-medium">{user.first_name} {user.last_name}</p>
                      <p className="text-sm text-secondary">{user.role} • Registered {timeAgo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!user.is_verified && (
                      <Button variant="primary" size="sm" onClick={() => handleVerifyUser(user.id)}>
                        Verify
                      </Button>
                    )}
                    {user.is_verified && (
                      <span className="px-2 py-1 text-xs rounded-full bg-success/20 text-success">
                        Verified
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );

  const renderJobOversight = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Job Oversight</h2>
        <p className="text-secondary">Review and approve job postings</p>
      </div>

      <Card padding="md">
        <h3 className="text-xl font-semibold text-primary mb-4">Jobs Pending Review</h3>
        <div className="space-y-4">
          {recentJobs.length === 0 ? (
            <div className="text-center py-8 text-secondary">
              <p>No pending jobs to review</p>
            </div>
          ) : (
            recentJobs.map((job) => {
              const postedDate = new Date(job.created_at).toLocaleDateString();
              
              return (
                <div key={job.id} className="p-4 bg-elevated rounded-lg border border-neutral-700">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-primary mb-1">{job.title}</h4>
                      <p className="text-sm text-secondary">
                        Posted by {job.employer_name} • {postedDate}
                      </p>
                      {job.category && (
                        <p className="text-sm text-secondary mt-1">
                          Category: {job.category}
                        </p>
                      )}
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-warning/20 text-warning">
                      {job.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-secondary">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-semibold">${job.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => handleApproveJob(job.id)}>
                        Approve
                      </Button>
                      <Button variant="ghost" size="sm" className="text-error hover:text-error" onClick={() => handleRejectJob(job.id)}>
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );

  const renderMatchingSystem = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Matching System</h2>
        <p className="text-secondary">Create and manage job-freelancer shortlists</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="md">
          <h3 className="text-xl font-semibold text-primary mb-4">Active Jobs</h3>
          <div className="space-y-3">
            {recentJobs.slice(0, 3).map((job) => (
              <div key={job.id} className="p-3 bg-elevated rounded-lg cursor-pointer hover:bg-neutral-700 transition-colors">
                <p className="font-medium text-primary">{job.title}</p>
                <p className="text-sm text-secondary">{job.employer_name}</p>
              </div>
            ))}
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-xl font-semibold text-primary mb-4">Shortlist Builder</h3>
          <div className="border-2 border-dashed border-neutral-700 rounded-lg p-8 text-center">
            <svg className="w-12 h-12 mx-auto mb-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            <p className="text-secondary mb-4">Select a job to create shortlist</p>
            <Button variant="primary" size="sm">
              Search Freelancers
            </Button>
          </div>
        </Card>
      </div>

      <Card padding="md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-primary">AI Matching Recommendations</h3>
          <Button variant="ghost" size="sm">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Button>
        </div>
        <div className="text-center py-8 text-secondary">
          <svg className="w-16 h-16 mx-auto mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          <p>AI recommendations will appear here</p>
        </div>
      </Card>
    </div>
  );

  const renderPlatformSettings = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Platform Settings</h2>
        <p className="text-secondary">Configure platform parameters and policies</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card padding="md" hover>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary mb-1">Commission Settings</h3>
              <p className="text-sm text-secondary mb-3">Configure platform commission rates</p>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary mb-1">Verification Rules</h3>
              <p className="text-sm text-secondary mb-3">Manage user verification criteria</p>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary mb-1">Email Templates</h3>
              <p className="text-sm text-secondary mb-3">Customize automated email templates</p>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </div>
        </Card>

        <Card padding="md" hover>
          <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-lg">
              <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-primary mb-1">System Configuration</h3>
              <p className="text-sm text-secondary mb-3">Advanced platform settings</p>
              <Button variant="ghost" size="sm">Configure</Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Analytics & Insights</h2>
        <p className="text-secondary">Platform performance metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card padding="md">
          <h3 className="text-lg font-semibold text-primary mb-4">Job Completion Rate</h3>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-500 mb-2">87%</div>
              <p className="text-sm text-secondary">+5% from last month</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-lg font-semibold text-primary mb-4">Avg. Response Time</h3>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-500 mb-2">2.4h</div>
              <p className="text-sm text-secondary">-0.5h improvement</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-lg font-semibold text-primary mb-4">Customer Satisfaction</h3>
          <div className="flex items-center justify-center h-40">
            <div className="text-center">
              <div className="text-5xl font-bold text-purple-500 mb-2">4.8</div>
              <p className="text-sm text-secondary">out of 5.0</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card padding="md">
          <h3 className="text-xl font-semibold text-primary mb-4">Platform Activity</h3>
          <div className="h-64 flex items-center justify-center text-secondary">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
              <p>Activity chart would go here</p>
            </div>
          </div>
        </Card>

        <Card padding="md">
          <h3 className="text-xl font-semibold text-primary mb-4">Payment Distribution</h3>
          <div className="h-64 flex items-center justify-center text-secondary">
            <div className="text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
              <p>Distribution chart would go here</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );

  const renderRecentActivity = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">Recent Activity</h2>
        <p className="text-secondary">Platform-wide activity feed</p>
      </div>

      <Card padding="md">
        <div className="space-y-4">
          {recentActivities.length === 0 ? (
            <div className="text-center py-8 text-secondary">
              <p>No recent activity</p>
            </div>
          ) : (
            recentActivities.map((activity) => {
              const getActivityIcon = () => {
                if (activity.action.includes('register') || activity.action.includes('signup')) {
                  return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                  );
                }
                if (activity.action.includes('job')) {
                  return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  );
                }
                if (activity.action.includes('payment')) {
                  return (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  );
                }
                return (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                );
              };

              const timestamp = new Date(activity.created_at).toLocaleString();
              const description = activity.details?.description || activity.action;

              return (
                <div key={activity.id} className="flex items-start gap-4 p-4 bg-elevated rounded-lg">
                  <div className="p-2 bg-purple-500/10 rounded-lg text-purple-500">
                    {getActivityIcon()}
                  </div>
                  <div className="flex-1">
                    <p className="text-primary font-medium">{description}</p>
                    <p className="text-sm text-secondary mt-1">
                      {activity.entity_type && `${activity.entity_type} • `}{timestamp}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </Card>
    </div>
  );

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-secondary">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center pt-16">
          <div className="text-center max-w-md">
            <div className="mb-4 text-error">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary mb-2">Error Loading Dashboard</h2>
            <p className="text-secondary mb-4">{error}</p>
            <Button onClick={fetchDashboardData}>Retry</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-page flex flex-col">
      <Header />

      <div className="flex-1 flex pt-16">
        {/* Sidebar */}
        <aside
          className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] bg-surface border-r border-neutral-800 transition-all duration-300 z-40 ${
            sidebarOpen ? 'w-64' : 'w-0 lg:w-16'
          }`}
        >
          <div className="h-full flex flex-col p-4">
            {/* Sidebar Toggle */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="mb-6 p-2 rounded-lg hover:bg-neutral-800 text-secondary hover:text-primary transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            {/* Navigation Items */}
            <nav className="flex-1 space-y-2">
              {[
                { id: 'overview', label: 'Overview', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                )},
                { id: 'users', label: 'Users', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                )},
                { id: 'jobs', label: 'Jobs', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                )},
                { id: 'matching', label: 'Matching', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                )},
                { id: 'analytics', label: 'Analytics', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                )},
                { id: 'activity', label: 'Activity', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )},
                { id: 'settings', label: 'Settings', icon: (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )},
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    activeSection === item.id
                      ? 'bg-gradient-subtle text-brand border-l-4 border-purple-500'
                      : 'text-secondary hover:bg-neutral-800 hover:text-primary'
                  }`}
                >
                  {item.icon}
                  {sidebarOpen && <span className="font-medium">{item.label}</span>}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Sidebar Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeSection === 'overview' && renderOverviewSection()}
            {activeSection === 'users' && renderUserManagement()}
            {activeSection === 'jobs' && renderJobOversight()}
            {activeSection === 'matching' && renderMatchingSystem()}
            {activeSection === 'settings' && renderPlatformSettings()}
            {activeSection === 'analytics' && renderAnalytics()}
            {activeSection === 'activity' && renderRecentActivity()}
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
