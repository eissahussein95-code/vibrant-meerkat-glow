import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">About VorixHub</h1>
          
          <Card padding="lg" className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">Our Mission</h2>
            <p className="text-secondary mb-4">
              VorixHub was created to solve a fundamental problem in the freelance marketplace: the race to the bottom. Traditional platforms encourage endless bidding wars, spam proposals, and quantity over quality.
            </p>
            <p className="text-secondary">
              We believe exceptional talent deserves exceptional opportunities. That's why we built a curated marketplace where quality is paramount and every match is personally reviewed.
            </p>
          </Card>

          <Card padding="lg" className="mb-8">
            <h2 className="text-2xl font-semibold text-primary mb-4">What Makes Us Different</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <svg className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-primary font-semibold">No Bidding System</p>
                  <p className="text-secondary text-sm">Admin-curated matching means freelancers don't compete on price</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-primary font-semibold">$500+ Minimum</p>
                  <p className="text-secondary text-sm">Ensures serious projects and professional engagement</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-primary font-semibold">Verified Employers</p>
                  <p className="text-secondary text-sm">Every employer is verified before posting jobs</p>
                </div>
              </li>
              <li className="flex items-start">
                <svg className="w-6 h-6 text-purple-500 mr-3 flex-shrink-0 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <p className="text-primary font-semibold">Built-in Workspace</p>
                  <p className="text-secondary text-sm">Complete project management, chat, file sharing in one place</p>
                </div>
              </li>
            </ul>
          </Card>

          <Card padding="lg" gradient>
            <h2 className="text-2xl font-semibold text-primary mb-4">Our Values</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-brand mb-2">Quality</h3>
                <p className="text-secondary text-sm">We prioritize exceptional work over high volume</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand mb-2">Trust</h3>
                <p className="text-secondary text-sm">Transparent processes and verified professionals</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-brand mb-2">Respect</h3>
                <p className="text-secondary text-sm">Fair compensation and professional relationships</p>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}