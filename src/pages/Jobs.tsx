import React, { useState } from 'react';
import JobsList from '@/components/JobsList';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Input } from '@/components/ui/input';

const Jobs = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-100 dark:bg-gray-900 p-4">
      <div className="w-full max-w-6xl bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md mt-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900 dark:text-white">Available Jobs</h1>
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Search jobs by title or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md mx-auto"
          />
        </div>
        <JobsList searchTerm={searchTerm} />
      </div>
      <MadeWithDyad />
    </div>
  );
};

export default Jobs;