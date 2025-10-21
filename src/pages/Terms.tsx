import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Terms() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Terms of Service</h1>
          <p className="text-secondary mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6">
            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">1. Acceptance of Terms</h2>
              <p className="text-secondary mb-2">
                By accessing and using VorixHub, you accept and agree to be bound by the terms and provisions of this agreement.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">2. Platform Rules</h2>
              <div className="space-y-2 text-secondary">
                <p>All users must comply with the following rules:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Minimum project value of $500</li>
                  <li>No bidding or direct negotiations outside admin-curated matches</li>
                  <li>All communication and file sharing must occur within the platform workspace</li>
                  <li>Employers must be verified before posting jobs</li>
                  <li>Freelancers must maintain accurate and updated portfolios</li>
                </ul>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">3. Fees and Payments</h2>
              <div className="space-y-2 text-secondary">
                <p>Platform fees are as follows:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Freelancers: 10% platform fee on all earnings</li>
                  <li>Employers: 5% platform fee on project value</li>
                  <li>Payment processing fees may apply</li>
                </ul>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">4. User Conduct</h2>
              <p className="text-secondary mb-2">
                Users must not engage in fraudulent activities, harassment, or violation of intellectual property rights. VorixHub reserves the right to suspend or terminate accounts that violate these terms.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">5. Dispute Resolution</h2>
              <p className="text-secondary">
                VorixHub provides dispute management services for project-related conflicts. All disputes must be submitted through the platform's dispute management system.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">6. Intellectual Property</h2>
              <p className="text-secondary">
                Users retain ownership of their work and content. By using VorixHub, users grant the platform a license to display portfolio content for matching and promotional purposes.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">7. Limitation of Liability</h2>
              <p className="text-secondary">
                VorixHub is not liable for the quality of work, payment disputes between users, or any damages arising from the use of the platform. We act as a facilitator and curated matching service.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">8. Changes to Terms</h2>
              <p className="text-secondary">
                VorixHub reserves the right to modify these terms at any time. Users will be notified of significant changes via email.
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}