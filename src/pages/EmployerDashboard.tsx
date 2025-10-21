import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// SVG Icons
const BriefcaseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const DollarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const FolderIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const PlusIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface Job {
  id: number;
  title: string;
  budget: number;
  status: 'draft' | 'active' | 'closed' | 'filled';
  created_at: string;
  category?: string;
  description?: string;
}

interface Workspace {
  id: number;
  job_id: number;
  freelancer_id: number;
  employer_id: number;
  status: string;
  created_at: string;
  jobs?: {
    title: string;
  };
  freelancer_profiles?: {
    user_id: string;
  };
}

interface Transaction {
  id: number;
  job_id: number;
  amount: number;
  total_amount: number;
  currency: string;
  transaction_type: string;
  status: string;
  description?: string;
  created_at: string;
  jobs?: {
    title: string;
  };
}

interface Activity {
  id: number;
  user_id: string;
  action: string;
  entity_type?: string;
  entity_id?: number;
  details?: any;
  created_at: string;
}

interface JobInvitation {
  id: number;
  job_id: number;
  freelancer_id: number;
  invited_by: string;
  status: string;
  created_at: string;
  freelancer_profiles?: {
    id: number;
    user_id: string;
    title?: string;
    hourly_rate?: number;
    rating: number;
  };
  jobs?: {
    title: string;
  };
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder');

export default function EmployerDashboard() {
  const { user, employerProfile, profile } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [shortlist, setShortlist] = useState<JobInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedJobForPayment, setSelectedJobForPayment] = useState<Job | null>(null);

  useEffect(() => {
    if (user && employerProfile) {
      loadData();
    }
  }, [user, employerProfile]);

