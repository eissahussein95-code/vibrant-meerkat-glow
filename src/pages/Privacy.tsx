import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Card from '../components/Card';

export default function Privacy() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow pt-24 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-6">Privacy Policy</h1>
          <p className="text-secondary mb-8">Last updated: {new Date().toLocaleDateString()}</p>

          <div className="space-y-6">
            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">1. Information We Collect</h2>
              <div className="space-y-2 text-secondary">
                <p>We collect information that you provide directly to us, including:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Account information (name, email, phone, company details)</li>
                  <li>Profile and portfolio information</li>
                  <li>Project and communication data</li>
                  <li>Payment and transaction information</li>
                  <li>Usage data and analytics</li>
                </ul>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">2. How We Use Your Information</h2>
              <div className="space-y-2 text-secondary">
                <p>We use the information we collect to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Provide, maintain, and improve our services</li>
                  <li>Facilitate admin-curated matching between freelancers and employers</li>
                  <li>Process payments and transactions</li>
                  <li>Send administrative and promotional communications</li>
                  <li>Monitor and analyze platform usage and trends</li>
                  <li>Detect and prevent fraud and abuse</li>
                </ul>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">3. Information Sharing</h2>
              <p className="text-secondary mb-2">
                We do not sell your personal information. We may share your information in the following situations:
              </p>
              <ul className="list-disc list-inside space-y-1 ml-4 text-secondary">
                <li>With other users as part of the matching and collaboration process</li>
                <li>With service providers who assist in platform operations</li>
                <li>For legal compliance or protection of rights</li>
                <li>In connection with a merger, sale, or acquisition</li>
              </ul>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">4. Data Security</h2>
              <p className="text-secondary">
                We implement industry-standard security measures to protect your information, including encryption, secure servers, and regular security audits. However, no method of transmission over the internet is 100% secure.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">5. Your Rights</h2>
              <div className="space-y-2 text-secondary">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt-out of marketing communications</li>
                  <li>Request a copy of your data</li>
                  <li>Object to certain data processing activities</li>
                </ul>
              </div>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">6. Cookies and Tracking</h2>
              <p className="text-secondary">
                We use cookies and similar tracking technologies to collect usage information and improve user experience. You can control cookie preferences through your browser settings.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">7. Third-Party Services</h2>
              <p className="text-secondary">
                VorixHub integrates with third-party services (payment processors, analytics providers, etc.). These services have their own privacy policies governing their use of your information.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">8. Children's Privacy</h2>
              <p className="text-secondary">
                VorixHub is not intended for users under 18 years of age. We do not knowingly collect personal information from children.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">9. Changes to This Policy</h2>
              <p className="text-secondary">
                We may update this privacy policy from time to time. We will notify you of significant changes via email or through the platform.
              </p>
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-semibold text-primary mb-3">10. Contact Us</h2>
              <p className="text-secondary">
                If you have questions about this privacy policy, please contact us at privacy@vorixhub.com.
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}