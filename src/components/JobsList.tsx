import React, { useEffect, useState } from 'react';
import { useSession } from '@/components/SessionContextProvider';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { showError } from '@/utils/toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  budget: number | null;
  location: string | null;
  status: string;
  created_at: string;
  employer_id: string;
}

interface JobsListProps {
  searchTerm: string;
}

const JobsList: React.FC<JobsListProps> = ({ searchTerm }) => {
  const { supabase, session } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      if (!session) {
        setLoading(false);
        return;
      }

      setLoading(true);
      let query = supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (searchTerm) {
        query = query.or(`title.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
      }

      const { data, error } = await query;

      if (error) {
        showError(`Failed to fetch jobs: ${error.message}`);
        setLoading(false);
        return;
      }
      setJobs(data || []);
      setLoading(false);
    };

    fetchJobs();
  }, [session, supabase, searchTerm]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return <p className="text-center text-gray-600 dark:text-gray-300">Please log in to view jobs.</p>;
  }

  if (jobs.length === 0 && searchTerm) {
    return <p className="text-center text-gray-600 dark:text-gray-300">No jobs found matching "{searchTerm}".</p>;
  }

  if (jobs.length === 0) {
    return <p className="text-center text-gray-600 dark:text-gray-300">No jobs posted yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {jobs.map((job) => (
        <Card key={job.id} className="flex flex-col">
          <CardHeader>
            <CardTitle>{job.title}</CardTitle>
            <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
              {job.location ? `Location: ${job.location}` : 'Location: N/A'}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow">
            <p className="text-gray-700 dark:text-gray-200 mb-4 line-clamp-3">{job.description}</p>
            <div className="flex justify-between items-center mt-auto">
              <span className="text-lg font-semibold text-primary">
                {job.budget ? `$${job.budget.toLocaleString()}` : 'Budget: N/A'}
              </span>
              <Button variant="outline" size="sm">View Details</Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobsList;