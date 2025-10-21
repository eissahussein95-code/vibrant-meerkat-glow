import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';
import Button from '../components/Button';

// SVG Icons
const DollarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ProjectIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const PortfolioIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ActivityIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const LoadingSpinner = () => (
  <div className="inline-block w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
);

const CheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

interface Workspace {
  id: number;
  job_id: number;
  status: string;
  created_at: string;
  job_title?: string;
  job_budget?: number;
  employer_company_name?: string;
}

interface JobInvitation {
  id: number;
  job_id: number;
  status: string;
  message: string;
  created_at: string;
  job_title?: string;
  job_budget?: number;
  employer_company_name?: string;
}

interface PortfolioProject {
  id: number;
  title: string;
  description: string;
  project_url?: string;
  thumbnail_url?: string;
  is_featured: boolean;
}

interface Transaction {
  id: number;
  amount: number;
  transaction_type: string;
  status: string;
  created_at: string;
  description?: string;
}

interface Activity {
  id: number;
  action: string;
  entity_type?: string;
  entity_id?: number;
  details?: any;
  created_at: string;
}

export default function FreelancerDashboard() {
  const { user, profile, freelancerProfile, loading: authLoading } = useAuth();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [invitations, setInvitations] = useState<JobInvitation[]>([]);
  const [portfolioProjects, setPortfolioProjects] = useState<PortfolioProject[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [stats, setStats] = useState({
    totalEarnings: 0,
    activeProjects: 0,
    jobInvitations: 0,
    profileViews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  useEffect(() => {
    if (!authLoading && user && freelancerProfile) {
      loadData();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [authLoading, user, freelancerProfile]);

  const loadData = async () => {
    if (!user || !freelancerProfile) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const freelancerId = freelancerProfile.id;

      // Fetch active workspaces
      const { data: workspacesData, error: workspacesError } = await supabase
        .from('workspaces')
        .select('*')
        .eq('freelancer_id', freelancerId)
        .in('status', ['active', 'in_progress'])
        .order('created_at', { ascending: false });

      if (workspacesError) throw workspacesError;

      // Fetch job details for each workspace
      const workspacesWithJobs = await Promise.all(
        (workspacesData || []).map(async (workspace) => {
          const { data: jobData } = await supabase
            .from('jobs')
            .select('title, budget')
            .eq('id', workspace.job_id)
            .maybeSingle();

          const { data: employerData } = await supabase
            .from('employer_profiles')
            .select('company_name')
            .eq('id', workspace.employer_id)
            .maybeSingle();

          return {
            ...workspace,
            job_title: jobData?.title || 'Untitled Job',
            job_budget: jobData?.budget || 0,
            employer_company_name: employerData?.company_name || 'Unknown Company'
          };
        })
      );

      setWorkspaces(workspacesWithJobs);

      // Fetch job invitations
      const { data: invitationsData, error: invitationsError } = await supabase
        .from('job_invitations')
        .select('*')
        .eq('freelancer_id', freelancerId)
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(10);

      if (invitationsError) throw invitationsError;

      // Fetch job details for each invitation
      const invitationsWithJobs = await Promise.all(
        (invitationsData || []).map(async (invitation) => {
          const { data: jobData } = await supabase
            .from('jobs')
            .select('title, budget, employer_id')
            .eq('id', invitation.job_id)
            .maybeSingle();

          let companyName = 'Unknown Company';
          if (jobData?.employer_id) {
            const { data: employerData } = await supabase
              .from('employer_profiles')
              .select('company_name')
              .eq('id', jobData.employer_id)
              .maybeSingle();
            companyName = employerData?.company_name || 'Unknown Company';
          }

          return {
            ...invitation,
            job_title: jobData?.title || 'Untitled Job',
            job_budget: jobData?.budget || 0,
            employer_company_name: companyName
          };
        })
      );

      setInvitations(invitationsWithJobs);

      // Fetch portfolio projects
      const { data: portfolioData, error: portfolioError } = await supabase
        .from('portfolio_projects')
        .select('*')
        .eq('freelancer_id', freelancerId)
        .order('is_featured', { ascending: false })
        .order('display_order', { ascending: true })
        .limit(10);

      if (portfolioError) throw portfolioError;
      setPortfolioProjects(portfolioData || []);

      // Fetch transactions
      const { data: transactionsData, error: transactionsError } = await supabase
        .from('transactions')
        .select('*')
        .eq('freelancer_id', freelancerId)
        .order('created_at', { ascending: false })
        .limit(10);

      if (transactionsError) throw transactionsError;
      setTransactions(transactionsData || []);

      // Calculate total earnings from completed transactions
      const totalEarnings = (transactionsData || [])
        .filter(t => t.status === 'completed' && t.transaction_type === 'payment')
        .reduce((sum, t) => sum + parseFloat(t.amount.toString()), 0);

      // Fetch activity logs
      const { data: activitiesData, error: activitiesError } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (activitiesError) throw activitiesError;
      setActivities(activitiesData || []);

      // Update stats
      setStats({
        totalEarnings,
        activeProjects: workspacesWithJobs.length,
        jobInvitations: invitationsWithJobs.length,
        profileViews: freelancerProfile.total_reviews || 0
      });

    } catch (error) {
      console.error('Failed to load data', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Handle invitation response
  const handleInvitationResponse = async (invitationId: number, status: 'accepted' | 'declined') => {
    try {
      const { error } = await supabase
        .from('job_invitations')
        .update({ 
          status, 
          responded_at: new Date().toISOString() 
        })
        .eq('id', invitationId);

      if (error) throw error;

      // Refresh invitations
      setInvitations(prev => prev.filter(inv => inv.id !== invitationId));
      
      // Update stats
      setStats(prev => ({ ...prev, jobInvitations: prev.jobInvitations - 1 }));

      // TODO: If accepted, create workspace
      if (status === 'accepted') {
        // This would typically trigger workspace creation via backend
        console.log('Invitation accepted, workspace creation would be triggered');
      }
    } catch (error) {
      console.error('Failed to respond to invitation:', error);
      alert('Failed to respond to invitation. Please try again.');
    }
  };

  const statsCards = [
    { label: 'Total Earnings', value: `$${stats.totalEarnings.toLocaleString()}`, icon: DollarIcon, color: 'text-green-400' },
    { label: 'Active Projects', value: stats.activeProjects.toString(), icon: ProjectIcon, color: 'text-purple-400' },
    { label: 'Job Invitations', value: stats.jobInvitations.toString(), icon: MailIcon, color: 'text-blue-400' },
    { label: 'Total Reviews', value: stats.profileViews.toString(), icon: EyeIcon, color: 'text-yellow-400' },
  ];

  const sidebarLinks = [
    { id: 'overview', label: 'Overview', icon: DashboardIcon },
    { id: 'projects', label: 'Active Projects', icon: ProjectIcon },
    { id: 'inbox', label: 'Job Inbox', icon: MailIcon },
    { id: 'portfolio', label: 'Portfolio', icon: PortfolioIcon },
    { id: 'activity', label: 'Recent Activity', icon: ActivityIcon },
  ];

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-page flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner />
          <p className="text-secondary mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !freelancerProfile) {
    return (
      <div className="min-h-screen bg-page flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="!p-12 text-center">
            <h2 className="text-2xl font-bold mb-4">Freelancer Dashboard</h2>
            <p className="text-secondary mb-6">Please log in as a freelancer to access this dashboard.</p>
            <Link to="/login">
              <Button variant="primary">Log In</Button>
            </Link>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-page flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <Card className="!p-12 text-center">
            <h2 className="text-2xl font-bold mb-4 text-red-400">Error</h2>
            <p className="text-secondary mb-6">{error}</p>
            <Button variant="primary" onClick={loadData}>Retry</Button>
          </Card>
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
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40 w-64 bg-surface border-r border-neutral-800 pt-16 lg:pt-0
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="h-full overflow-y-auto p-6">
            <div className="mb-8">
              <h2 className="text-lg font-semibold gradient-text mb-2">Freelancer Dashboard</h2>
              <p className="text-sm text-secondary">{profile?.first_name} {profile?.last_name}</p>
            </div>
            
            <nav className="space-y-2">
              {sidebarLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => {
                    setActiveSection(link.id);
                    setSidebarOpen(false);
                  }}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${activeSection === link.id 
                      ? 'gradient-primary text-white shadow-card' 
                      : 'text-secondary hover:bg-elevated hover:text-primary'
                    }
                  `}
                >
                  <link.icon className="w-5 h-5" />
                  <span className="font-medium">{link.label}</span>
                </button>
              ))}
            </nav>
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
        <main className="flex-1 overflow-y-auto">
          {/* Mobile header */}
          <div className="lg:hidden sticky top-0 z-20 bg-surface border-b border-neutral-800 px-4 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-primary"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Overview Section */}
            {activeSection === 'overview' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Welcome back, {profile?.first_name}!</h1>
                  <p className="text-secondary">Here's what's happening with your freelance work</p>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {statsCards.map((stat) => (
                    <Card key={stat.label} className="!p-6" hover>
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm text-secondary mb-2">{stat.label}</p>
                          <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                        </div>
                        <div className={`p-3 rounded-lg bg-elevated ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                {/* Quick Actions */}
                <Card className="!p-6">
                  <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    <SparkleIcon className="w-5 h-5 text-purple-400" />
                    Quick Actions
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <Link to="/profile">
                      <Button variant="secondary" className="w-full" icon={<UserIcon className="w-4 h-4" />}>
                        Edit Profile
                      </Button>
                    </Link>
                    <Button 
                      variant="secondary" 
                      className="w-full" 
                      icon={<PortfolioIcon className="w-4 h-4" />}
                      onClick={() => setActiveSection('portfolio')}
                    >
                      Manage Portfolio
                    </Button>
                    <Link to="/jobs">
                      <Button variant="secondary" className="w-full" icon={<SearchIcon className="w-4 h-4" />}>
                        Browse Jobs
                      </Button>
                    </Link>
                    <Button 
                      variant="secondary" 
                      className="w-full" 
                      icon={<SettingsIcon className="w-4 h-4" />}
                    >
                      Settings
                    </Button>
                  </div>
                </Card>

                {/* Recent Activity Preview */}
                <Card className="!p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                      <ActivityIcon className="w-5 h-5 text-purple-400" />
                      Recent Activity
                    </h2>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setActiveSection('activity')}
                    >
                      View All
                    </Button>
                  </div>
                  {activities.length === 0 ? (
                    <p className="text-secondary text-center py-8">No recent activity</p>
                  ) : (
                    <div className="space-y-4">
                      {activities.slice(0, 5).map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                    </div>
                  )}
                </Card>

                {/* Recent Transactions */}
                {transactions.length > 0 && (
                  <Card className="!p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <DollarIcon className="w-5 h-5 text-green-400" />
                      Recent Transactions
                    </h2>
                    <div className="space-y-3">
                      {transactions.slice(0, 5).map((transaction) => (
                        <div key={transaction.id} className="flex items-center justify-between p-3 rounded-lg bg-elevated">
                          <div>
                            <p className="text-sm font-medium">{transaction.description || transaction.transaction_type}</p>
                            <p className="text-xs text-secondary">
                              {new Date(transaction.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`font-semibold ${
                              transaction.transaction_type === 'payment' ? 'text-green-400' : 'text-yellow-400'
                            }`}>
                              ${parseFloat(transaction.amount.toString()).toLocaleString()}
                            </p>
                            <p className="text-xs text-secondary capitalize">{transaction.status}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}
              </div>
            )}

            {/* Active Projects Section */}
            {activeSection === 'projects' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Active Projects</h1>
                  <p className="text-secondary">Manage your ongoing projects</p>
                </div>
                
                {workspaces.length === 0 ? (
                  <Card className="!p-12 text-center">
                    <ProjectIcon className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No active projects</h3>
                    <p className="text-secondary mb-6">Start by browsing available jobs</p>
                    <Link to="/jobs">
                      <Button variant="primary" icon={<SearchIcon className="w-4 h-4" />}>
                        Browse Jobs
                      </Button>
                    </Link>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {workspaces.map((workspace) => (
                      <Card key={workspace.id} className="!p-6" hover>
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{workspace.job_title}</h3>
                            <p className="text-sm text-secondary">{workspace.employer_company_name}</p>
                            <p className="text-brand font-semibold mt-2">${workspace.job_budget?.toLocaleString() || 0}</p>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            workspace.status === 'active' ? 'bg-green-500/10 text-green-400' :
                            workspace.status === 'in_progress' ? 'bg-blue-500/10 text-blue-400' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {workspace.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
                          <span className="text-sm text-secondary">
                            Started {new Date(workspace.created_at).toLocaleDateString()}
                          </span>
                          <Link to={`/workspace/${workspace.id}`}>
                            <Button variant="primary" size="sm">
                              Open Workspace
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Job Inbox Section */}
            {activeSection === 'inbox' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Job Inbox</h1>
                  <p className="text-secondary">Review job invitations from employers</p>
                </div>
                
                {invitations.length === 0 ? (
                  <Card className="!p-12 text-center">
                    <MailIcon className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No job invitations</h3>
                    <p className="text-secondary">Complete your profile to receive invitations from employers</p>
                  </Card>
                ) : (
                  <div className="space-y-4">
                    {invitations.map((invitation) => (
                      <Card key={invitation.id} className="!p-6" hover>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold mb-1">{invitation.job_title}</h3>
                            <p className="text-sm text-secondary mb-2">{invitation.employer_company_name}</p>
                            {invitation.message && (
                              <p className="text-sm text-primary mb-3 p-3 bg-elevated rounded">
                                {invitation.message}
                              </p>
                            )}
                            <p className="text-brand font-semibold">${invitation.job_budget?.toLocaleString() || 0}</p>
                            <p className="text-xs text-secondary mt-2">
                              Received {new Date(invitation.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleInvitationResponse(invitation.id, 'declined')}
                            >
                              Decline
                            </Button>
                            <Button 
                              variant="primary" 
                              size="sm"
                              onClick={() => handleInvitationResponse(invitation.id, 'accepted')}
                            >
                              Accept
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Portfolio Section */}
            {activeSection === 'portfolio' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">Portfolio</h1>
                    <p className="text-secondary">Showcase your best work to potential clients</p>
                  </div>
                  <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />}>
                    Add Project
                  </Button>
                </div>
                
                {portfolioProjects.length === 0 ? (
                  <Card className="!p-12 text-center">
                    <PortfolioIcon className="w-16 h-16 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Build Your Portfolio</h3>
                    <p className="text-secondary mb-6">Add projects to showcase your skills and experience</p>
                    <Button variant="primary" icon={<PlusIcon className="w-4 h-4" />}>
                      Add Project
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {portfolioProjects.map((project) => (
                      <Card key={project.id} className="!p-0 overflow-hidden" hover>
                        {project.thumbnail_url && (
                          <div className="aspect-video bg-elevated">
                            <img 
                              src={project.thumbnail_url} 
                              alt={project.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="p-6">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-lg font-semibold flex-1">{project.title}</h3>
                            {project.is_featured && (
                              <span className="px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-400">
                                Featured
                              </span>
                            )}
                          </div>
                          {project.description && (
                            <p className="text-sm text-secondary mb-4 line-clamp-3">{project.description}</p>
                          )}
                          {project.project_url && (
                            <a 
                              href={project.project_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-sm text-brand hover:underline"
                            >
                              View Project →
                            </a>
                          )}
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Activity Section */}
            {activeSection === 'activity' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2">Recent Activity</h1>
                  <p className="text-secondary">Your timeline of recent actions and events</p>
                </div>
                
                <Card className="!p-6">
                  {activities.length === 0 ? (
                    <div className="text-center py-8">
                      <ActivityIcon className="w-16 h-16 text-secondary mx-auto mb-4" />
                      <p className="text-secondary">No recent activity</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activities.map((activity) => (
                        <ActivityItem key={activity.id} activity={activity} />
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            )}
          </div>
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

// Activity Item Component
function ActivityItem({ activity }: { activity: Activity }) {
  const getActivityIcon = (action: string) => {
    const actionLower = action.toLowerCase();
    if (actionLower.includes('view') || actionLower.includes('profile')) {
      return <EyeIcon className="w-5 h-5" />;
    }
    if (actionLower.includes('invitation') || actionLower.includes('invite')) {
      return <MailIcon className="w-5 h-5" />;
    }
    if (actionLower.includes('project') || actionLower.includes('workspace')) {
      return <ProjectIcon className="w-5 h-5" />;
    }
    if (actionLower.includes('login') || actionLower.includes('logout')) {
      return <UserIcon className="w-5 h-5" />;
    }
    return <ActivityIcon className="w-5 h-5" />;
  };

  const getActivityDescription = (activity: Activity) => {
    const details = activity.details || {};
    let description = activity.action;
    
    if (activity.entity_type && activity.entity_id) {
      description += ` for ${activity.entity_type} #${activity.entity_id}`;
    }
    
    return description;
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-lg bg-elevated">
      <div className="p-2 rounded-full bg-purple-500/10 text-purple-400">
        {getActivityIcon(activity.action)}
      </div>
      <div className="flex-1">
        <p className="text-sm text-primary">{getActivityDescription(activity)}</p>
        <p className="text-xs text-secondary mt-1">
          {new Date(activity.created_at).toLocaleString()}
        </p>
      </div>
    </div>
  );
}

// SVG Icon Components
function DashboardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function DollarIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ProjectIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );
}

function PortfolioIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
    </svg>
  );
}

function ActivityIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function SparkleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
    </svg>
  );
}

function LoadingSpinner() {
  return (
    <svg className="animate-spin h-10 w-10 text-purple-500 mx-auto" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}