  const loadData = async () => {
    if (!employerProfile) return;
    
    try {
      setLoading(true);
      setError(null);

      // Fetch jobs posted by employer
      const { data: jobsData, error: jobsError } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', employerProfile.id)
        .order('created_at', { ascending: false });

      if (jobsError) throw jobsError;
      setJobs(jobsData || []);

      // Fetch active workspaces
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select(`
          *,
          jobs(title),
          freelancer_profiles(user_id)
        `)
        .eq('employer_id', employerProfile.id)
        .in('status', ['active', 'in_progress'])
        .order('created_at', { ascending: false });

      if (workspacesError) throw workspacesError;
      setWorkspaces(workspacesData || []);

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select(`
          *,
          jobs(title)
        `)
        .eq('employer_id', employerProfile.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

      // Fetch activity logs
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (activitiesError) throw activitiesError;
      setActivities(activitiesData || []);

      // Fetch shortlisted freelancers (invitations created by admin)
      const { data: shortlistData, error: shortlistError } = await supabase
        .from('job_invitations')
        .select(`
          *,
          freelancer_profiles(id, user_id, title, hourly_rate, rating),
          jobs(title)
        `)
        .in('job_id', jobsData?.map(j => j.id) || [])
        .not('invited_by', 'is', null)
        .order('created_at', { ascending: false });

      if (shortlistError) throw shortlistError;
      setShortlist(shortlistData || []);

    } catch (err: any) {
      console.error('Failed to load data:', err);
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Calculate stats from real data
  const activeJobs = jobs.filter(j => j.status === 'active').length;
  const totalSpent = employerProfile?.total_spent || 0;
  const shortlistedCount = shortlist.length;

  // Format activity messages
  const formatActivityMessage = (activity: Activity): string => {
    const details = activity.details || {};
    switch (activity.action) {
      case 'job_posted':
        return `New job "${details.title || 'Untitled'}" posted`;
      case 'job_application':
        return `New application received for "${details.job_title || 'job'}"`;
      case 'workspace_created':
        return `Workspace created for "${details.job_title || 'project'}"`;
      case 'payment_made':
        return `Payment of $${details.amount || 0} processed`;
      default:
        return activity.action.replace(/_/g, ' ');
    }
  };

  // Format relative time
  const formatRelativeTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  // Sidebar navigation items
  const navItems = [
    { id: 'overview', label: 'Overview', icon: <ChartIcon /> },
    { id: 'jobs', label: 'My Jobs', icon: <BriefcaseIcon /> },
    { id: 'shortlist', label: 'Shortlist', icon: <StarIcon /> },
    { id: 'projects', label: 'Active Projects', icon: <FolderIcon /> },
    { id: 'payments', label: 'Payments', icon: <DollarIcon /> },
    { id: 'activity', label: 'Recent Activity', icon: <ClockIcon /> },
  ];

  // Payment Modal Component
  const PaymentModal = ({ job, onClose }: { job: Job; onClose: () => void }) => {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
        <div className="bg-surface rounded-lg max-w-md w-full p-6 border border-neutral-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-primary">Make Payment</h3>
            <button onClick={onClose} className="text-secondary hover:text-primary">
              <CloseIcon />
            </button>
          </div>
          
          <div className="mb-6">
            <p className="text-sm text-secondary mb-2">Job</p>
            <p className="text-primary font-medium">{job.title}</p>
          </div>

          <div className="mb-6">
            <p className="text-sm text-secondary mb-2">Amount</p>
            <p className="text-3xl font-bold gradient-text">${job.budget.toLocaleString()}</p>
          </div>

          <Elements stripe={stripePromise}>
            <PaymentForm job={job} onClose={onClose} onSuccess={loadData} />
          </Elements>
        </div>
      </div>
    );
  };

  // Payment Form Component
  const PaymentForm = ({ job, onClose, onSuccess }: { job: Job; onClose: () => void; onSuccess: () => void }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [processing, setProcessing] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      
      if (!stripe || !elements || !employerProfile) {
        return;
      }

      setProcessing(true);
      setErrorMsg(null);

      try {
        // Create payment intent via edge function
        const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-payment-intent`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`
          },
          body: JSON.stringify({
            jobId: job.id,
            amount: job.budget
          })
        });

        const result = await response.json();

        if (result.error) throw new Error(result.error.message);
        if (!result.data?.clientSecret) throw new Error('Failed to create payment intent');

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) throw new Error('Card element not found');

        const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(result.data.clientSecret, {
          payment_method: {
            card: cardElement as any,
          }
        });

        if (stripeError) throw stripeError;

        if (paymentIntent?.status === 'succeeded') {
          // Log activity
          await supabase.from('activity_logs').insert({
            user_id: user?.id,
            action: 'payment_made',
            entity_type: 'job',
            entity_id: job.id,
            details: { amount: job.budget, job_title: job.title }
          });

          alert('Payment successful!');
          onSuccess();
          onClose();
        }
      } catch (err: any) {
        console.error('Payment error:', err);
        setErrorMsg(err.message || 'Payment failed. Please try again.');
      } finally {
        setProcessing(false);
      }
    };

    return (
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-secondary mb-2">
            Card Details
          </label>
          <div className="p-3 bg-elevated border border-neutral-800 rounded-lg">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: '16px',
                    color: '#e5e7eb',
                    '::placeholder': {
                      color: '#6b7280',
                    },
                  },
                  invalid: {
                    color: '#ef4444',
                  },
                },
              }}
            />
          </div>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg">
            <p className="text-sm text-red-500">{errorMsg}</p>
          </div>
        )}

        <div className="flex space-x-3">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={processing}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!stripe || processing}
            className="flex-1"
          >
            {processing ? 'Processing...' : `Pay $${job.budget.toLocaleString()}`}
          </Button>
        </div>
      </form>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-page">
      <Header />
      
      <div className="flex-1 flex pt-16">
        {/* Sidebar */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-72 bg-surface border-r border-neutral-800
          transform transition-transform duration-300 ease-in-out pt-16 lg:pt-16
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="p-6 border-b border-neutral-800">
              <div className="flex items-center justify-between lg:justify-start">
                <h2 className="text-xl font-bold text-primary">Dashboard</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="lg:hidden text-secondary hover:text-primary"
                >
                  <CloseIcon />
                </button>
              </div>
              <p className="text-sm text-secondary mt-1">
                Welcome, {profile?.first_name}
              </p>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {navItems.map(item => (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveSection(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-lg
                    transition-all duration-fast font-medium
                    ${
                      activeSection === item.id
                        ? 'bg-elevated text-brand border-l-3 border-purple-500'
                        : 'text-secondary hover:bg-neutral-800 hover:text-primary'
                    }
                  `}
                >
                  <span className={activeSection === item.id ? 'text-purple-500' : 'text-neutral-700'}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            {/* Quick Action Button */}
            <div className="p-4 border-t border-neutral-800">
              <Link to="/jobs/new">
                <Button variant="primary" size="md" className="w-full" icon={<PlusIcon />}>
                  Post New Job
                </Button>
              </Link>
            </div>
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden mb-4 p-2 text-primary hover:bg-surface rounded-lg"
            >
              <MenuIcon />
            </button>

            {/* Page Title */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-primary mb-2">Employer Dashboard</h1>
              <p className="text-secondary">Manage your jobs, projects, and team</p>
            </div>

            {/* Loading State */}
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
              </div>
            ) : error ? (
              <Card>
                <div className="text-center py-12">
                  <p className="text-red-500 mb-4">{error}</p>
                  <Button variant="primary" onClick={loadData}>Retry</Button>
                </div>
              </Card>
            ) : (
              <>
                {/* Overview Section */}
                {activeSection === 'overview' && (
                  <div className="space-y-8">
                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      <Card padding="md" className="gradient-subtle">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-secondary mb-1">Active Jobs</p>
                            <p className="text-3xl font-bold gradient-text">{activeJobs}</p>
                          </div>
                          <div className="text-purple-500">
                            <BriefcaseIcon />
                          </div>
                        </div>
                      </Card>

                      <Card padding="md" className="gradient-subtle">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-secondary mb-1">Total Spent</p>
                            <p className="text-3xl font-bold gradient-text">${totalSpent.toLocaleString()}</p>
                          </div>
                          <div className="text-purple-500">
                            <DollarIcon />
                          </div>
                        </div>
                      </Card>

                      <Card padding="md" className="gradient-subtle">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-secondary mb-1">Shortlisted</p>
                            <p className="text-3xl font-bold gradient-text">{shortlistedCount}</p>
                          </div>
                          <div className="text-purple-500">
                            <UsersIcon />
                          </div>
                        </div>
                      </Card>

                      <Card padding="md" className="gradient-subtle">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm text-secondary mb-1">Active Projects</p>
                            <p className="text-3xl font-bold gradient-text">{workspaces.length}</p>
                          </div>
                          <div className="text-purple-500">
                            <FolderIcon />
                          </div>
                        </div>
                      </Card>
                    </div>

                    {/* Quick Actions */}
                    <Card>
                      <h3 className="text-xl font-semibold text-primary mb-6">Quick Actions</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <Link to="/jobs/new">
                          <button className="w-full p-4 bg-elevated hover:bg-neutral-700 rounded-lg border border-neutral-800 hover:border-purple-700 transition-all text-left group">
                            <div className="flex items-center space-x-3">
                              <div className="text-purple-500">
                                <PlusIcon />
                              </div>
                              <div>
                                <p className="font-medium text-primary group-hover:text-brand">Post New Job</p>
                                <p className="text-sm text-secondary">Create a job listing</p>
                              </div>
                            </div>
                          </button>
                        </Link>

                        <button
                          onClick={() => setActiveSection('shortlist')}
                          className="w-full p-4 bg-elevated hover:bg-neutral-700 rounded-lg border border-neutral-800 hover:border-purple-700 transition-all text-left group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-purple-500">
                              <SearchIcon />
                            </div>
                            <div>
                              <p className="font-medium text-primary group-hover:text-brand">View Shortlist</p>
                              <p className="text-sm text-secondary">Review matched freelancers</p>
                            </div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveSection('projects')}
                          className="w-full p-4 bg-elevated hover:bg-neutral-700 rounded-lg border border-neutral-800 hover:border-purple-700 transition-all text-left group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="text-purple-500">
                              <FolderIcon />
                            </div>
                            <div>
                              <p className="font-medium text-primary group-hover:text-brand">Manage Projects</p>
                              <p className="text-sm text-secondary">View active workspaces</p>
                            </div>
                          </div>
                        </button>
                      </div>
                    </Card>

                    {/* Recent Activity */}
                    <Card>
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-semibold text-primary">Recent Activity</h3>
                        <button
                          onClick={() => setActiveSection('activity')}
                          className="text-sm text-brand hover:underline"
                        >
                          View All
                        </button>
                      </div>
                      <div className="space-y-4">
                        {activities.slice(0, 3).map(activity => (
                          <div key={activity.id} className="flex items-start space-x-3 pb-4 border-b border-neutral-800 last:border-0">
                            <div className="mt-1 text-purple-500">
                              <CheckCircleIcon />
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-primary">{formatActivityMessage(activity)}</p>
                              <p className="text-xs text-tertiary mt-1">{formatRelativeTime(activity.created_at)}</p>
                            </div>
                          </div>
                        ))}
                        {activities.length === 0 && (
                          <p className="text-center text-secondary py-8">No recent activity</p>
                        )}
                      </div>
                    </Card>
                  </div>
                )}

                {/* Jobs Section */}
                {activeSection === 'jobs' && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-primary">My Jobs</h2>
                      <Link to="/jobs/new">
                        <Button variant="primary" icon={<PlusIcon />}>Post New Job</Button>
                      </Link>
                    </div>

                    {jobs.length === 0 ? (
                      <Card>
                        <div className="text-center py-12">
                          <div className="text-neutral-700 flex justify-center mb-4">
                            <BriefcaseIcon />
                          </div>
                          <h3 className="text-xl font-semibold text-primary mb-2">No jobs posted yet</h3>
                          <p className="text-secondary mb-6">Start by posting your first job to find talented freelancers</p>
                          <Link to="/jobs/new">
                            <Button variant="primary" icon={<PlusIcon />}>Post Your First Job</Button>
                          </Link>
                        </div>
                      </Card>
                    ) : (
                      <Card padding="sm">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-neutral-800 border-b-2 border-neutral-700">
                                <th className="text-left text-sm font-semibold text-secondary p-4">Job Title</th>
                                <th className="text-left text-sm font-semibold text-secondary p-4">Budget</th>
                                <th className="text-left text-sm font-semibold text-secondary p-4">Status</th>
                                <th className="text-left text-sm font-semibold text-secondary p-4">Posted</th>
                                <th className="text-left text-sm font-semibold text-secondary p-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {jobs.map(job => (
                                <tr key={job.id} className="border-b border-neutral-800 hover:bg-neutral-850 transition-colors">
                                  <td className="p-4 text-primary font-medium">{job.title}</td>
                                  <td className="p-4 text-secondary">${job.budget.toLocaleString()}</td>
                                  <td className="p-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                      job.status === 'active' ? 'bg-green-500/10 text-green-500' :
                                      job.status === 'filled' ? 'bg-purple-500/10 text-purple-500' :
                                      job.status === 'closed' ? 'bg-red-500/10 text-red-500' :
                                      'bg-neutral-700 text-neutral-300'
                                    }`}>
                                      {job.status}
                                    </span>
                                  </td>
                                  <td className="p-4 text-secondary">
                                    {new Date(job.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="p-4">
                                    <div className="flex space-x-2">
                                      <Link to={`/jobs/${job.id}`}>
                                        <Button variant="ghost" size="sm">View</Button>
                                      </Link>
                                      <Button 
                                        variant="primary" 
                                        size="sm"
                                        onClick={() => {
                                          setSelectedJobForPayment(job);
                                          setShowPaymentModal(true);
                                        }}
                                      >
                                        Pay
                                      </Button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {/* Shortlist Section */}
                {activeSection === 'shortlist' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-primary">Freelancer Shortlist</h2>
                    
                    {shortlist.length === 0 ? (
                      <Card>
                        <div className="text-center py-12">
                          <div className="text-neutral-700 flex justify-center mb-4">
                            <StarIcon />
                          </div>
                          <h3 className="text-xl font-semibold text-primary mb-2">No shortlisted freelancers yet</h3>
                          <p className="text-secondary">
                            Our admin team will review your job postings and provide carefully selected freelancer matches
                          </p>
                        </div>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {shortlist.map(invitation => (
                          <Card key={invitation.id} hover padding="md">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-primary mb-1">
                                  {invitation.freelancer_profiles?.title || 'Freelancer'}
                                </h3>
                                <p className="text-sm text-secondary mb-2">
                                  For: {invitation.jobs?.title}
                                </p>
                                <div className="flex items-center space-x-4 text-sm text-secondary">
                                  <span>${invitation.freelancer_profiles?.hourly_rate || 0}/hr</span>
                                  <span>★ {invitation.freelancer_profiles?.rating?.toFixed(1) || '0.0'}</span>
                                </div>
                              </div>
                              <span className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                                invitation.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                invitation.status === 'accepted' ? 'bg-green-500/10 text-green-500' :
                                'bg-red-500/10 text-red-500'
                              }`}>
                                {invitation.status}
                              </span>
                            </div>
                            <div className="flex space-x-3">
                              <Button variant="primary" size="sm" className="flex-1">
                                View Profile
                              </Button>
                              <Button variant="ghost" size="sm">Message</Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Active Projects Section */}
                {activeSection === 'projects' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-primary">Active Projects</h2>
                    
                    {workspaces.length === 0 ? (
                      <Card>
                        <div className="text-center py-12">
                          <div className="text-neutral-700 flex justify-center mb-4">
                            <FolderIcon />
                          </div>
                          <h3 className="text-xl font-semibold text-primary mb-2">No active projects</h3>
                          <p className="text-secondary">Projects will appear here once you hire freelancers</p>
                        </div>
                      </Card>
                    ) : (
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {workspaces.map(workspace => (
                          <Card key={workspace.id} hover padding="md">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex-1">
                                <h3 className="text-lg font-semibold text-primary mb-2">
                                  {workspace.jobs?.title || 'Project'}
                                </h3>
                                <p className="text-sm text-secondary mb-2">
                                  Workspace ID: #{workspace.id}
                                </p>
                                <p className="text-xs text-tertiary">
                                  Created: {new Date(workspace.created_at).toLocaleDateString()}
                                </p>
                              </div>
                              <span className="inline-flex px-3 py-1 text-xs font-medium rounded-full bg-green-500/10 text-green-500">
                                {workspace.status || 'Active'}
                              </span>
                            </div>
                            <div className="flex space-x-3">
                              <Link to={`/workspace/${workspace.id}`} className="flex-1">
                                <Button variant="primary" size="sm" className="w-full">Open Workspace</Button>
                              </Link>
                              <Button variant="ghost" size="sm">Details</Button>
                            </div>
                          </Card>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Recent Activity Section */}
                {activeSection === 'activity' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-primary">Recent Activity</h2>
                    {activities.length === 0 ? (
                      <Card>
                        <div className="text-center py-12">
                          <p className="text-secondary">No recent activity</p>
                        </div>
                      </Card>
                    ) : (
                      <Card>
                        <div className="space-y-6">
                          {activities.map(activity => (
                            <div key={activity.id} className="flex items-start space-x-4 pb-6 border-b border-neutral-800 last:border-0 last:pb-0">
                              <div className="mt-1 text-purple-500">
                                <CheckCircleIcon />
                              </div>
                              <div className="flex-1">
                                <p className="text-primary">{formatActivityMessage(activity)}</p>
                                <p className="text-sm text-tertiary mt-1">{formatRelativeTime(activity.created_at)}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </Card>
                    )}
                  </div>
                )}

                {/* Payments Section */}
                {activeSection === 'payments' && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-bold text-primary">Payments & Invoices</h2>
                    
                    {/* Payment Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <Card padding="md">
                        <p className="text-sm text-secondary mb-1">Total Spent</p>
                        <p className="text-2xl font-bold gradient-text">${totalSpent.toLocaleString()}</p>
                      </Card>
                      <Card padding="md">
                        <p className="text-sm text-secondary mb-1">Pending Payments</p>
                        <p className="text-2xl font-bold text-yellow-500">
                          ${transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.total_amount, 0).toLocaleString()}
                        </p>
                      </Card>
                      <Card padding="md">
                        <p className="text-sm text-secondary mb-1">Completed</p>
                        <p className="text-2xl font-bold text-green-500">
                          {transactions.filter(t => t.status === 'completed').length}
                        </p>
                      </Card>
                    </div>

                    {/* Transactions Table */}
                    {transactions.length === 0 ? (
                      <Card>
                        <div className="text-center py-12">
                          <div className="text-neutral-700 flex justify-center mb-4">
                            <DollarIcon />
                          </div>
                          <h3 className="text-xl font-semibold text-primary mb-2">No transactions yet</h3>
                          <p className="text-secondary">Your payment history will appear here</p>
                        </div>
                      </Card>
                    ) : (
                      <Card padding="sm">
                        <h3 className="text-lg font-semibold text-primary p-4 border-b border-neutral-800">
                          Transaction History
                        </h3>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="bg-neutral-800 border-b-2 border-neutral-700">
                                <th className="text-left text-sm font-semibold text-secondary p-4">Date</th>
                                <th className="text-left text-sm font-semibold text-secondary p-4">Job</th>
                                <th className="text-left text-sm font-semibold text-secondary p-4">Type</th>
                                <th className="text-left text-sm font-semibold text-secondary p-4">Amount</th>
                                <th className="text-left text-sm font-semibold text-secondary p-4">Status</th>
                                <th className="text-left text-sm font-semibold text-secondary p-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {transactions.map(transaction => (
                                <tr key={transaction.id} className="border-b border-neutral-800 hover:bg-neutral-850 transition-colors">
                                  <td className="p-4 text-secondary">
                                    {new Date(transaction.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="p-4 text-primary">
                                    {transaction.jobs?.title || `Job #${transaction.job_id}`}
                                  </td>
                                  <td className="p-4 text-secondary capitalize">
                                    {transaction.transaction_type.replace('_', ' ')}
                                  </td>
                                  <td className="p-4 text-primary font-medium">
                                    ${transaction.total_amount.toLocaleString()} {transaction.currency}
                                  </td>
                                  <td className="p-4">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                                      transaction.status === 'completed' ? 'bg-green-500/10 text-green-500' :
                                      transaction.status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                                      transaction.status === 'failed' ? 'bg-red-500/10 text-red-500' :
                                      'bg-neutral-700 text-neutral-300'
                                    }`}>
                                      {transaction.status}
                                    </span>
                                  </td>
                                  <td className="p-4">
                                    <Button variant="ghost" size="sm">View Invoice</Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </Card>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedJobForPayment && (
        <PaymentModal job={selectedJobForPayment} onClose={() => setShowPaymentModal(false)} />
      )}

      <Footer />
    </div>
  );
}
